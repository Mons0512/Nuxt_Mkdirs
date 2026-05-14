
import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(function () {
  const config = useRuntimeConfig()

  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey,
    {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        autoRefreshToken: true,
        persistSession: true,
      }
    }
  )

  return {
    provide: {
      supabase
    }
  }
})
