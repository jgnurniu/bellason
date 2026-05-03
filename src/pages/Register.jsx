import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()

  // Lee ?rol= de la URL que manda el Landing
  const searchParams = new URLSearchParams(window.location.search)
  const rolParam = searchParams.get('rol')
  const [role, setRole] = useState(rolParam === 'provider' ? 'provider' : 'client')

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

    // Validación básica de teléfono
    if (phone.replace(/\D/g, '').length !== 10) {
      setError('El teléfono debe tener 10 dígitos')
      setLoading(false)
      return
    }

    // 1. Crear usuario en Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // 2. Insertar en tabla users
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

    // 3. Si es proveedora, crear perfil vacío
    if (role === 'provider') {
      await supabase.from('provider_profiles').insert({
        user_id: data.user.id,
        whatsapp: phone,
      })
    }

    // 4. Redirigir según rol
    if (role === 'client') {
      navigate('/nueva-solicitud')
    } else {
      navigate('/mi-perfil')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style={{ display: 'inline-block', marginBottom: '8px' }}>
            <path d="M16 3C16 3 8 10 8 17C8 21.4 11.6 25 16 25C20.4 25 24 21.4 24 17C24 10 16 3 16 3Z" fill="#a855f7" opacity="0.9"/>
            <path d="M16 8C16 8 11 13 11 17C11 19.8 13.2 22 16 22C18.8 22 21 19.8 21 17C21 13 16 8 16 8Z" fill="#7c3aed"/>
            <path d="M16 13C16 13 14 15 14 17C14 18.1 14.9 19 16 19C17.1 19 18 18.1 18 17C18 15 16 13 16 13Z" fill="#fff" opacity="0.8"/>
          </svg>
          <h1 style={styles.title}>Bellason</h1>
          <p style={styles.subtitle}>Crea tu cuenta</p>
        </div>

        {/* Selector de rol */}
        <div style={styles.roleContainer}>
          <button
            style={role === 'client' ? styles.roleActive : styles.role}
            onClick={() => setRole('client')}
            type="button"
          >
            👤 Soy cliente
          </button>
          <button
            style={role === 'provider' ? styles.roleActive : styles.role}
            onClick={() => setRole('provider')}
            type="button"
          >
            💅 Soy profesional
          </button>
        </div>

        {/* Info según rol */}
        <div style={styles.roleInfo}>
          {role === 'client' ? (
            <span>✓ Publicar solicitudes es <strong style={{ color: '#a855f7' }}>gratis</strong></span>
          ) : (
            <span>✓ Tienes <strong style={{ color: '#a855f7' }}>1 lead gratis</strong> al registrarte</span>
          )}
        </div>

        {/* Formulario */}
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
            maxLength={10}
            inputMode="numeric"
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
            placeholder="Contraseña (mín. 6 caracteres)"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={6}
            required
          />

          {error && <p style={styles.error}>⚠ {error}</p>}

          <button
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p style={styles.link}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: '#a855f7', fontWeight: '600' }}>
            Inicia sesión
          </Link>
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
    borderRadius: '16px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid rgba(168,85,247,0.25)',
    boxShadow: '0 8px 40px rgba(124,58,237,0.15)',
  },
  title: {
    color: '#a855f7',
    fontSize: '1.6rem',
    fontWeight: '800',
    textAlign: 'center',
    margin: '0 0 4px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    margin: 0,
    fontSize: '0.9rem',
  },
  roleContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  },
  role: {
    flex: 1,
    padding: '0.75rem',
    border: '1.5px solid rgba(168,85,247,0.2)',
    borderRadius: '10px',
    backgroundColor: 'transparent',
    color: 'rgba(255,255,255,0.45)',
    cursor: 'pointer',
    fontSize: '0.88rem',
    fontWeight: '500',
    transition: 'all 0.15s',
  },
  roleActive: {
    flex: 1,
    padding: '0.75rem',
    border: '1.5px solid #a855f7',
    borderRadius: '10px',
    backgroundColor: 'rgba(168,85,247,0.12)',
    color: '#a855f7',
    cursor: 'pointer',
    fontSize: '0.88rem',
    fontWeight: '700',
    transition: 'all 0.15s',
  },
  roleInfo: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    marginBottom: '1.25rem',
    padding: '8px 12px',
    background: 'rgba(168,85,247,0.06)',
    borderRadius: '8px',
    border: '1px solid rgba(168,85,247,0.12)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.7rem',
  },
  input: {
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    border: '1.5px solid rgba(168,85,247,0.2)',
    backgroundColor: '#0d0018',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  button: {
    padding: '0.9rem',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
    color: '#fff',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
    boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
  },
  error: {
    color: '#f87171',
    fontSize: '0.85rem',
    margin: 0,
    padding: '8px 12px',
    background: 'rgba(248,113,113,0.08)',
    borderRadius: '8px',
    border: '1px solid rgba(248,113,113,0.2)',
  },
  link: {
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    marginTop: '1.25rem',
    fontSize: '0.88rem',
  },
}