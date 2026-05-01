import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { SERVICES } from '../../constants/services'

export default function MyRequests() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [accepting, setAccepting] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('requests')
      .select('*, offers(*, users(full_name, phone))')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setError('No se pudieron cargar tus solicitudes.')
    }

    setRequests(data || [])
    setLoading(false)
  }

  async function acceptOffer(offer, requestId) {
    setAccepting(offer.id)
    setError(null)

    const { error } = await supabase.rpc('accept_offer', {
      p_offer_id: offer.id,
      p_request_id: requestId,
      p_provider_id: offer.provider_id,
    })

    if (error) {
      setError(error.message || 'Error al aceptar la oferta. Intenta de nuevo.')
    }

    setAccepting(null)
    load()
  }

  function getServiceLabel(id) {
    return SERVICES.find(s => s.id === id)?.label || id
  }

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
        <h1 style={styles.title}>Bellason</h1>
        <p style={styles.subtitle}>Mis solicitudes</p>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <p style={styles.errorText}>{error}</p>
        </div>
      )}

      <button style={styles.newButton} onClick={() => navigate('/nueva-solicitud')}>
        + Nueva solicitud
      </button>

      {requests.length === 0 && !error && (
        <div style={styles.empty}>
          <p>No tienes solicitudes aún.</p>
        </div>
      )}

      {requests.map(req => {
        const visibleOffers = (req.offers || []).filter(o => o.status !== 'rejected')
        const acceptedOffer = visibleOffers.find(o => o.status === 'accepted')

        return (
          <div key={req.id} style={styles.card}>
            <div style={styles.cardTop}>
              <span style={styles.service}>{getServiceLabel(req.service)}</span>
              <span style={req.status === 'open' ? styles.open : styles.closed}>
                {req.status === 'open' ? 'Abierta' : 'Cerrada'}
              </span>
            </div>

            <p style={styles.zone}>📍 {req.zone}</p>
            {req.description && <p style={styles.description}>{req.description}</p>}

            {/* Oferta aceptada — siempre visible si existe */}
            {acceptedOffer && (
              <div style={styles.acceptedBox}>
                <p style={styles.acceptedText}>✅ Oferta aceptada</p>
                <p style={styles.acceptedName}>{acceptedOffer.users?.full_name || 'Proveedora'}</p>
                <p style={styles.acceptedPrice}>${acceptedOffer.price} MXN</p>
                <p style={styles.phoneText}>📞 {acceptedOffer.users?.phone || 'Sin teléfono'}</p>
              </div>
            )}

            {/* Otras ofertas — solo si la solicitud está abierta */}
            {req.status === 'open' && (
              <div style={styles.offersRow}>
                <span style={styles.offersCount}>
                  {visibleOffers.length} oferta{visibleOffers.length !== 1 ? 's' : ''}
                </span>
                {visibleOffers.length > 0 && (
                  <button
                    style={styles.toggleBtn}
                    onClick={() => setExpanded(expanded === req.id ? null : req.id)}
                  >
                    {expanded === req.id ? 'Ocultar' : 'Ver ofertas'}
                  </button>
                )}
              </div>
            )}

            {expanded === req.id && req.status === 'open' && (
              <div style={styles.offersList}>
                {visibleOffers.map(offer => (
                  <div key={offer.id} style={styles.offerCard}>
                    <div style={styles.offerTop}>
                      <span style={styles.offerName}>
                        {offer.users?.full_name || 'Proveedora'}
                      </span>
                      <span style={styles.offerPrice}>${offer.price} MXN</span>
                    </div>

                    {offer.message && (
                      <p style={styles.offerMsg}>{offer.message}</p>
                    )}

                    {offer.status === 'pending' && (
                      <button
                        style={{
                          ...styles.acceptBtn,
                          opacity: accepting === offer.id ? 0.6 : 1,
                          cursor: accepting === offer.id ? 'not-allowed' : 'pointer',
                        }}
                        disabled={accepting !== null}
                        onClick={() => acceptOffer(offer, req.id)}
                      >
                        {accepting === offer.id ? 'Aceptando...' : '✓ Aceptar oferta'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
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
  header: { marginBottom: '1.5rem' },
  title: { color: '#a855f7', fontSize: '1.75rem', fontWeight: '700', margin: 0 },
  subtitle: { color: '#9ca3af', margin: '0.25rem 0 0' },
  errorBox: {
    backgroundColor: '#2d0a0a',
    border: '1px solid #7f1d1d',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
  },
  errorText: { color: '#f87171', margin: 0, fontSize: '0.9rem' },
  newButton: {
    width: '100%',
    padding: '0.85rem',
    borderRadius: '8px',
    border: '1px dashed #7c3aed',
    backgroundColor: 'transparent',
    color: '#a855f7',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '1.5rem',
  },
  empty: { textAlign: 'center', color: '#9ca3af', marginTop: '3rem' },
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
  open: {
    backgroundColor: '#14532d', color: '#4ade80',
    padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem',
  },
  closed: {
    backgroundColor: '#1f1f1f', color: '#6b7280',
    padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem',
  },
  zone: { color: '#9ca3af', fontSize: '0.9rem', margin: '0.25rem 0' },
  description: { color: '#d1d5db', fontSize: '0.9rem', margin: '0.25rem 0' },
  offersRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.75rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid #3b0764',
  },
  offersCount: { color: '#9ca3af', fontSize: '0.85rem' },
  toggleBtn: {
    padding: '0.4rem 0.85rem',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#7c3aed',
    color: '#fff',
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontWeight: '600',
  },
  offersList: { marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  offerCard: {
    backgroundColor: '#0d0018',
    border: '1px solid #3b0764',
    borderRadius: '8px',
    padding: '0.75rem',
  },
  offerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.25rem',
  },
  offerName: { color: '#d8b4fe', fontWeight: '600', fontSize: '0.9rem' },
  offerPrice: { color: '#a855f7', fontWeight: '700', fontSize: '1rem' },
  offerMsg: { color: '#9ca3af', fontSize: '0.85rem', margin: '0.25rem 0 0.5rem' },
  acceptBtn: {
    width: '100%',
    padding: '0.6rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#7c3aed',
    color: '#fff',
    fontWeight: '700',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  },
  acceptedBox: {
    backgroundColor: '#052e16',
    border: '1px solid #166534',
    borderRadius: '8px',
    padding: '0.75rem',
    marginTop: '0.75rem',
  },
  acceptedText: { color: '#4ade80', fontWeight: '700', margin: '0 0 0.4rem' },
  acceptedName: { color: '#86efac', fontWeight: '600', fontSize: '0.95rem', margin: '0 0 0.15rem' },
  acceptedPrice: { color: '#4ade80', fontSize: '0.9rem', margin: '0 0 0.25rem' },
  phoneText: { color: '#86efac', fontSize: '0.9rem', margin: 0 },
}