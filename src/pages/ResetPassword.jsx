import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [success, setSuccess]     = useState(false)
  const [ready, setReady]         = useState(false)

  // Supabase pone el token en el hash — hay que esperar a que lo procese
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError('No se pudo actualizar la contraseña. El link puede haber expirado.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    // Redirigir al login después de 2 segundos
    setTimeout(() => navigate('/login', { replace: true }), 2000)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Bellason</h1>
        <p style={styles.subtitle}>Nueva contraseña</p>

        {success ? (
          <div style={styles.successBox}>
            <p style={styles.successText}>✅ Contraseña actualizada. Redirigiendo...</p>
          </div>
        ) : !ready ? (
          <div style={styles.waitBox}>
            <p style={styles.waitText}>⏳ Verificando link...</p>
            <p style={styles.waitSub}>Si esto tarda, el link puede haber expirado.</p>
            <button style={styles.backBtn} onClick={() => navigate('/login')}>
              Volver al login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              style={styles.input}
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Confirmar contraseña"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />

            {error && <p style={styles.error}>{error}</p>}

            <button
              style={{
                ...styles.button,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0010',
    padding: '1rem',
  },
  card: {
    backgroundColor: '#12001f',
    padding: '2rem',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid #3b0764',
  },
  title: {
    color: '#a855f7',
    fontSize: '2rem',
    fontWeight: '700',
    textAlign: 'center',
    margin: '0 0 0.25rem',
  },
  subtitle: {
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #3b0764',
    backgroundColor: '#0d0018',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
  },
  button: {
    padding: '0.85rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#7c3aed',
    color: '#fff',
    fontWeight: '700',
    fontSize: '1rem',
    marginTop: '0.5rem',
  },
  error: {
    color: '#f87171',
    fontSize: '0.85rem',
    margin: 0,
  },
  successBox: {
    backgroundColor: '#052e16',
    border: '1px solid #166534',
    borderRadius: '8px',
    padding: '1rem',
    textAlign: 'center',
  },
  successText: {
    color: '#4ade80',
    margin: 0,
    fontSize: '0.95rem',
  },
  waitBox: {
    textAlign: 'center',
  },
  waitText: {
    color: '#fbbf24',
    fontSize: '1rem',
    marginBottom: '0.5rem',
  },
  waitSub: {
    color: '#9ca3af',
    fontSize: '0.85rem',
    marginBottom: '1.5rem',
  },
  backBtn: {
    background: 'none',
    border: '1px solid #3b0764',
    borderRadius: '8px',
    color: '#a855f7',
    padding: '0.6rem 1.2rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
}