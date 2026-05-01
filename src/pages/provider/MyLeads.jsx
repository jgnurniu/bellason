import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { SERVICES } from '../../constants/services'

export default function MyLeads() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [arriving, setArriving] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setError(null)
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        requests (
          id, service, zone, description, budget_min, budget_max, preferred_date,
          users ( full_name, phone )
        )
      `)
      .eq('provider_id', user.id)
      .in('status', ['paid', 'arrived', 'completed'])
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setError('No se pudieron cargar tus leads.')
    }

    setLeads(data || [])
    setLoading(false)
  }

  async function markArrived(leadId) {
    setArriving(leadId)

    const { error } = await supabase
      .from('leads')
      .update({ status: 'arrived' })
      .eq('id', leadId)

    if (error) {
      setError('Error al marcar llegada. Intenta de nuevo.')
    }

    setArriving(null)
    load()
  }

  function getServiceLabel(serviceId) {
    return SERVICES.find(s => s.id === serviceId)?.label || serviceId
  }

  function openWhatsApp(phone) {
    const clean = phone.replace(/\D/g, '')
    const number = clean.startsWith('52') ? clean : `52${clean}`
    window.open(`https://wa.me/${number}`, '_blank')
  }

  function openWaze(zone) {
    const query = encodeURIComponent(`${zone}, Hermosillo, Sonora`)
    window.open(`https://waze.com/ul?q=${query}&navigate=yes`, '_blank')
  }

  function openMaps(zone) {
    const query = encodeURIComponent(`${zone}, Hermosillo, Sonora`)
    window.open(`https://maps.google.com/?q=${query}`, '_blank')
  }

  function getStatusBadge(status) {
    if (status === 'paid')      return { label: 'En camino',   bg: '#1e3a5f', color: '#60a5fa' }
    if (status === 'arrived')   return { label: 'Llegaste',    bg: '#14532d', color: '#4ade80' }
    if (status === 'completed') return { label: 'Completado',  bg: '#1f1f1f', color: '#9ca3af' }
    return { label: status, bg: '#1f1f1f', color: '#9ca3af' }
  }

  const activeLeads    = leads.filter(l => l.status === 'paid')
  const arrivedLeads   = leads.filter(l => l.status === 'arrived')
  const completedLeads = leads.filter(l => l.status === 'completed')

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#9ca3af' }}>Cargando...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.back} onClick={() => navigate('/solicitudes')}>
          ← Volver
        </button>
        <h1 style={styles.title}>Mis leads</h1>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <p style={styles.errorText}>{error}</p>
        </div>
      )}

      {leads.length === 0 && !error && (
        <div style={styles.empty}>
          <p>No tienes leads activos.</p>
          <button style={styles.feedBtn} onClick={() => navigate('/solicitudes')}>
            Ver solicitudes
          </button>
        </div>
      )}

      {/* Activos — en camino */}
      {activeLeads.length > 0 && (
        <Section title="En camino">
          {activeLeads.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              arriving={arriving}
              onArrived={markArrived}
              onWhatsApp={openWhatsApp}
              onWaze={openWaze}
              onMaps={openMaps}
              getServiceLabel={getServiceLabel}
              getStatusBadge={getStatusBadge}
            />
          ))}
        </Section>
      )}

      {/* Llegaste — esperando reseña */}
      {arrivedLeads.length > 0 && (
        <Section title="Esperando reseña">
          {arrivedLeads.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              arriving={arriving}
              onArrived={markArrived}
              onWhatsApp={openWhatsApp}
              onWaze={openWaze}
              onMaps={openMaps}
              getServiceLabel={getServiceLabel}
              getStatusBadge={getStatusBadge}
            />
          ))}
        </Section>
      )}

      {/* Completados */}
      {completedLeads.length > 0 && (
        <Section title="Completados">
          {completedLeads.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              arriving={arriving}
              onArrived={markArrived}
              onWhatsApp={openWhatsApp}
              onWaze={openWaze}
              onMaps={openMaps}
              getServiceLabel={getServiceLabel}
              getStatusBadge={getStatusBadge}
            />
          ))}
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <p style={styles.sectionTitle}>{title}</p>
      {children}
    </div>
  )
}

