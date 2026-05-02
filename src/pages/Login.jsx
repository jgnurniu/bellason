import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [forgotMode, setForgotMode] = useState(false)
  const [sent, setSent]           = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('authError:', authError)
    console.log('data:', data)

    if (authError) {
      setError('Correo o contraseña incorrectos')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single()

    console.log('profile:', profile)

    if (profile?.role === 'client') {
      navigate('/mis-solicitudes')
    } else if (profile?.role === 'provider') {
      navigate('/solicitudes')
    } else {
      setError('No se encontró el perfil.')
      setLoading(false)
    }
  }

  async function handleForgot(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/reset-password',
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (forgotMode) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Bellason</h1>
          <p style={styles.subtitle}>Recuperar contraseña</p>

          {sent ? (
            <p style={{ color: '#4ade80', textAlign: 'center' }}>
              ✅ Correo enviado. Revisa tu bandeja.
            </p>
          ) : (
            <form onSubmit={handleForgot} style={styles.form}>
              <input
                style={styles.input}
                placeholder="Correo electrónico"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              {error && <p style={styles.error}>{error}</p>}
              <button style={styles.button} type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar correo'}
              </button>
            </form>
          )}

          <p style={styles.link}>
            <span
              style={{ cursor: 'pointer', color: '#a855f7' }}
              onClick={() => { setForgotMode(false); setSent(false) }}
            >
              ← Volver al login
            </span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Bellason</h1>
        <p style={styles.subtitle}>Inicia sesión</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Correo electrónico"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={styles.forgot} onClick={() => setForgotMode(true)}>
          ¿Olvidaste tu contraseña?
        </p>

        <p style={styles.link}>
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
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
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  error: {
    color: '#f87171',
    fontSize: '0.85rem',
    margin: 0,
  },
  forgot: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: '1rem',
    fontSize: '0.85rem',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  link: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: '0.5rem',
    fontSize: '0.9rem',
  },
}