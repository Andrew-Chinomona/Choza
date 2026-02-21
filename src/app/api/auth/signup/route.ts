import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, fullName, pin, role } = await request.json();

    // 1. Basic validation
    if (!username || !pin || pin.length < 4) {
      return NextResponse.json(
        { error: 'Username and a minimum 4-digit PIN are required' },
        { status: 400 }
      );
    }

    // 2. Hash the PIN securely 
    const saltRounds = 10;
    const pinHash = await bcrypt.hash(pin, saltRounds);

    // 3. Insert into your Neon Postgres Database
    // Note: You will need a dummy hotel_id for now until your Admin creates real hotels
    const dummyHotelId = 'hotel-123'; 

    /* --- NEON DATABASE INSERT (Pseudo-code until you connect the DB driver) ---
      
      const newUser = await executeQuery(`
        INSERT INTO users (hotel_id, username, full_name, pin_hash, role, is_active)
        VALUES ($1, $2, $3, $4, $5, true)
        RETURNING id, username, role
      `, [dummyHotelId, username, fullName, pinHash, role]);
      
    */

    // TEMPORARY: Simulate a successful database insertion for testing
    console.log(`Created user ${username} with role ${role}. Hash: ${pinHash}`);

    return NextResponse.json({ success: true, message: 'Account created successfully' });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}