function LeadCard({ lead, arriving, onArrived, onWhatsApp, onWaze, onMaps, getServiceLabel, getStatusBadge }) {
  const req    = lead.requests
  const client = req?.users
  const badge  = getStatusBadge(lead.status)

  return (
    <div style={styles.card}>
      {/* Top */}
      <div style={styles.cardTop}>
        <span style={styles.service}>{getServiceLabel(req?.service)}</span>
        <span style={{ ...styles.badge, backgroundColor: badge.bg, color: badge.color }}>
          {badge.label}
        </span>
      </div>

      <p style={styles.zone}>📍 {req?.zone}</p>

      {req?.description && (
        <p style={styles.description}>{req.description}</p>
      )}

      {(req?.budget_min || req?.preferred_date) && (
        <div style={styles.metaRow}>
          {req.budget_min && (
            <span style={styles.metaBadge}>💰 ${req.budget_min}–${req.budget_max} MXN</span>
          )}
          {req.preferred_date && (
            <span style={styles.metaBadge}>
              📅 {new Date(req.preferred_date).toLocaleDateString('es-MX')}
            </span>
          )}
        </div>
      )}

      {/* Cliente desbloqueado */}
      <div style={styles.clientBox}>
        <p style={styles.clientName}>👤 {client?.full_name || 'Cliente'}</p>
        {client?.phone && (
          <button style={styles.waBtn} onClick={() => onWhatsApp(client.phone)}>
            💬 WhatsApp
          </button>
        )}
      </div>

      {/* Navegación */}
      <div style={styles.navRow}>
        <button style={styles.wazeBtn} onClick={() => onWaze(req?.zone)}>
          🧭 Waze
        </button>
        <button style={styles.mapsBtn} onClick={() => onMaps(req?.zone)}>
          🗺 Maps
        </button>
      </div>

      {/* Botón Ya llegué — solo si está en 'paid' */}
      {lead.status === 'paid' && (
        <button
          style={{
            ...styles.arrivedBtn,
            opacity: arriving === lead.id ? 0.6 : 1,
            cursor: arriving === lead.id ? 'not-allowed' : 'pointer',
          }}
          disabled={arriving !== null}
          onClick={() => onArrived(lead.id)}
        >
          {arriving === lead.id ? 'Marcando...' : '✅ Ya llegué'}
        </button>
      )}

      {/* Esperando reseña */}
      {lead.status === 'arrived' && (
        <div style={styles.waitingReview}>
          <p style={{ color: '#fbbf24', margin: 0, fontSize: '0.85rem' }}>
            ⏳ Esperando reseña del cliente
          </p>
        </div>
      )}
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
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  back: {
    background: 'none',
    border: 'none',
    color: '#a855f7',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: 0,
  },
  title: {
    color: '#a855f7',
    fontSize: '1.4rem',
    fontWeight: '700',
    margin: 0,
  },
  errorBox: {
    backgroundColor: '#2d0a0a',
    border: '1px solid #7f1d1d',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
  },
  errorText: { color: '#f87171', margin: 0, fontSize: '0.9rem' },
  empty: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: '3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  feedBtn: {
    padding: '0.6rem 1.25rem',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#7c3aed',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
  },
  sectionTitle: {
    color: '#6b7280',
    fontSize: '0.8rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 0.75rem',
  },
  card: {
    backgroundColor: '#12001f',
    border: '1px solid #3b0764',
    borderRadius: '12px',
    padding: '1rem',
    marginBottom: '1rem',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  service: { color: '#a855f7', fontWeight: '700', fontSize: '1rem' },
  badge: {
    padding: '0.2rem 0.6rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  zone: { color: '#9ca3af', fontSize: '0.9rem', margin: '0.25rem 0' },
  description: { color: '#d1d5db', fontSize: '0.9rem', margin: '0.25rem 0' },
  metaRow: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' },
  metaBadge: {
    color: '#9ca3af',
    fontSize: '0.8rem',
    backgroundColor: '#0d0018',
    padding: '0.25rem 0.6rem',
    borderRadius: '20px',
    border: '1px solid #3b0764',
  },
  clientBox: {
    backgroundColor: '#0d0018',
    border: '1px solid #3b0764',
    borderRadius: '8px',
    padding: '0.75rem',
    marginTop: '0.75rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientName: { color: '#d8b4fe', fontWeight: '600', fontSize: '0.9rem', margin: 0 },
  waBtn: {
    padding: '0.4rem 0.85rem',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#166534',
    color: '#4ade80',
    fontWeight: '700',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  navRow: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  wazeBtn: {
    flex: 1,
    padding: '0.5rem',
    borderRadius: '8px',
    border: '1px solid #3b0764',
    backgroundColor: 'transparent',
    color: '#a855f7',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  mapsBtn: {
    flex: 1,
    padding: '0.5rem',
    borderRadius: '8px',
    border: '1px solid #3b0764',
    backgroundColor: 'transparent',
    color: '#a855f7',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  arrivedBtn: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#7c3aed',
    color: '#fff',
    fontWeight: '700',
    fontSize: '1rem',
    marginTop: '0.75rem',
  },
  waitingReview: {
    backgroundColor: '#2d1f00',
    border: '1px solid #92400e',
    borderRadius: '8px',
    padding: '0.6rem 0.75rem',
    marginTop: '0.75rem',
    textAlign: 'center',
  },
}