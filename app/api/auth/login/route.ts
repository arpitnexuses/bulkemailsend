import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    console.log('Login attempt for email:', email); // Debug log
    
    const { db } = await connectToDatabase();
    
    const user = await db.collection('users').findOne({ email });
    
    console.log('User found:', user ? 'Yes' : 'No'); // Debug log
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    console.log('Password valid:', isPasswordValid); // Debug log
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Set auth cookie with user information
    cookies().set('auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Set user email in another cookie for display purposes
    cookies().set('userEmail', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({ 
      success: true,
      user: { email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error); // Debug log
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 