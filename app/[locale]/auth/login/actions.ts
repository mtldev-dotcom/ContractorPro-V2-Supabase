'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

async function getLocaleFromHeaders() {
  const headersList = await headers()
  const referer = headersList.get('referer') || ''
  const url = new URL(referer)
  const locale = url.pathname.split('/')[1]
  return ['en', 'fr'].includes(locale) ? locale : 'en'
}

async function checkUserNeedsOnboarding(userId: string) {
  const supabase = await createClient()
  
  // Check if user has any company associations
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
}

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

export async function login(formData: FormData) {
  const email = formData.get('email')?.toString() ?? ''
  const password = formData.get('password')?.toString() ?? ''
  const supabase = await createClient()
  const locale = await getLocaleFromHeaders()
  
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  
  if (error) {
    redirect(`/${locale}/error`)
    return
  }
  
  if (data.user) {
    // Ensure user exists in database with admin role
    await ensureUserInDatabase(data.user.id, data.user.email || email)
    
    // Check if user needs onboarding
    const needsOnboarding = await checkUserNeedsOnboarding(data.user.id)
    
    if (needsOnboarding) {
      redirect(`/${locale}/onboarding`)
      return
    }
  }
  
  redirect(`/${locale}/dashboard`)
}

export async function signup(formData: FormData) {
  const email = formData.get('email')?.toString() ?? ''
  const password = formData.get('password')?.toString() ?? ''
  const supabase = await createClient()
  const locale = await getLocaleFromHeaders()
  
  // Validate input
  if (!email || !password) {
    redirect(`/${locale}/error?message=Email and password are required`)
    return
  }
  
  if (password.length < 6) {
    redirect(`/${locale}/error?message=Password must be at least 6 characters`)
    return
  }
  
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password
  })
  
  if (error) {
    console.error('Signup error:', error)
    redirect(`/${locale}/error?message=${encodeURIComponent(error.message)}`)
    return
  }
  
  if (data.user) {
    // Ensure user exists in database with admin role
    const userCreated = await ensureUserInDatabase(data.user.id, data.user.email || email)
    
    if (!userCreated) {
      console.error('Failed to create user in database')
      // Continue anyway - the trigger should handle user creation
    }
    
    // If user is confirmed immediately (no email verification), redirect to onboarding
    if (data.user.email_confirmed_at) {
      // User confirmed, redirect to onboarding
      redirect(`/${locale}/onboarding`)
      return
    } else {
      // If email confirmation is required, show success message
      redirect(`/${locale}/error?message=Account created! Please check your email and click the confirmation link to complete signup.`)
      return
    }
  }
  
  redirect(`/${locale}/dashboard`)
}
