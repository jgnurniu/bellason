import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [role, setRole]         = useState('client')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone]       = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    const { error: dbError } = await supabase.from('users').insert({
      id: data.user.id,
      role,
      full_name: fullName,
      phone,
    })

    if (dbError) {
      setError(dbError.message)
      setLoading(false)
      return
    }

    if (role === 'client') {
      navigate('/nueva-solicitud')
    } else {
      navigate('/perfil')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Bellason</h1>
        <p style={styles.subtitle}>Crea tu cuenta</p>

        <div style={styles.roleContainer}>
          <button
            style={role === 'client' ? styles.roleActive : styles.role}
            onClick={() => setRole('client')}
            type="button"
          >
            Soy cliente
          </button>
          <button
            style={role === 'provider' ? styles.roleActive : styles.role}
            onClick={() => setRole('provider')}
            type="button"
          >
            Soy proveedora
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Nombre completo"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />
          <input
            style={styles.input}
            placeholder="Teléfono (10 dígitos)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
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
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p style={styles.link}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
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
  roleContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  role: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #3b0764',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#9ca3af',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  roleActive: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #a855f7',
    borderRadius: '8px',
    backgroundColor: '#a855f720',
    color: '#a855f7',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
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
  link: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: '1rem',
    fontSize: '0.9rem',
  },
}