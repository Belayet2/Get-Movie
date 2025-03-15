import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname;

  // Check if the path is for the admin control panel
  if (pathname.startsWith('/admin-control-panel')) {
    // For the main admin control panel page, check client-side authentication
    if (pathname === '/admin-control-panel') {
      return NextResponse.next();
    }
    
    // For any subpage, redirect to login
    // This ensures that even if the client-side check is bypassed,
    // the server will still redirect to the login page
    const url = new URL('/admin-login', request.url);
    return NextResponse.redirect(url);
  }
  
  // For all other routes, continue normally
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ['/admin-control-panel', '/admin-control-panel/:path*'],
}; 