import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function createClient() {
  // For server components, we need a simple client
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}