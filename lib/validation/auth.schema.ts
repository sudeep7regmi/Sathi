import { z } from 'zod';

// Base user properties shared across roles
const baseAuthSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const registerPlayerSchema = baseAuthSchema.extend({
  role: z.literal('PLAYER'),
  fullName: z.string().min(2, 'Full name is required'),
  phoneNumber: z.string().min(7, 'Valid phone number is required'),
  location: z.string().min(2, 'Location is required'),
  age: z.number().min(5, 'Must be at least 5 years old').max(100),
  preferredPosition: z.string().min(2, 'Position is required'),
  skillLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PRO']),
  bio: z.string().max(500).optional(),
});

export const registerOwnerSchema = baseAuthSchema.extend({
  role: z.literal('OWNER'),
  fullName: z.string().min(2, 'Full name is required'),
  phoneNumber: z.string().min(7, 'Valid phone number is required'),
  futsalName: z.string().min(2, 'Futsal name is required'),
  futsalLocation: z.string().min(2, 'Futsal location is required'),
});

export const loginSchema = baseAuthSchema;

export type RegisterPlayerInput = z.infer<typeof registerPlayerSchema>;
export type RegisterOwnerInput = z.infer<typeof registerOwnerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;