import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { registerPlayerSchema, registerOwnerSchema } from '../../../lib/validation/auth.schema'
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Determine Role & Validate Payload
    if (body.role === 'PLAYER') {
      const parsedData = registerPlayerSchema.safeParse(body);
      if (!parsedData.success) {
        return NextResponse.json({ success: false, errors: parsedData.error.flatten().fieldErrors }, { status: 400 });
      }

      // 2. Check for duplicate emails
      const existingUser = await prisma.user.findUnique({ where: { email: parsedData.data.email } });
      if (existingUser) {
        return NextResponse.json({ success: false, message: 'Email is already registered' }, { status: 409 });
      }

      // 3. Hash Password securely
      const passwordHash = await bcrypt.hash(parsedData.data.password, 12);

      // 4. Create User and Nested Profile atomically
      const newUser = await prisma.user.create({
        data: {
          email: parsedData.data.email,
          passwordHash,
          role: 'PLAYER',
          playerProfile: {
            create: {
              fullName: parsedData.data.fullName,
              phoneNumber: parsedData.data.phoneNumber,
              location: parsedData.data.location,
              age: parsedData.data.age,
              preferredPosition: parsedData.data.preferredPosition,
              skillLevel: parsedData.data.skillLevel,
              bio: parsedData.data.bio || '',
            },
          },
        },
      });

      return NextResponse.json({ success: true, message: 'Player account created', userId: newUser.id }, { status: 201 });
    } 
    
    if (body.role === 'OWNER') {
      const parsedData = registerOwnerSchema.safeParse(body);
      if (!parsedData.success) {
        return NextResponse.json({ success: false, errors: parsedData.error.flatten().fieldErrors }, { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({ where: { email: parsedData.data.email } });
      if (existingUser) {
        return NextResponse.json({ success: false, message: 'Email is already registered' }, { status: 409 });
      }

      const passwordHash = await bcrypt.hash(parsedData.data.password, 12);

      const newUser = await prisma.user.create({
        data: {
          email: parsedData.data.email,
          passwordHash,
          role: 'OWNER',
          ownerProfile: {
            create: {
              fullName: parsedData.data.fullName,
              phoneNumber: parsedData.data.phoneNumber,
              futsalName: parsedData.data.futsalName,
              futsalLocation: parsedData.data.futsalLocation,
            },
          },
        },
      });

      return NextResponse.json({ success: true, message: 'Owner account created and pending verification', userId: newUser.id }, { status: 201 });
    }

    return NextResponse.json({ success: false, message: 'Invalid role specified' }, { status: 400 });

  } catch (error) {
    console.error('[REGISTER_API_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}