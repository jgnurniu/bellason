import { useState, useEffect, useRef } from 'react'
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

// ─── Slider de liberación ────────────────────────────────────────────────────
function ReleaseSlider({ onRelease }) {
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset]     = useState(0)
  const [released, setReleased] = useState(false)
  const trackRef  = useRef(null)
  const startXRef = useRef(0)
  const THUMB     = 56
  const PADDING   = 4

  function getTrackWidth() {
    return (trackRef.current?.offsetWidth || 300) - THUMB - PADDING * 2
  }

  function onPointerDown(e) {
    if (released) return
    setDragging(true)
    startXRef.current = e.clientX ?? e.touches?.[0]?.clientX
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  function onPointerMove(e) {
    if (!dragging) return
    const x    = e.clientX ?? e.touches?.[0]?.clientX
    const diff = x - startXRef.current
    const max  = getTrackWidth()
    setOffset(Math.max(0, Math.min(diff, max)))
  }

  function onPointerUp() {
    if (!dragging) return
    setDragging(false)
    const max = getTrackWidth()
    if (offset >= max * 0.85) {
      setOffset(max)
      setReleased(true)
      setTimeout(onRelease, 400)
    } else {
      setOffset(0)
    }
  }

  const progress = Math.min(offset / (getTrackWidth() || 1), 1)

  return (
    <div
      ref={trackRef}
      style={{
        position: 'relative',
        height: THUMB + PADDING * 2,
        borderRadius: 999,
        background: '#1a0035',
        border: '1px solid #4c1d95',
        overflow: 'hidden',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      <div style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: `${PADDING + THUMB / 2 + offset}px`,
        background: released
          ? 'linear-gradient(90deg, #4ade80, #22c55e)'
          : 'linear-gradient(90deg, #7c3aed44, #a855f733)',
        transition: released ? 'background 0.3s' : 'none',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: released ? '#fff' : '#7c3aed',
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.05em',
        pointerEvents: 'none',
        opacity: released ? 1 : 1 - progress * 0.7,
        transition: 'opacity 0.2s',
      }}>
        {released ? '✅ Servicio liberado' : 'Desliza para liberar →'}
      </div>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: 'absolute',
          left: PADDING + offset,
          top: PADDING,
          width: THUMB,
          height: THUMB,
          borderRadius: '50%',
          background: released
            ? 'linear-gradient(135deg, #4ade80, #22c55e)'
            : 'linear-gradient(135deg, #a855f7, #7c3aed)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          cursor: released ? 'default' : 'grab',
          transition: dragging ? 'none' : 'left 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow: '0 2px 12px #a855f755',
          zIndex: 2,
        }}
      >
        {released ? '✓' : '→'}
      </div>
    </div>
  )
}

