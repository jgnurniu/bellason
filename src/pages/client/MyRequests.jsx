import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

const SERVICES_MAP = {
  nails: 'Uñas / Manicure',
  hair: 'Cabello / Tinte / Corte',
  makeup: 'Maquillaje',
  lashes: 'Extensiones de Pestañas',
  wax: 'Depilación',
  massage: 'Masaje',
}

export default function MyRequests() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(null) // offer id being accepted

  useEffect(() => {
    if (user) fetchRequests()
  }, [user])

  async function fetchRequests() {
    setLoading(true)
    const { data, error } = await supabase
      .from('requests')
      .select(`
        *,
        offers (
          id,
          price,
          message,
          status,
          created_at,
          provider_id,
          provider_profiles (
            photo_url,
            bio,
            whatsapp,
            users:user_id (full_name)
          )
        )
      `)
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) setRequests(data || [])
    setLoading(false)
  }

  async function acceptOffer(offer, request) {
    if (accepting) return
    setAccepting(offer.id)

    try {
      // 1. Marcar oferta como aceptada
      const { error: offerErr } = await supabase
        .from('offers')
        .update({ status: 'accepted' })
        .eq('id', offer.id)

      if (offerErr) throw offerErr

      // 2. Rechazar todas las demás ofertas de esta solicitud
      await supabase
        .from('offers')
        .update({ status: 'rejected' })
        .eq('request_id', request.id)
        .neq('id', offer.id)

      // 3. Cerrar la solicitud
      const { error: reqErr } = await supabase
        .from('requests')
        .update({ status: 'closed' })
        .eq('id', request.id)

      if (reqErr) throw reqErr

      // 4. Descontar 1 crédito a la proveedora (RPC para atomicidad)
      const { error: creditErr } = await supabase.rpc('spend_credit', {
        p_provider_id: offer.provider_id,
        p_request_id: request.id,
      })

      if (creditErr) {
        // Si falla el crédito, no bloqueamos — el admin puede revisar en transactions
        console.error('Error al descontar crédito:', creditErr)
      }

      // 5. Crear lead desbloqueado
      const { error: leadErr } = await supabase.from('leads').upsert(
        {
          provider_id: offer.provider_id,
          request_id: request.id,
          amount_paid: 35,
          payment_status: 'paid',
          status: 'paid',
          unlocked_at: new Date().toISOString(),
        },
        { onConflict: 'provider_id,request_id' }
      )

      if (leadErr) console.error('Error al crear lead:', leadErr)

      await fetchRequests()
    } catch (e) {
      console.error('Error al aceptar oferta:', e)
      alert('Hubo un error. Intenta de nuevo.')
    } finally {
      setAccepting(null)
    }
  }

  // ─── Styles ───────────────────────────────────────────────────────────────
  const s = {
    page: {
      minHeight: '100vh',
      background: '#0a0010',
      color: '#f3e8ff',
      fontFamily: 'system-ui, sans-serif',
      padding: '24px 16px 80px',
      maxWidth: 480,
      margin: '0 auto',
    },
    header: {
      fontSize: 22,
      fontWeight: 800,
      marginBottom: 20,
      color: '#e9d5ff',
    },
    newBtn: {
      display: 'block',
      width: '100%',
      padding: '13px',
      background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
      border: 'none',
      borderRadius: 12,
      color: '#fff',
      fontSize: 15,
      fontWeight: 700,
      cursor: 'pointer',
      marginBottom: 24,
      textAlign: 'center',
    },
    card: {
      background: '#12001f',
      border: '1px solid #3b0764',
      borderRadius: 16,
      padding: 18,
      marginBottom: 16,
    },
    tag: {
      display: 'inline-block',
      background: '#3b0764',
      color: '#e9d5ff',
      borderRadius: 20,
      padding: '3px 10px',
      fontSize: 11,
      marginBottom: 8,
    },
    statusTag: (status) => ({
      display: 'inline-block',
      borderRadius: 20,
      padding: '3px 10px',
      fontSize: 11,
      marginLeft: 6,
      background: status === 'open' ? '#0d2d0d' : '#1c0a00',
      color: status === 'open' ? '#4ade80' : '#fb923c',
    }),
    requestTitle: {
      fontSize: 17,
      fontWeight: 700,
      marginBottom: 4,
      color: '#f3e8ff',
    },
    requestSub: {
      fontSize: 13,
      color: '#a78bfa',
      marginBottom: 12,
    },
    offersSection: {
      borderTop: '1px solid #2d0060',
      paddingTop: 12,
      marginTop: 8,
    },
    offersLabel: {
      fontSize: 13,
      color: '#7c3aed',
      fontWeight: 600,
      marginBottom: 10,
    },
    offerCard: (isAccepted) => ({
      background: isAccepted ? '#0d2d0d' : '#0d0018',
      border: `1px solid ${isAccepted ? '#4ade80' : '#2d0060'}`,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
    }),
    providerName: {
      fontWeight: 700,
      fontSize: 14,
      marginBottom: 2,
      color: '#e9d5ff',
    },
    offerPrice: {
      fontSize: 20,
      fontWeight: 800,
      color: '#a855f7',
      marginBottom: 6,
    },
    offerMsg: {
      fontSize: 13,
      color: '#c4b5fd',
      marginBottom: 10,
      lineHeight: 1.5,
    },
    acceptBtn: {
      background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
      border: 'none',
      borderRadius: 8,
      color: '#fff',
      padding: '9px 18px',
      fontSize: 13,
      fontWeight: 700,
      cursor: 'pointer',
      width: '100%',
    },
    acceptedBadge: {
      background: '#4ade80',
      color: '#052e16',
      borderRadius: 8,
      padding: '6px 12px',
      fontSize: 12,
      fontWeight: 700,
      display: 'inline-block',
    },
    noOffers: {
      fontSize: 13,
      color: '#6d28d9',
      fontStyle: 'italic',
    },
    empty: {
      textAlign: 'center',
      color: '#6d28d9',
      paddingTop: 60,
      fontSize: 15,
    },
  }

  if (loading) {
    return (
      <div style={{ ...s.page, textAlign: 'center', paddingTop: 80 }}>
        <div style={{ color: '#a855f7' }}>Cargando...</div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.header}>Mis solicitudes</div>

      <button style={s.newBtn} onClick={() => navigate('/nueva-solicitud')}>
        + Nueva solicitud
      </button>

      {requests.length === 0 && (
        <div style={s.empty}>
          No tienes solicitudes aún.
          <br />
          <span style={{ color: '#a855f7' }}>¡Publica la primera gratis!</span>
        </div>
      )}

      {requests.map(req => {
        const offers = req.offers || []
        const pendingOffers = offers.filter(o => o.status === 'pending')
        const acceptedOffer = offers.find(o => o.status === 'accepted')
        const sortedOffers = [
          ...offers.filter(o => o.status === 'accepted'),
          ...offers.filter(o => o.status === 'pending').sort((a, b) => a.price - b.price),
          ...offers.filter(o => o.status === 'rejected'),
        ]

        return (
          <div key={req.id} style={s.card}>
            {/* Header de solicitud */}
            <div>
              <span style={s.tag}>{SERVICES_MAP[req.service] || req.service}</span>
              <span style={s.statusTag(req.status)}>
                {req.status === 'open' ? 'Abierta' : 'Cerrada'}
              </span>
            </div>
            <div style={s.requestTitle}>{req.zone}</div>
            {req.description && (
              <div style={{ fontSize: 13, color: '#c4b5fd', marginBottom: 6, lineHeight: 1.4 }}>
                {req.description}
              </div>
            )}
            <div style={s.requestSub}>
              {req.budget_min && req.budget_max
                ? `Presupuesto: $${req.budget_min} – $${req.budget_max} MXN`
                : 'Sin presupuesto especificado'}
              {' · '}
              {new Date(req.created_at).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'short',
              })}
            </div>

            {/* Ofertas */}
            <div style={s.offersSection}>
              <div style={s.offersLabel}>
                {offers.length === 0
                  ? 'Sin ofertas aún'
                  : `${offers.length} oferta${offers.length > 1 ? 's' : ''}`}
                {pendingOffers.length > 0 && ` · ${pendingOffers.length} pendiente${pendingOffers.length > 1 ? 's' : ''}`}
              </div>

              {offers.length === 0 && (
                <div style={s.noOffers}>Las proveedoras verán tu solicitud y harán ofertas.</div>
              )}

              {sortedOffers.map(offer => {
                const isAccepted = offer.status === 'accepted'
                const isRejected = offer.status === 'rejected'
                const profile = offer.provider_profiles
                const provName = profile?.users?.full_name || 'Proveedora'

                return (
                  <div key={offer.id} style={s.offerCard(isAccepted)}>
                    <div style={s.providerName}>
                      {profile?.photo_url && (
                        <img
                          src={profile.photo_url}
                          alt=""
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginRight: 8,
                            verticalAlign: 'middle',
                          }}
                        />
                      )}
                      {provName}
                      {isAccepted && (
                        <span
                          style={{
                            marginLeft: 8,
                            background: '#4ade80',
                            color: '#052e16',
                            borderRadius: 6,
                            padding: '1px 7px',
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          Aceptada
                        </span>
                      )}
                    </div>

                    <div style={s.offerPrice}>${offer.price} MXN</div>

                    {offer.message && <div style={s.offerMsg}>{offer.message}</div>}

                    {/* Botón aceptar solo si solicitud abierta y oferta pendiente */}
                    {req.status === 'open' && offer.status === 'pending' && !acceptedOffer && (
                      <button
                        style={{
                          ...s.acceptBtn,
                          opacity: accepting === offer.id ? 0.6 : 1,
                          cursor: accepting === offer.id ? 'not-allowed' : 'pointer',
                        }}
                        onClick={() => acceptOffer(offer, req)}
                        disabled={!!accepting}
                      >
                        {accepting === offer.id ? 'Procesando...' : '✅ Aceptar oferta'}
                      </button>
                    )}

                    {/* Si ya fue aceptada → WhatsApp */}
                    {isAccepted && profile?.whatsapp && (
                      <a
                        href={`https://wa.me/52${profile.whatsapp.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(provName)}%2C%20te%20contacto%20por%20Bellason%20%F0%9F%92%85`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'block',
                          background: '#25D366',
                          color: '#fff',
                          borderRadius: 8,
                          padding: '9px',
                          textAlign: 'center',
                          fontWeight: 700,
                          fontSize: 13,
                          textDecoration: 'none',
                          marginTop: 8,
                        }}
                      >
                        💬 Contactar por WhatsApp
                      </a>
                    )}

                    {isRejected && (
                      <div style={{ fontSize: 11, color: '#6d28d9', marginTop: 4 }}>
                        No seleccionada
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}