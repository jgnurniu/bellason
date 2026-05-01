import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { SERVICES } from '../../constants/services'

export default function Feed() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('')
  const [credits, setCredits]   = useState(0)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()

      // Cargar créditos del proveedor
      const { data: credit } = await supabase
        .from('credits')
        .select('balance')
        .eq('provider_id', user.id)
        .single()
      setCredits(credit?.balance || 0)

      // Cargar solicitudes abiertas
      const { data } = await supabase
        .from('requests')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
      setRequests(data || [])
      setLoading(false)
    }
    load()
  }, [])

  function getServiceLabel(id) {
    return SERVICES.find(s => s.id === id)?.label || id
  }

  const filtered = filter
    ? requests.filter(r => r.service === filter)
    : requests

  if (loading) return <div style={{ minHeight: '100vh', backgroundColor: '#0a0010' }} />

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Bellason</h1>
        <div style={styles.creditsBox}>
          <span style={styles.creditsLabel}>Créditos</span>
          <span style={styles.creditsValue}>{credits}</span>
        </div>
      </div>

      {credits === 0 && (
        <div style={styles.alert}>
          ⚠️ Sin créditos. Recarga para poder hacer ofertas.
          <button
            style={styles.rechargeBtn}
            onClick={() => navigate('/recargar')}
          >
            Recargar
          </button>
        </div>
      )}

      {/* Filtro por servicio */}
      <div style={styles.filters}>
        <button
          style={filter === '' ? styles.chipActive : styles.chip}
          onClick={() => setFilter('')}
        >
          Todos
        </button>
        {SERVICES.map(s => (
          <button
            key={s.id}
            style={filter === s.id ? styles.chipActive : styles.chip}
            onClick={() => setFilter(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={styles.empty}>
          <p>No hay solicitudes disponibles.</p>
        </div>
      )}

      {filtered.map(req => (
        <div
          key={req.id}
          style={styles.card}
          onClick={() => navigate(`/solicitudes/${req.id}`)}
        >
          <div style={styles.cardTop}>
            <span style={styles.service}>{getServiceLabel(req.service)}</span>
            <span style={styles.zone}>📍 {req.zone}</span>
          </div>

          {req.description && (
            <p style={styles.description}>{req.description}</p>
          )}

          <div style={styles.cardBottom}>
            {req.budget_min ? (
              <span style={styles.budget}>
                💰 ${req.budget_min} — ${req.budget_max} MXN
              </span>
            ) : (
              <span style={styles.budget}>💰 Presupuesto abierto</span>
            )}
            {req.preferred_date && (
              <span style={styles.date}>
                📅 {new Date(req.preferred_date).toLocaleDateString('es-MX')}
              </span>
            )}
          </div>

          <button style={styles.offerBtn}>Hacer oferta →</button>
        </div>
      ))}
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0010',
    padding: '1.5rem 1rem',
    maxWidth: '480px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  title: {
    color: '#a855f7',
    fontSize: '1.75rem',
    fontWeight: '700',
    margin: 0,
  },
  creditsBox: {
    backgroundColor: '#12001f',
    border: '1px solid #3b0764',
    borderRadius: '8px',
    padding: '0.4rem 0.85rem',
    textAlign: 'center',
  },
  creditsLabel: {
    color: '#9ca3af',
    fontSize: '0.7rem',
    display: 'block',
  },
  creditsValue: {
    color: '#a855f7',
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  alert: {
    backgroundColor: '#2d1500',
    border: '1px solid #92400e',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#fbbf24',
    fontSize: '0.85rem',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.5rem',
  },
  rechargeBtn: {
    padding: '0.4rem 0.85rem',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#f59e0b',
    color: '#000',
    fontWeight: '700',
    fontSize: '0.8rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  chip: {
    padding: '0.4rem 0.85rem',
    borderRadius: '20px',
    border: '1px solid #3b0764',
    backgroundColor: 'transparent',
    color: '#9ca3af',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  chipActive: {
    padding: '0.4rem 0.85rem',
    borderRadius: '20px',
    border: '1px solid #a855f7',
    backgroundColor: '#a855f720',
    color: '#a855f7',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: '3rem',
  },
  card: {
    backgroundColor: '#12001f',
    border: '1px solid #3b0764',
    borderRadius: '12px',
    padding: '1rem',
    marginBottom: '1rem',
    cursor: 'pointer',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  service: {
    color: '#a855f7',
    fontWeight: '700',
    fontSize: '1rem',
  },
  zone: {
    color: '#9ca3af',
    fontSize: '0.85rem',
  },
  description: {
    color: '#d1d5db',
    fontSize: '0.9rem',
    margin: '0.25rem 0 0.5rem',
  },
  cardBottom: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '0.75rem',
  },
  budget: {
    color: '#9ca3af',
    fontSize: '0.85rem',
  },
  date: {
    color: '#9ca3af',
    fontSize: '0.85rem',
  },
  offerBtn: {
    width: '100%',
    padding: '0.6rem',
    borderRadius: '8px',
    border: '1px solid #7c3aed',
    backgroundColor: 'transparent',
    color: '#a855f7',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
}