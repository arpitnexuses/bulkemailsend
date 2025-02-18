import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Add rate limiting check here if needed
    
    // Your email sending logic
    const result = await sendEmail(data);
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
} 