import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const getJwtSecretKey = () => {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error('The environment variable AUTH_JWT_SECRET is not set.');
  }
  return new TextEncoder().encode(secret);
};

export async function middleware(request: NextRequest) {

  //dev purposes
  return NextResponse.next();

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/auth') || 
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // session cookie
  const token = request.cookies.get('homs_session')?.value;

  const isPublicPath = pathname === '/login' || pathname === '/';

  // if no token, take them to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  //verify and enforce roles
  if (token) {
    try {
      // Decode the token using 'jose'
      const { payload } = await jwtVerify(token, getJwtSecretKey());
      const role = payload.role as string;

      let dashboardUrl = '/';
      if (role === 'HOUSEKEEPER') dashboardUrl = '/housekeeping'; // 
      else if (role === 'MAINTENANCE') dashboardUrl = '/maintenance'; // 
      else if (role === 'OPS_MANAGEMENT' || role === 'MAIN_MANAGER') dashboardUrl = '/management'; // [cite: 309]
      else if (role === 'ADMIN') dashboardUrl = '/admin'; // [cite: 361]

      // If they are logged in and try to go to /login or the root page, redirect them to their dashboard
      if (pathname === '/login' || pathname === '/') {
        return NextResponse.redirect(new URL(dashboardUrl, request.url));
      }

      // RBAC and route guards
      if (pathname.startsWith('/housekeeping') && role !== 'HOUSEKEEPER') {
         return NextResponse.redirect(new URL(dashboardUrl, request.url));
      }
      if (pathname.startsWith('/maintenance') && role !== 'MAINTENANCE') {
         return NextResponse.redirect(new URL(dashboardUrl, request.url));
      }
      if (pathname.startsWith('/management') && !['OPS_MANAGEMENT', 'MAIN_MANAGER', 'ADMIN'].includes(role)) {
         return NextResponse.redirect(new URL(dashboardUrl, request.url));
      }
      if (pathname.startsWith('/admin') && role !== 'ADMIN') {
         return NextResponse.redirect(new URL(dashboardUrl, request.url));
      }

    } catch (error) {
      // If the token is fake, expired, or tampered with, delete it and force a login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('homs_session');
      return response;
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    // Apply middleware to everything except static files and images
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};