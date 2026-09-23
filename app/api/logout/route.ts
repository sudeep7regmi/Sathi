import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthError, authenticateRequest } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await authenticateRequest(request);
    await prisma.user.update({
      where: { id: user.userId },
      data: { refreshToken: null },
    });
  } catch (error) {
    if (!(error instanceof AuthError)) {
      console.error('[LOGOUT_REVOKE_ERROR]', error);
    }
  }
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' }, { status: 200 });

  // Instantly expire the secure cookies
  const isProduction = process.env.NODE_ENV === 'production';
  response.cookies.set('sathi_access', '', { maxAge: 0, path: '/', httpOnly: true, secure: isProduction, sameSite: 'lax' });
  response.cookies.set('sathi_refresh', '', { maxAge: 0, path: '/', httpOnly: true, secure: isProduction, sameSite: 'lax' });

  return response;
}