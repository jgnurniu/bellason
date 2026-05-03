import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { SERVICES } from '../../constants/services'
import { ZONES } from '../../constants/zones'

export default function NewRequest() {
  const navigate = useNavigate()
  const [service, setService]     = useState('')
  const [zone, setZone]           = useState('')
  const [description, setDescription] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [date, setDate]           = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()

    const { error: dbError } = await supabase.from('requests').insert({
      client_id: user.id,
      service,
      zone,
      description,
      budget_min: budgetMin ? parseInt(budgetMin) : null,
      budget_max: budgetMax ? parseInt(budgetMax) : null,
      preferred_date: date || null,
    })

    if (dbError) {
      setError(dbError.message)
      setLoading(false)
      return
    }

    navigate('/mis-solicitudes')
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Bellason</h1>
        <p style={styles.subtitle}>¿Qué servicio necesitas?</p>

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Servicio */}
          <label style={styles.label}>Servicio</label>
          <div style={styles.grid}>
            {SERVICES.map(s => (
              <button
                key={s.id}
                type="button"
                style={service === s.id ? styles.chipActive : styles.chip}
                onClick={() => setService(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Zona */}
          <label style={styles.label}>Zona en Hermosillo</label>
          <select
            style={styles.input}
            value={zone}
            onChange={e => setZone(e.target.value)}
            required
          >
            <option value="">Selecciona tu colonia</option>
            {ZONES.map(z => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>

          {/* Descripción */}
          <label style={styles.label}>Descripción (opcional)</label>
          <textarea
            style={{ ...styles.input, height: '80px', resize: 'none' }}
            placeholder="Ej: quiero uñas en gel color nude, diseño sencillo"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          {/* Presupuesto */}
          <label style={styles.label}>Presupuesto aproximado (MXN)</label>
          <div style={styles.row}>
            <input
              style={styles.input}
              placeholder="Mínimo"
              type="number"
              value={budgetMin}
              onChange={e => setBudgetMin(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Máximo"
              type="number"
              value={budgetMax}
              onChange={e => setBudgetMax(e.target.value)}
            />
          </div>

          {/* Fecha */}
          <label style={styles.label}>Fecha preferida (opcional)</label>
          <input
            style={styles.input}
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button
            style={{
              ...styles.button,
              opacity: !service || !zone ? 0.5 : 1,
              cursor: !service || !zone ? 'not-allowed' : 'pointer',
            }}
            type="submit"
            disabled={loading || !service || !zone}
          >
            {loading ? 'Publicando...' : 'Publicar solicitud'}
          </button>
        </form>
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
    maxWidth: '480px',
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
    gap: '0.5rem',
  },
  label: {
    color: '#d8b4fe',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginTop: '0.5rem',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  chip: {
    padding: '0.5rem 0.85rem',
    borderRadius: '20px',
    border: '1px solid #3b0764',
    backgroundColor: 'transparent',
    color: '#9ca3af',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  chipActive: {
    padding: '0.5rem 0.85rem',
    borderRadius: '20px',
    border: '1px solid #a855f7',
    backgroundColor: '#a855f720',
    color: '#a855f7',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #3b0764',
    backgroundColor: '#0d0018',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  row: {
    display: 'flex',
    gap: '0.5rem',
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
}