// ─── Pantalla de bloqueo ─────────────────────────────────────────────────────
function BlockScreen({ lead, providerName, onReleased }) {
  const [releasing, setReleasing] = useState(false)
  const [error, setError]         = useState(null)

  const deadline = new Date(lead.unlocked_at || lead.created_at)
  deadline.setHours(deadline.getHours() + 24)
  const hoursLeft = Math.max(0, Math.ceil((deadline - Date.now()) / 3600000))

  async function handleRelease() {
    setReleasing(true)
    setError(null)
    try {
      const { error: e } = await supabase
        .from('leads')
        .update({ status: 'completed' })
        .eq('id', lead.id)
      if (e) throw e
      onReleased()
    } catch (e) {
      setError('Error al liberar. Intenta de nuevo.')
      setReleasing(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: '#0a0010',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      textAlign: 'center',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'linear-gradient(135deg, #3b0764, #7c3aed)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, marginBottom: '1.5rem',
        boxShadow: '0 0 40px #a855f744',
      }}>
        💅
      </div>

      <h1 style={{
        color: '#f3e8ff', fontSize: '1.6rem', fontWeight: 800,
        marginBottom: '0.75rem', lineHeight: 1.2,
      }}>
        Confirma que el servicio fue realizado
      </h1>

      {providerName && (
        <p style={{ color: '#a855f7', fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 600 }}>
          {providerName} ya fue a verte 🙌
        </p>
      )}

      <p style={{
        color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6,
        maxWidth: 300, marginBottom: '2rem',
      }}>
        Tu confirmación permite que la proveedora siga recibiendo clientes en Bellason.
      </p>

      <div style={{
        background: '#12001f', border: '1px solid #3b0764',
        borderRadius: 10, padding: '0.6rem 1rem',
        marginBottom: '2rem', fontSize: '0.8rem', color: '#7c3aed',
      }}>
        ⏱ Si no confirmas, se liberará automáticamente en {hoursLeft}h
      </div>

      <div style={{ width: '100%', maxWidth: 340, marginBottom: '1rem' }}>
        {releasing
          ? <div style={{ color: '#a855f7', fontSize: 14 }}>Liberando...</div>
          : <ReleaseSlider onRelease={handleRelease} />
        }
      </div>

      {error && (
        <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>{error}</p>
      )}

      <p style={{ color: '#3b0764', fontSize: '0.75rem', marginTop: '1.5rem' }}>
        Bellason · No puedes continuar hasta confirmar
      </p>
    </div>
  )
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function MyRequests() {
  const { user }     = useAuth()
  const navigate     = useNavigate()
  const [requests, setRequests]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [accepting, setAccepting]       = useState(null)
  const [blockLead, setBlockLead]       = useState(null)
  const [blockProvider, setBlockProvider] = useState(null)

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
        ),
        leads (
          id,
          status,
          provider_id,
          unlocked_at,
          created_at
        )
      `)
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) {
      const reqs = data || []
      setRequests(reqs)

      // Buscar si hay algún lead por_confirmar
      for (const req of reqs) {
        const pendingLead = (req.leads || []).find(l => l.status === 'por_confirmar')
        if (pendingLead) {
          setBlockLead(pendingLead)
          const matchOffer = (req.offers || []).find(
            o => o.provider_id === pendingLead.provider_id && o.status === 'accepted'
          )
          setBlockProvider(matchOffer?.provider_profiles?.users?.full_name || null)
          break
        }
      }
    }
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

      // 2. Rechazar las demás ofertas
      await supabase
        .from('offers')
        .update({ status: 'rejected' })
        .eq('request_id', request.id)
        .neq('id', offer.id)

      // 3. Cerrar solicitud
      const { error: reqErr } = await supabase
        .from('requests')
        .update({ status: 'closed' })
        .eq('id', request.id)
      if (reqErr) throw reqErr

      // 4. Descontar crédito al proveedor
      const { error: creditErr } = await supabase.rpc('spend_credit', {
        p_provider_id: offer.provider_id,
        p_request_id: request.id,
      })
      if (creditErr) console.error('Error al descontar crédito:', creditErr)

      // 5. Crear lead en estado por_confirmar
      const { error: leadErr } = await supabase.from('leads').upsert(
        {
          provider_id: offer.provider_id,
          request_id: request.id,
          amount_paid: 35,
          payment_status: 'paid',
          status: 'por_confirmar',
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
    header: { fontSize: 22, fontWeight: 800, marginBottom: 20, color: '#e9d5ff' },
    newBtn: {
      display: 'block', width: '100%', padding: '13px',
      background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
      border: 'none', borderRadius: 12, color: '#fff',
      fontSize: 15, fontWeight: 700, cursor: 'pointer',
      marginBottom: 24, textAlign: 'center',
    },
    card: {
      background: '#12001f', border: '1px solid #3b0764',
      borderRadius: 16, padding: 18, marginBottom: 16,
    },
    tag: {
      display: 'inline-block', background: '#3b0764', color: '#e9d5ff',
      borderRadius: 20, padding: '3px 10px', fontSize: 11, marginBottom: 8,
    },
    statusTag: (status) => ({
      display: 'inline-block', borderRadius: 20, padding: '3px 10px',
      fontSize: 11, marginLeft: 6,
      background: status === 'open' ? '#0d2d0d' : '#1c0a00',
      color: status === 'open' ? '#4ade80' : '#fb923c',
    }),
    requestTitle: { fontSize: 17, fontWeight: 700, marginBottom: 4, color: '#f3e8ff' },
    requestSub: { fontSize: 13, color: '#a78bfa', marginBottom: 12 },
    offersSection: { borderTop: '1px solid #2d0060', paddingTop: 12, marginTop: 8 },
    offersLabel: { fontSize: 13, color: '#7c3aed', fontWeight: 600, marginBottom: 10 },
    offerCard: (isAccepted) => ({
      background: isAccepted ? '#0d2d0d' : '#0d0018',
      border: `1px solid ${isAccepted ? '#4ade80' : '#2d0060'}`,
      borderRadius: 12, padding: 14, marginBottom: 10,
    }),
    providerRow: {
      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
      cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
    },
    providerAvatar: {
      width: 36, height: 36, borderRadius: '50%', objectFit: 'cover',
      border: '2px solid #3b0764', flexShrink: 0,
    },
    providerAvatarPlaceholder: {
      width: 36, height: 36, borderRadius: '50%',
      background: 'linear-gradient(135deg, #3b0764, #7c3aed)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 16, flexShrink: 0,
    },
    providerName: { fontWeight: 700, fontSize: 14, color: '#e9d5ff' },
    viewProfile: { fontSize: 11, color: '#7c3aed', marginLeft: 'auto' },
    offerPrice: { fontSize: 20, fontWeight: 800, color: '#a855f7', marginBottom: 6 },
    offerMsg: { fontSize: 13, color: '#c4b5fd', marginBottom: 10, lineHeight: 1.5 },
    acceptBtn: {
      background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
      border: 'none', borderRadius: 8, color: '#fff',
      padding: '9px 18px', fontSize: 13, fontWeight: 700,
      cursor: 'pointer', width: '100%',
    },
    noOffers: { fontSize: 13, color: '#6d28d9', fontStyle: 'italic' },
    empty: { textAlign: 'center', color: '#6d28d9', paddingTop: 60, fontSize: 15 },
  }

  if (loading) {
    return (
      <div style={{ ...s.page, textAlign: 'center', paddingTop: 80 }}>
        <div style={{ color: '#a855f7' }}>Cargando...</div>
      </div>
    )
  }

  return (
    <>
      {blockLead && (
        <BlockScreen
          lead={blockLead}
          providerName={blockProvider}
          onReleased={() => {
            setBlockLead(null)
            setBlockProvider(null)
            fetchRequests()
          }}
        />
      )}

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
          const offers        = req.offers || []
          const pendingOffers = offers.filter(o => o.status === 'pending')
          const acceptedOffer = offers.find(o => o.status === 'accepted')
          const sortedOffers  = [
            ...offers.filter(o => o.status === 'accepted'),
            ...offers.filter(o => o.status === 'pending').sort((a, b) => a.price - b.price),
            ...offers.filter(o => o.status === 'rejected'),
          ]

          return (
            <div key={req.id} style={s.card}>
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
                  day: 'numeric', month: 'short',
                })}
              </div>

              <div style={s.offersSection}>
                <div style={s.offersLabel}>
                  {offers.length === 0
                    ? 'Sin ofertas aún'
                    : `${offers.length} oferta${offers.length > 1 ? 's' : ''}`}
                  {pendingOffers.length > 0 &&
                    ` · ${pendingOffers.length} pendiente${pendingOffers.length > 1 ? 's' : ''}`}
                </div>

                {offers.length === 0 && (
                  <div style={s.noOffers}>Las proveedoras verán tu solicitud y harán ofertas.</div>
                )}

                {sortedOffers.map(offer => {
                  const isAccepted = offer.status === 'accepted'
                  const isRejected = offer.status === 'rejected'
                  const profile    = offer.provider_profiles
                  const provName   = profile?.users?.full_name || 'Proveedora'

                  return (
                    <div key={offer.id} style={s.offerCard(isAccepted)}>
                      <div
                        style={s.providerRow}
                        onClick={() => navigate(`/proveedor/${offer.provider_id}`)}
                        role="button"
                        aria-label={`Ver perfil de ${provName}`}
                      >
                        {profile?.photo_url ? (
                          <img src={profile.photo_url} alt={provName} style={s.providerAvatar} />
                        ) : (
                          <div style={s.providerAvatarPlaceholder}>💅</div>
                        )}
                        <div>
                          <div style={s.providerName}>
                            {provName}
                            {isAccepted && (
                              <span style={{
                                marginLeft: 8, background: '#4ade80', color: '#052e16',
                                borderRadius: 6, padding: '1px 7px', fontSize: 11, fontWeight: 700,
                              }}>
                                Aceptada
                              </span>
                            )}
                          </div>
                        </div>
                        <span style={s.viewProfile}>Ver perfil →</span>
                      </div>

                      <div style={s.offerPrice}>${offer.price} MXN</div>

                      {offer.message && (
                        <div style={s.offerMsg}>{offer.message}</div>
                      )}

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

                      {isAccepted && profile?.whatsapp && (
                        <a
                          href={`https://wa.me/52${profile.whatsapp.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(provName)}%2C%20te%20contacto%20por%20Bellason%20%F0%9F%92%85`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'block', background: '#25D366', color: '#fff',
                            borderRadius: 8, padding: '9px', textAlign: 'center',
                            fontWeight: 700, fontSize: 13, textDecoration: 'none', marginTop: 8,
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
    </>
  )
}