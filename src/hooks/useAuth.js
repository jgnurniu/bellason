import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser]       = useState(null)
  const [role, setRole]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Carga sesión inicial
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data?.session
      if (session?.user) {
        await loadProfile(session.user)
      }
      setLoading(false)
    })

    // 2. Escucha cambios: login, logout, token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadProfile(session.user)
        } else {
          setUser(null)
          setRole(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(authUser) {
    setUser(authUser)
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', authUser.id)
      .single()
    setRole(profile?.role ?? null)
  }

  return { user, role, loading }
}