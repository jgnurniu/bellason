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

const STATUS_LABEL = {
  paid: { label: 'Confirmado', color: '#a855f7', bg: '#1a0035', border: '#3b0764' },
  arrived: { label: 'En camino / Llegué', color: '#4ade80', bg: '#0d2d0d', border: '#166534' },
  completed: { label: 'Completado', color: '#9ca3af', bg: '#111', border: '#374151' },
}

export default function MyLeads() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null) // lead id en proceso

  useEffect(() => {
    if (user) fetchLeads()
  }, [user])

  async function fetchLeads() {
    setLoading(true)

    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        requests (
          id,
          service,
          zone,
          description,
          budget_min,
          budget_max,
          preferred_date,
          client_id
        ),
        offers (
          price,
          message
        )
      `)
      .eq('provider_id', user.id)
      .eq('payment_status', 'paid')
      .order('unlocked_at', { ascending: false })

    if (!error) setLeads(data || [])
    setLoading(false)
  }

  async function markArrived(lead) {
    if (updating) return
    setUpdating(lead.id)

    const { error } = await supabase
      .from('leads')
      .update({ status: 'arrived' })
      .eq('id', lead.id)
      .eq('provider_id', user.id)

    if (error) {
      alert('Error al actualizar. Intenta de nuevo.')
      console.error(error)
    } else {
      await fetchLeads()
    }
    setUpdating(null)
  }

  async function markCompleted(lead) {
    if (updating) return
    setUpdating(lead.id)

    const { error } = await supabase
      .from('leads')
      .update({ status: 'completed' })
      .eq('id', lead.id)
      .eq('provider_id', user.id)

    if (error) {
      alert('Error al actualizar. Intenta de nuevo.')
      console.error(error)
    } else {
      await fetchLeads()
    }
    setUpdating(null)
  }

  function openWaze(zone) {
    // Sin coordenadas exactas, abrir búsqueda por nombre de zona + Hermosillo
    const query = encodeURIComponent(`${zone}, Hermosillo, Sonora`)
    const waze = `https://waze.com/ul?q=${query}&navigate=yes`
    const maps = `https://maps.google.com/?q=${query}`
    // Intentar Waze primero, Google Maps como fallback
    window.open(waze, '_blank')
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
      padding: '24px 16px 80px',
    },
    header: {
      fontSize: 22,
      fontWeight: 800,
      color: '#e9d5ff',
      marginBottom: 20,
    },
    card: {
      background: '#12001f',
      border: '1px solid #3b0764',
      borderRadius: 16,
      padding: 18,
      marginBottom: 16,
    },
    cardTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    serviceTag: {
      display: 'inline-block',
      background: '#3b0764',
      color: '#e9d5ff',
      borderRadius: 20,
      padding: '3px 10px',
      fontSize: 11,
    },
    statusTag: (status) => {
      const st = STATUS_LABEL[status] || STATUS_LABEL.paid
      return {
        display: 'inline-block',
        background: st.bg,
        border: `1px solid ${st.border}`,
        color: st.color,
        borderRadius: 20,
        padding: '3px 10px',
        fontSize: 11,
        fontWeight: 600,
      }
    },
    zone: {
      fontSize: 18,
      fontWeight: 800,
      color: '#f3e8ff',
      marginBottom: 4,
    },
    desc: {
      fontSize: 13,
      color: '#c4b5fd',
      marginBottom: 8,
      lineHeight: 1.4,
    },
    price: {
      fontSize: 22,
      fontWeight: 800,
      color: '#a855f7',
      marginBottom: 12,
    },
    unlockedAt: {
      fontSize: 12,
      color: '#4c1d95',
      marginBottom: 14,
    },
    divider: {
      height: 1,
      background: '#1a0035',
      margin: '12px 0',
    },
    btnRow: {
      display: 'flex',
      gap: 8,
    },
    wazeBtn: {
      flex: 1,
      padding: '10px',
      background: '#06c0e0',
      border: 'none',
      borderRadius: 10,
      color: '#fff',
      fontWeight: 700,
      fontSize: 13,
      cursor: 'pointer',
    },
    arrivedBtn: {
      flex: 1,
      padding: '10px',
      background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
      border: 'none',
      borderRadius: 10,
      color: '#fff',
      fontWeight: 700,
      fontSize: 13,
      cursor: 'pointer',
    },
    completedBtn: {
      flex: 1,
      padding: '10px',
      background: '#052e16',
      border: '1px solid #166534',
      borderRadius: 10,
      color: '#4ade80',
      fontWeight: 700,
      fontSize: 13,
      cursor: 'pointer',
    },
    completedDone: {
      textAlign: 'center',
      fontSize: 13,
      color: '#4c1d95',
      padding: '8px 0',
    },
    empty: {
      textAlign: 'center',
      color: '#6d28d9',
      paddingTop: 60,
      fontSize: 15,
      lineHeight: 2,
    },
    tabs: {
      display: 'flex',
      gap: 0,
      marginBottom: 20,
      background: '#12001f',
      borderRadius: 10,
      border: '1px solid #3b0764',
      overflow: 'hidden',
    },
    tab: (active) => ({
      flex: 1,
      padding: '9px',
      background: active ? '#3b0764' : 'transparent',
      border: 'none',
      color: active ? '#e9d5ff' : '#6d28d9',
      fontSize: 13,
      fontWeight: active ? 700 : 400,
      cursor: 'pointer',
    }),
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  const [tab, setTab] = useState('active') // 'active' | 'completed'

  const activeLeads = leads.filter(l => l.status !== 'completed')
  const completedLeads = leads.filter(l => l.status === 'completed')
  const shown = tab === 'active' ? activeLeads : completedLeads

  if (loading) {
    return (
      <div style={{ ...s.page, textAlign: 'center', paddingTop: 80 }}>
        <div style={{ color: '#a855f7' }}>Cargando tus leads...</div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.header}>Mis leads</div>

      {/* Tabs */}
      {leads.length > 0 && (
        <div style={s.tabs}>
          <button style={s.tab(tab === 'active')} onClick={() => setTab('active')}>
            Activos ({activeLeads.length})
          </button>
          <button style={s.tab(tab === 'completed')} onClick={() => setTab('completed')}>
            Completados ({completedLeads.length})
          </button>
        </div>
      )}

      {leads.length === 0 && (
        <div style={s.empty}>
          No tienes leads aún.
          <br />
          <span style={{ color: '#a855f7' }}>
            Cuando una clienta acepte tu oferta, aparecerá aquí.
          </span>
        </div>
      )}

      {shown.length === 0 && leads.length > 0 && (
        <div style={{ textAlign: 'center', color: '#4c1d95', paddingTop: 40, fontSize: 14 }}>
          {tab === 'active' ? 'No tienes leads activos.' : 'No tienes leads completados.'}
        </div>
      )}

      {shown.map(lead => {
        const req = lead.requests
        const offer = lead.offers?.[0]
        const st = lead.status
        const isUpdating = updating === lead.id

        return (
          <div key={lead.id} style={s.card}>
            {/* Header */}
            <div style={s.cardTop}>
              <span style={s.serviceTag}>
                {SERVICES_MAP[req?.service] || req?.service || 'Servicio'}
              </span>
              <span style={s.statusTag(st)}>
                {STATUS_LABEL[st]?.label || st}
              </span>
            </div>

            {/* Info */}
            <div style={s.zone}>📍 {req?.zone || '—'}</div>

            {req?.description && (
              <div style={s.desc}>{req.description}</div>
            )}

            {offer?.price && (
              <div style={s.price}>${offer.price} MXN</div>
            )}

            <div style={s.unlockedAt}>
              Desbloqueado el{' '}
              {new Date(lead.unlocked_at).toLocaleDateString('es-MX', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </div>

            {/* Acciones según status */}
            {st === 'completed' ? (
              <div style={s.completedDone}>✅ Servicio completado</div>
            ) : (
              <>
                <div style={s.divider} />
                <div style={s.btnRow}>
                  {/* Waze */}
                  <button
                    style={s.wazeBtn}
                    onClick={() => openWaze(req?.zone)}
                  >
                    🗺️ Ir con Waze
                  </button>

                  {/* Ya llegué o Completado */}
                  {st === 'paid' && (
                    <button
                      style={{
                        ...s.arrivedBtn,
                        opacity: isUpdating ? 0.6 : 1,
                        cursor: isUpdating ? 'not-allowed' : 'pointer',
                      }}
                      onClick={() => markArrived(lead)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? '...' : '📍 Ya llegué'}
                    </button>
                  )}

                  {st === 'arrived' && (
                    <button
                      style={{
                        ...s.completedBtn,
                        opacity: isUpdating ? 0.6 : 1,
                        cursor: isUpdating ? 'not-allowed' : 'pointer',
                      }}
                      onClick={() => markCompleted(lead)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? '...' : '✅ Completar'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}