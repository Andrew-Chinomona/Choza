import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    // 1. Grab the mockRole from the frontend
    const { mockRole } = await request.json();

    // 2. BYPASS THE DATABASE ENTIRELY FOR TESTING
    // We instantly create a fake user payload based on the requested role
    const payload = {
      user_id: 'test-user-id-123',
      role: mockRole || 'HOUSEKEEPER', // Fallback just in case
      hotel_id: 'test-hotel-id-456', // Required for multi-tenant scope [cite: 97, 104]
      role_tier: mockRole === 'MAIN_MANAGER' || mockRole === 'OPS_MANAGEMENT' ? 'ops' : 'staff'
    };

    // 3. Sign the token using your .env secret
    const token = jwt.sign(payload, process.env.AUTH_JWT_SECRET!, { expiresIn: '8h' });

    // 4. Set the secure, HTTP-only cookie 
    const cookieStore = await cookies();
    cookieStore.set('homs_session', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}