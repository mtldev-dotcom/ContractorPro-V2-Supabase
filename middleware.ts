import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Handle authentication first for protected routes
  const authResponse = await updateSession(request);
  
  // If auth middleware wants to redirect, return that redirect
  if (authResponse && authResponse.status >= 300 && authResponse.status < 400) {
    return authResponse;
  }
  
  // Otherwise, handle internationalization
  const intlResponse = intlMiddleware(request);
  
  // If intl middleware wants to redirect, return that redirect
  if (intlResponse) {
    return intlResponse;
  }
  
  // Return the auth response (which might have updated cookies)
  return authResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes) <- exclude API routes from intl middleware so they aren't redirected
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
