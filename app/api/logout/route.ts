import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' }, { status: 200 });

  // Instantly expire the secure cookies
  response.cookies.set('sathi_access', '', { maxAge: 0, path: '/' });
  response.cookies.set('sathi_refresh', '', { maxAge: 0, path: '/' });

  return response;
}