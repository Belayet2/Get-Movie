import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { action } = data;

    if (action === 'login') {
      // Set a cookie for authentication
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'adminLoggedIn',
        value: 'true',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      return response;
    } 
    
    if (action === 'logout') {
      // Clear the cookie
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'adminLoggedIn',
        value: '',
        path: '/',
        maxAge: 0,
        httpOnly: true,
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Check if the user is authenticated
  const isAuthenticated = request.cookies.has('adminLoggedIn') && 
                         request.cookies.get('adminLoggedIn')?.value === 'true';
  
  return NextResponse.json({ isAuthenticated });
} 