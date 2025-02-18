import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const response = new Response(null, {
      status: 200,
    });

    // Clear the auth cookie
    response.headers.set(
      "Set-Cookie",
      "auth=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"
    );

    return response;
  } catch (error) {
    return new Response(null, { status: 500 });
  }
} 