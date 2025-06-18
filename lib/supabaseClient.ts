import { createClient } from "@supabase/supabase-js"

/**
 * Shared, singleton Supabase client for the browser.
 * 
 * We only ever create one client instance so that connections /
 * subscriptions are reused across renders.
 *
 * Environment variables are supplied via NEXT_PUBLIC_*
 * so they are accessible in the browser bundle.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// NOTE: The generic type parameter can be used for generated types.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const supabase = (() => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase environment variables are missing. " +
        "Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
    )
  }
  return createClient(supabaseUrl, supabaseAnonKey)
})()
