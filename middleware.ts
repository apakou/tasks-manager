import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';

// Define protected routes
const protectedRoutes = ['/dashboard', '/tasks', '/calendar', '/profile'];
const authRoutes = ['/login', '/signup', '/forgot-password'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.some(route => path.startsWith(route));
  
  // Create supabase client
  const { supabase, response } = createClient(request);
  
  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  // Redirect to login if trying to access protected route without user
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect to dashboard if trying to access auth routes while authenticated
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Redirect root path to appropriate page
  if (path === '/') {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};