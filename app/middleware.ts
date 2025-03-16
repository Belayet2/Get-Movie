import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname;

  // Check if the path is for the admin control panel
  if (pathname.startsWith('/admin-control-panel')) {
    // For the main admin control panel page, check for authentication cookie
    // instead of redirecting immediately
    const isAuthenticated = request.cookies.has('adminLoggedIn');
    
    if (!isAuthenticated) {
      // If not authenticated, redirect to login
      const url = new URL('/admin-login', request.url);
      return NextResponse.redirect(url);
    }
    
    // If authenticated, allow access
    return NextResponse.next();
  }
  
  // For all other routes, continue normally
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ['/admin-control-panel', '/admin-control-panel/:path*'],
}; 