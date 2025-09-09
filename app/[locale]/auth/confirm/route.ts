import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

async function ensureUserInDatabase(userId: string, email: string) {
  const supabase = await createClient()
  
  // Check if user exists in users table
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  
  if (fetchError && !fetchError.message.includes('policy')) {
    console.error('Error fetching user:', fetchError)
    return false
  }
  
  // If user doesn't exist, create them with admin role
  if (!existingUser) {
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: email,
        first_name: '',
        last_name: '',
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    
    if (insertError && !insertError.message.includes('policy')) {
      console.error('Error creating user:', insertError)
      return false
    }
  } else if (existingUser.role !== 'admin') {
    // Update existing user to admin role if they're not already
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        role: 'admin',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
    
    if (updateError && !updateError.message.includes('policy')) {
      console.error('Error updating user role:', updateError)
    }
  }
  
  return true
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  // Extract locale from request URL
  const url = new URL(request.url)
  const pathSegments = url.pathname.split('/').filter(Boolean)
  const supportedLocales = ['en', 'fr']
  const locale = pathSegments[0] && supportedLocales.includes(pathSegments[0]) ? pathSegments[0] : 'en'

  if (token_hash && type) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error && data.user) {
      console.log('User confirmed email')
      
      // Ensure user exists in database with admin role
      await ensureUserInDatabase(data.user.id, data.user.email || '')
      
      // Redirect new users to onboarding
      redirect(`/${locale}/onboarding`)
    }
  }

  console.log('User did not confirm email')
  // redirect the user to an error page with some instructions
  redirect(`/${locale}/error?message=Email confirmation failed. Please try again.`)
}