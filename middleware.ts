import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)
  
  // Check if user is authenticated and trying to access dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const supabase = await import('@/utils/supabase/server').then(m => m.createClient())
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Check if user has completed onboarding (has company associations)
      const { data: companyAssociations } = await supabase
        .from('user_companies')
        .select('*')
        .eq('user_id', user.id)
      
      // If no company associations, redirect to onboarding
      if (!companyAssociations || companyAssociations.length === 0) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    }
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}