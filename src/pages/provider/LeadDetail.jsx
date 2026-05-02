import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate, useParams } from 'react-router-dom'
import { SERVICES } from '../../constants/services'

export default function LeadDetail() {
  const { id: requestId } = useParams()
  const navigate = useNavigate()
  const [request, setRequest] = useState(null)
  const [credits, setCredits] = useState(null) // null = cargando
  const [myOffer, setMyOffer] = useState(null)
  const [price, setPrice]     = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()

      const [{ data: req }, { data: credit }, { data: offer }] = await Promise.all([
        supabase.from('requests').select('*').eq('id', requestId).single(),
        supabase.from('credits').select('balance').eq('user_id', user.id).single(),
        supabase.from('offers').select('*').eq('request_id', requestId).eq('provider_id', user.id).maybeSingle(),
      ])

      setRequest(req)
      setCredits(credit?.balance ?? 0)
      setMyOffer(offer)
      setLoading(false)
    }
    load()
  }, [requestId])

  async function handleOffer(e) {
    e.preventDefault()
    setSending(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()

    const { error: offerError } = await supabase
      .from('offers')
      .insert({
        request_id: requestId,
        provider_id: user.id,
        price: parseInt(price),
        message,
      })

    if (offerError) {
      setError('Error al enviar oferta. Intenta de nuevo.')
      setSending(false)
      return
    }

    const { data: offer } = await supabase
      .from('offers')
      .select('*')
      .eq('request_id', requestId)
      .eq('provider_id', user.id)
      .single()

    setMyOffer(offer)
    setSending(false)
  }

  function getServiceLabel(serviceId) {
    return SERVICES.find(s => s.id === serviceId)?.label || serviceId
  }

  if (loading) return <div style={{ minHeight: '100vh', backgroundColor: '#0a0010' }} />
  if (!request) return <div style={{ color: '#fff', padding: '2rem' }}>Solicitud no encontrada</div>

  const isClosed = request.status === 'closed'

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.back} onClick={() => navigate('/solicitudes')}>
          ← Volver
        </button>
        <div style={styles.creditsBox}>
          <span style={styles.creditsLabel}>Créditos</span>
          <span style={styles.creditsValue}>{credits ?? '—'}</span>
        </div>
      </div>

      {/* Detalle de solicitud */}
      <div style={styles.card}>
        <div style={styles.cardTop}>
          <span style={styles.service}>{getServiceLabel(request.service)}</span>
          <span style={isClosed ? styles.closed : styles.open}>
            {isClosed ? 'Cerrada' : 'Abierta'}
          </span>
        </div>

        <p style={styles.zone}>📍 {request.zone}</p>

        {request.description && (
          <p style={styles.description}>{request.description}</p>
        )}

        <div style={styles.row}>
          {request.budget_min && (
            <span style={styles.badge}>
              💰 ${request.budget_min} — ${request.budget_max} MXN
            </span>
          )}
          {request.preferred_date && (
            <span style={styles.badge}>
              📅 {new Date(request.preferred_date).toLocaleDateString('es-MX')}
            </span>
          )}
        </div>
      </div>

      {/* Aviso de créditos — siempre visible */}
      {!myOffer && !isClosed && (
        <div style={credits === 0 ? styles.noCredits : styles.creditsInfo}>
          {credits === 0 ? (
            <>
              <p style={{ margin: '0 0 0.5rem' }}>
                ⚠️ No tienes créditos. Recarga antes de que el cliente acepte tu oferta, de lo contrario el desbloqueo fallará.
              </p>
              <button style={styles.rechargeBtn} onClick={() => navigate('/recargar')}>
                Recargar ahora
              </button>
            </>
          ) : (
            <p style={{ margin: 0 }}>
              💡 Si el cliente acepta tu oferta se descontará 1 crédito. Tienes {credits}.
            </p>
          )}
        </div>
      )}

      {/* Solicitud cerrada y sin oferta mía */}
      {isClosed && !myOffer && (
        <div style={styles.closedBox}>
          <p style={{ color: '#6b7280', margin: 0 }}>Esta solicitud ya fue cerrada.</p>
        </div>
      )}

      {/* Si ya hice oferta */}
      {myOffer && (
        <div style={styles.offerSent}>
          <p style={styles.offerSentTitle}>Oferta enviada</p>
          <p style={styles.offerSentPrice}>${myOffer.price} MXN</p>

          {myOffer.message && (
            <p style={styles.offerSentMsg}>{myOffer.message}</p>
          )}

          <p style={{
            ...styles.offerSentStatus,
            color: myOffer.status === 'accepted' ? '#4ade80' :
                   myOffer.status === 'rejected'  ? '#f87171' : '#fbbf24',
          }}>
            {myOffer.status === 'accepted' ? '✅ Aceptada' :
             myOffer.status === 'rejected'  ? '❌ Rechazada' : '⏳ En espera'}
          </p>

          {myOffer.status === 'accepted' && (
            <div style={styles.unlockedBox}>
              <p style={styles.unlockedTitle}>🎉 ¡Tu oferta fue aceptada!</p>
              <p style={styles.unlockedText}>
                Se descontó 1 crédito. El cliente se pondrá en contacto contigo pronto.
              </p>
              <button style={styles.leadsBtn} onClick={() => navigate('/mis-leads')}>
                Ver mis leads →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Formulario — solo si no hay oferta y la solicitud está abierta */}
      {!myOffer && !isClosed && (
        <div style={styles.formCard}>
          <p style={styles.formTitle}>Hacer oferta</p>

          <form onSubmit={handleOffer} style={styles.form}>
            <label style={styles.label}>Tu precio (MXN)</label>
            <input
              style={styles.input}
              type="number"
              min="1"
              placeholder="Ej: 350"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
            />

            <label style={styles.label}>Mensaje al cliente (opcional)</label>
            <textarea
              style={{ ...styles.input, height: '80px', resize: 'none' }}
              placeholder="Ej: Tengo 3 años de experiencia en uñas en gel, trabajo con productos de calidad."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />

            {error && <p style={styles.error}>{error}</p>}

            <button
              style={{
                ...styles.button,
                opacity: sending || !price ? 0.6 : 1,
                cursor: sending || !price ? 'not-allowed' : 'pointer',
              }}
              type="submit"
              disabled={sending || !price}
            >
              {sending ? 'Enviando...' : 'Enviar oferta'}
            </button>
          </form>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  service: {
    color: '#a855f7',
    fontWeight: '700',
    fontSize: '1.1rem',
  },
  open: {
    backgroundColor: '#14532d', color: '#4ade80',
    padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem',
  },
  closed: {
    backgroundColor: '#1f1f1f', color: '#6b7280',
    padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem',
  },
  zone: {
    color: '#9ca3af',
    fontSize: '0.9rem',
    margin: '0.5rem 0',
  },
  description: {
    color: '#d1d5db',
    fontSize: '0.9rem',
    margin: '0.5rem 0',
  },
  row: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginTop: '0.5rem',
  },
  badge: {
    color: '#9ca3af',
    fontSize: '0.85rem',
    backgroundColor: '#0d0018',
    padding: '0.3rem 0.7rem',
    borderRadius: '20px',
    border: '1px solid #3b0764',
  },
  creditsInfo: {
    backgroundColor: '#0d1f0d',
    border: '1px solid #166534',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#86efac',
    fontSize: '0.85rem',
    marginBottom: '1rem',
  },
  noCredits: {
    backgroundColor: '#2d1500',
    border: '1px solid #92400e',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#fbbf24',
    fontSize: '0.85rem',
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
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
    alignSelf: 'flex-start',
  },
  closedBox: {
    backgroundColor: '#12001f',
    border: '1px solid #3b0764',
    borderRadius: '12px',
    padding: '1.25rem',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#12001f',
    border: '1px solid #3b0764',
    borderRadius: '12px',
    padding: '1.25rem',
  },
  formTitle: {
    color: '#a855f7',
    fontWeight: '700',
    fontSize: '1.1rem',
    margin: '0 0 1rem',
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
  offerSent: {
    backgroundColor: '#12001f',
    border: '1px solid #3b0764',
    borderRadius: '12px',
    padding: '1.25rem',
    textAlign: 'center',
  },
  offerSentTitle: {
    color: '#a855f7',
    fontWeight: '700',
    fontSize: '1.1rem',
    margin: '0 0 0.5rem',
  },
  offerSentPrice: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '0 0 0.5rem',
  },
  offerSentMsg: {
    color: '#9ca3af',
    fontSize: '0.9rem',
    margin: '0 0 0.75rem',
  },
  offerSentStatus: {
    fontWeight: '700',
    fontSize: '0.95rem',
    margin: 0,
  },
  unlockedBox: {
    backgroundColor: '#052e16',
    border: '1px solid #166534',
    borderRadius: '8px',
    padding: '1rem',
    marginTop: '1rem',
    textAlign: 'left',
  },
  unlockedTitle: {
    color: '#4ade80',
    fontWeight: '700',
    margin: '0 0 0.5rem',
  },
  unlockedText: {
    color: '#86efac',
    fontSize: '0.9rem',
    margin: '0 0 0.75rem',
  },
  leadsBtn: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#166534',
    color: '#4ade80',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
}