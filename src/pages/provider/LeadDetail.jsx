import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

export default function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [request, setRequest] = useState(null)
  const [credits, setCredits] = useState(0)
  const [myOffer, setMyOffer] = useState(null) // oferta ya enviada por este proveedor
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const [price, setPrice] = useState('')
  const [message, setMessage] = useState('')
  const [priceError, setPriceError] = useState('')

  useEffect(() => {
    if (user && id) fetchAll()
  }, [user, id])

  async function fetchAll() {
    setLoading(true)

    // Solicitud
    const { data: req, error } = await supabase
      .from('requests')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !req) {
      setNotFound(true)
      setLoading(false)
      return
    }
    setRequest(req)

    // Créditos del proveedor
    const { data: credit } = await supabase
      .from('credits')
      .select('balance')
      .eq('provider_id', user.id)
      .single()
    setCredits(credit?.balance || 0)

    // ¿Ya hice oferta?
    const { data: existing } = await supabase
      .from('offers')
      .select('*')
      .eq('request_id', id)
      .eq('provider_id', user.id)
      .single()
    if (existing) setMyOffer(existing)

    setLoading(false)
  }

  function validatePrice(val) {
    if (!val || isNaN(val) || Number(val) <= 0) {
      setPriceError('Ingresa un precio válido')
      return false
    }
    if (Number(val) > 99999) {
      setPriceError('El precio parece demasiado alto')
      return false
    }
    setPriceError('')
    return true
  }

  async function submitOffer() {
    if (submitting) return
    if (!validatePrice(price)) return

    setSubmitting(true)

    const { error } = await supabase.from('offers').insert({
      request_id: id,
      provider_id: user.id,
      price: Number(price),
      message: message.trim() || null,
      status: 'pending',
    })

    if (error) {
      // unique constraint → ya existe oferta
      if (error.code === '23505') {
        alert('Ya enviaste una oferta para esta solicitud.')
      } else {
        alert('Error al enviar oferta. Intenta de nuevo.')
        console.error(error)
      }
      setSubmitting(false)
      return
    }

    // Recargar para mostrar la oferta enviada
    await fetchAll()
    setSubmitting(false)
  }

  // ─── Styles ───────────────────────────────────────────────────────────────
  const s = {
    page: {
      minHeight: '100vh',
      background: '#0a0010',
      color: '#f3e8ff',
      fontFamily: 'system-ui, sans-serif',
      maxWidth: 480,
      margin: '0 auto',
      padding: '0 0 60px',
    },
    topBar: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '16px 16px 12px',
      borderBottom: '1px solid #1a0035',
    },
    backBtn: {
      background: 'none',
      border: '1px solid #3b0764',
      borderRadius: 20,
      color: '#e9d5ff',
      padding: '5px 12px',
      fontSize: 13,
      cursor: 'pointer',
    },
    topTitle: {
      fontSize: 16,
      fontWeight: 700,
      color: '#e9d5ff',
    },
    creditsBox: {
      marginLeft: 'auto',
      background: '#12001f',
      border: '1px solid #3b0764',
      borderRadius: 8,
      padding: '4px 10px',
      textAlign: 'center',
    },
    creditsLabel: {
      color: '#7c3aed',
      fontSize: 10,
      display: 'block',
    },
    creditsValue: {
      color: '#a855f7',
      fontSize: 15,
      fontWeight: 700,
    },
    body: {
      padding: '20px 16px',
    },
    requestCard: {
      background: '#12001f',
      border: '1px solid #3b0764',
      borderRadius: 16,
      padding: 18,
      marginBottom: 20,
    },
    tag: {
      display: 'inline-block',
      background: '#3b0764',
      color: '#e9d5ff',
      borderRadius: 20,
      padding: '3px 10px',
      fontSize: 11,
      marginBottom: 10,
    },
    zone: {
      fontSize: 18,
      fontWeight: 800,
      color: '#f3e8ff',
      marginBottom: 6,
    },
    desc: {
      fontSize: 14,
      color: '#c4b5fd',
      lineHeight: 1.5,
      marginBottom: 10,
    },
    meta: {
      fontSize: 13,
      color: '#7c3aed',
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: 700,
      color: '#7c3aed',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 14,
    },
    inputWrap: {
      marginBottom: 16,
    },
    label: {
      fontSize: 12,
      color: '#9ca3af',
      marginBottom: 6,
      display: 'block',
    },
    priceRow: {
      display: 'flex',
      alignItems: 'center',
      background: '#12001f',
      border: '1px solid #3b0764',
      borderRadius: 10,
      overflow: 'hidden',
    },
    pesos: {
      padding: '0 12px',
      fontSize: 18,
      color: '#7c3aed',
      fontWeight: 700,
    },
    priceInput: {
      flex: 1,
      background: 'none',
      border: 'none',
      color: '#f3e8ff',
      fontSize: 22,
      fontWeight: 700,
      padding: '12px 12px 12px 0',
      outline: 'none',
      width: '100%',
    },
    mxn: {
      padding: '0 12px',
      fontSize: 13,
      color: '#4c1d95',
    },
    errorText: {
      fontSize: 12,
      color: '#f87171',
      marginTop: 4,
    },
    textarea: {
      width: '100%',
      background: '#12001f',
      border: '1px solid #3b0764',
      borderRadius: 10,
      color: '#f3e8ff',
      fontSize: 14,
      padding: '12px',
      outline: 'none',
      resize: 'vertical',
      minHeight: 90,
      fontFamily: 'system-ui, sans-serif',
      lineHeight: 1.5,
      boxSizing: 'border-box',
    },
    hint: {
      fontSize: 12,
      color: '#4c1d95',
      marginTop: 6,
    },
    noCreditsAlert: {
      background: '#1c0a00',
      border: '1px solid #92400e',
      borderRadius: 12,
      padding: '14px 16px',
      marginBottom: 16,
      fontSize: 14,
      color: '#fbbf24',
      lineHeight: 1.5,
    },
    rechargeBtn: {
      display: 'block',
      width: '100%',
      marginTop: 10,
      padding: '10px',
      background: '#f59e0b',
      border: 'none',
      borderRadius: 8,
      color: '#000',
      fontWeight: 700,
      fontSize: 14,
      cursor: 'pointer',
    },
    submitBtn: (disabled) => ({
      display: 'block',
      width: '100%',
      padding: '14px',
      background: disabled
        ? '#2d0060'
        : 'linear-gradient(135deg, #a855f7, #7c3aed)',
      border: 'none',
      borderRadius: 12,
      color: disabled ? '#6d28d9' : '#fff',
      fontSize: 16,
      fontWeight: 700,
      cursor: disabled ? 'not-allowed' : 'pointer',
      marginTop: 8,
    }),
    // Oferta ya enviada
    sentCard: {
      background: '#0d1f0d',
      border: '1px solid #166534',
      borderRadius: 16,
      padding: 20,
      textAlign: 'center',
    },
    sentIcon: {
      fontSize: 36,
      marginBottom: 10,
    },
    sentTitle: {
      fontSize: 17,
      fontWeight: 800,
      color: '#4ade80',
      marginBottom: 6,
    },
    sentPrice: {
      fontSize: 28,
      fontWeight: 800,
      color: '#a855f7',
      marginBottom: 8,
    },
    sentMsg: {
      fontSize: 13,
      color: '#86efac',
      lineHeight: 1.5,
      marginBottom: 14,
    },
    statusBadge: (status) => ({
      display: 'inline-block',
      padding: '4px 14px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 700,
      background:
        status === 'accepted' ? '#052e16' :
        status === 'rejected' ? '#1c0a00' : '#1a0035',
      color:
        status === 'accepted' ? '#4ade80' :
        status === 'rejected' ? '#f87171' : '#a855f7',
      border: `1px solid ${
        status === 'accepted' ? '#166534' :
        status === 'rejected' ? '#7f1d1d' : '#3b0764'
      }`,
    }),
    closedBadge: {
      background: '#1c0a00',
      border: '1px solid #7f1d1d',
      borderRadius: 12,
      padding: '12px 16px',
      fontSize: 13,
      color: '#fca5a5',
      marginBottom: 20,
      textAlign: 'center',
    },
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#a855f7' }}>Cargando...</div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div style={{ ...s.page, padding: 24 }}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <div style={{ textAlign: 'center', paddingTop: 80, color: '#6d28d9' }}>
          Solicitud no encontrada.
        </div>
      </div>
    )
  }

  const isClosed = request.status === 'closed'

  return (
    <div style={s.page}>
      {/* Top bar */}
      <div style={s.topBar}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <span style={s.topTitle}>Detalle de solicitud</span>
        <div style={s.creditsBox}>
          <span style={s.creditsLabel}>Créditos</span>
          <span style={s.creditsValue}>{credits}</span>
        </div>
      </div>

      <div style={s.body}>
        {/* Solicitud */}
        <div style={s.requestCard}>
          <div style={s.tag}>{SERVICES_MAP[request.service] || request.service}</div>
          <div style={s.zone}>📍 {request.zone}</div>
          {request.description && (
            <div style={s.desc}>{request.description}</div>
          )}
          <div style={s.meta}>
            {request.budget_min && request.budget_max
              ? `Presupuesto: $${request.budget_min} – $${request.budget_max} MXN`
              : 'Sin presupuesto especificado'}
            {request.preferred_date && (
              <span style={{ marginLeft: 10 }}>
                · {new Date(request.preferred_date).toLocaleDateString('es-MX', {
                  day: 'numeric', month: 'long'
                })}
              </span>
            )}
          </div>
        </div>

        {/* Solicitud cerrada */}
        {isClosed && !myOffer && (
          <div style={s.closedBadge}>
            Esta solicitud ya fue cerrada por la clienta.
          </div>
        )}

        {/* Oferta ya enviada */}
        {myOffer ? (
          <div style={s.sentCard}>
            <div style={s.sentIcon}>📨</div>
            <div style={s.sentTitle}>Oferta enviada</div>
            <div style={s.sentPrice}>${myOffer.price} MXN</div>
            {myOffer.message && (
              <div style={s.sentMsg}>"{myOffer.message}"</div>
            )}
            <div style={s.statusBadge(myOffer.status)}>
              {myOffer.status === 'accepted' && '✅ Aceptada por la clienta'}
              {myOffer.status === 'rejected' && '❌ No seleccionada'}
              {myOffer.status === 'pending' && '⏳ Esperando respuesta'}
            </div>
            {myOffer.status === 'accepted' && (
              <div style={{ marginTop: 14, fontSize: 13, color: '#4ade80', lineHeight: 1.5 }}>
                La clienta aceptó tu oferta. Se descontó 1 crédito.
                Ve a <strong>Mis leads</strong> para ver el contacto y navegar.
              </div>
            )}
          </div>
        ) : !isClosed ? (
          /* Formulario de oferta */
          <>
            <div style={s.sectionTitle}>Hacer oferta</div>

            {/* Sin créditos */}
            {credits === 0 && (
              <div style={s.noCreditsAlert}>
                ⚠️ No tienes créditos. Necesitas al menos 1 crédito para que tu oferta cuente cuando la clienta la acepte.
                <button
                  style={s.rechargeBtn}
                  onClick={() => navigate('/recargar')}
                >
                  Recargar créditos →
                </button>
              </div>
            )}

            {/* Precio */}
            <div style={s.inputWrap}>
              <label style={s.label}>Tu precio</label>
              <div style={s.priceRow}>
                <span style={s.pesos}>$</span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={price}
                  onChange={e => {
                    setPrice(e.target.value)
                    if (priceError) validatePrice(e.target.value)
                  }}
                  style={s.priceInput}
                />
                <span style={s.mxn}>MXN</span>
              </div>
              {priceError && <div style={s.errorText}>{priceError}</div>}
            </div>

            {/* Mensaje */}
            <div style={s.inputWrap}>
              <label style={s.label}>Mensaje (opcional)</label>
              <textarea
                placeholder="Cuéntale a la clienta por qué eres la mejor opción, tu experiencia, disponibilidad..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                style={s.textarea}
                maxLength={300}
              />
              <div style={s.hint}>{message.length}/300 caracteres</div>
            </div>

            <button
              style={s.submitBtn(submitting || !price)}
              onClick={submitOffer}
              disabled={submitting || !price}
            >
              {submitting ? 'Enviando...' : 'Enviar oferta'}
            </button>

            <div style={{ ...s.hint, textAlign: 'center', marginTop: 12 }}>
              El crédito se descuenta solo si la clienta acepta tu oferta.
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}