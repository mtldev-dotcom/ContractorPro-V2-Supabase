import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Extract locale from pathname (e.g., '/en/dashboard' -> 'en')
  const pathSegments = request.nextUrl.pathname.split('/').filter(Boolean)
  const supportedLocales = ['en', 'fr']
  const locale = pathSegments[0] && supportedLocales.includes(pathSegments[0]) ? pathSegments[0] : 'en'
  const pathWithoutLocale = pathSegments[0] && supportedLocales.includes(pathSegments[0]) 
    ? '/' + pathSegments.slice(1).join('/')
    : request.nextUrl.pathname

  // Helper function to check if user needs onboarding
  const checkUserNeedsOnboarding = async (userId: string) => {
    try {
      const { data: companyAssociations, error } = await supabase
        .from('user_companies')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
      
      if (error) {
        console.error('Error checking company associations:', error)
        return true // Default to needing onboarding if we can't check
      }
      
      return !companyAssociations || companyAssociations.length === 0
    } catch (error) {
      console.error('Error in checkUserNeedsOnboarding:', error)
      return true
    }
  }

  // redirect authenticated user away from auth pages
  if (user && pathWithoutLocale.startsWith('/auth')) {
    // Check if user needs onboarding
    const needsOnboarding = await checkUserNeedsOnboarding(user.id)
    
    const url = request.nextUrl.clone()
    if (needsOnboarding) {
      url.pathname = `/${locale}/onboarding`
    } else {
      url.pathname = `/${locale}/dashboard`
    }
    return NextResponse.redirect(url)
  }

  // For authenticated users accessing protected routes, check if they need onboarding
  if (user && !pathWithoutLocale.startsWith('/onboarding') && !pathWithoutLocale.startsWith('/auth') && pathWithoutLocale !== '/') {
    const needsOnboarding = await checkUserNeedsOnboarding(user.id)
    
    if (needsOnboarding) {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/onboarding`
      return NextResponse.redirect(url)
    }
  }

  if (
    !user &&
    !pathWithoutLocale.startsWith('/auth/login') &&
    !pathWithoutLocale.startsWith('/auth') &&
    pathWithoutLocale !== '/' // allow access to root page
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/auth/login`
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
