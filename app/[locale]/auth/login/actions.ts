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

export async function login(formData: FormData) {
  const email = formData.get('email')?.toString() ?? ''
  const password = formData.get('password')?.toString() ?? ''
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  const locale = await getLocaleFromHeaders()
  
  if (error) {
    redirect(`/${locale}/error`)
    return
  }
  redirect(`/${locale}/dashboard`)
}

export async function signup(formData: FormData) {
  const email = formData.get('email')?.toString() ?? ''
  const password = formData.get('password')?.toString() ?? ''
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({ email, password })
  const locale = await getLocaleFromHeaders()
  
  if (error) {
    redirect(`/${locale}/error`)
    return
  }
  redirect(`/${locale}/dashboard`)
}
