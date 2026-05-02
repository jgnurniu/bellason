import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { subscribeToPush } from './usePushNotifications'

export function useAuth() {
  const [user, setUser]       = useState(null)
  const [role, setRole]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data?.session
      if (session) {
        setUser(session.user)
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()
        setRole(profile?.role)
        subscribeToPush(session.user.id)
      }
      setLoading(false)
    })
  }, [])

  return { user, role, loading }
}