
'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@kit/supabase/hooks/use-supabase'

export function useAuthFixed() {
  const client = useSupabase()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function getSession() {
      try {
        // Get session from Supabase (reads from localStorage)
        const { data: { session } } = await client.auth.getSession()
        
        if (mounted) {
          console.log('Session loaded:', session?.user?.email)
          setUser(session?.user || null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error loading session:', error)
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    // Initial load
    getSession()

    // Listen for auth changes
    const { data: { subscription } } = client.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        if (mounted) {
          setUser(session?.user || null)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [client])

  return { user, loading }
}