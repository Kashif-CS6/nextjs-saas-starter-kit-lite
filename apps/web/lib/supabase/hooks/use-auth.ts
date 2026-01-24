'use client'

import { useAuthChangeListener } from '@kit/supabase/hooks/use-auth-change-listener'
import { useState } from 'react'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useAuthChangeListener({
    appHomePath: '/home', // Change this to your actual home path
    onEvent: (event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    },
  })

  return { user }
}