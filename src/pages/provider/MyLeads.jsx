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
  por_confirmar: { label: 'En proceso', color: '#fbbf24', bg: '#1c1000', border: '#92400e' },
  completed:     { label: 'Completado', color: '#9ca3af', bg: '#111',    border: '#374151' },
}

export default function MyLeads() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [leads, setLeads]     = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('active')

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
          client_id,
          users:client_id (
            full_name,
            phone
          )
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
    header: { fontSize: 22, fontWeight: 800, color: '#e9d5ff', marginBottom: 20 },
    tabs: {
      display: 'flex',
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
      const st = STATUS_LABEL[status] || STATUS_LABEL.por_confirmar
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
    zone:  { fontSize: 18, fontWeight: 800, color: '#f3e8ff', marginBottom: 4 },
    desc:  { fontSize: 13, color: '#c4b5fd', marginBottom: 8, lineHeight: 1.4 },
    price: { fontSize: 22, fontWeight: 800, color: '#a855f7', marginBottom: 12 },
    unlockedAt: { fontSize: 12, color: '#4c1d95', marginBottom: 14 },
    divider: { height: 1, background: '#1a0035', margin: '12px 0' },
    contactBox: {
      background: '#0d0020',
      border: '1px solid #4c1d95',
      borderRadius: 12,
      padding: '14px 16px',
      marginTop: 4,
    },
    contactLegend: {
      fontSize: 13,
      color: '#c4b5fd',
      marginBottom: 12,
      lineHeight: 1.5,
      textAlign: 'center',
    },
    whatsappBtn: {
      display: 'block',
      width: '100%',
      padding: '11px',
      background: '#25D366',
      border: 'none',
      borderRadius: 10,
      color: '#fff',
      fontWeight: 700,
      fontSize: 14,
      cursor: 'pointer',
      textDecoration: 'none',
      textAlign: 'center',
    },
    waitingBox: {
      background: '#1c1000',
      border: '1px solid #92400e',
      borderRadius: 10,
      padding: '10px 14px',
      marginTop: 8,
      fontSize: 12,
      color: '#fbbf24',
      lineHeight: 1.5,
      textAlign: 'center',
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
  }

  const activeLeads    = leads.filter(l => l.status !== 'completed')
  const completedLeads = leads.filter(l => l.status === 'completed')
  const shown          = tab === 'active' ? activeLeads : completedLeads

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
        const req      = lead.requests
        const offer    = lead.offers?.[0]
        const client   = req?.users
        const st       = lead.status

        const clientPhone = client?.phone?.replace(/\D/g, '') || null
        const clientName  = client?.full_name || 'la clienta'

        const waLink = clientPhone
          ? `https://wa.me/52${clientPhone}?text=Hola%20${encodeURIComponent(clientName)}%2C%20soy%20tu%20proveedora%20de%20Bellason%20%F0%9F%92%85%20%C2%BFA%20qu%C3%A9%20hora%20nos%20coordinamos%3F`
          : null

        return (
          <div key={lead.id} style={s.card}>
            <div style={s.cardTop}>
              <span style={s.serviceTag}>
                {SERVICES_MAP[req?.service] || req?.service || 'Servicio'}
              </span>
              <span style={s.statusTag(st)}>
                {STATUS_LABEL[st]?.label || st}
              </span>
            </div>

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
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </div>

            {st === 'completed' ? (
              <div style={s.completedDone}>✅ Servicio completado</div>
            ) : (
              <>
                <div style={s.divider} />

                <div style={s.contactBox}>
                  <div style={s.contactLegend}>
                    🙌 Tu oferta fue aceptada. Por favor contáctate con tu clienta para coordinar el servicio.
                  </div>

                  {waLink ? (
                    <a href={waLink} target="_blank" rel="noreferrer" style={s.whatsappBtn}>
                      💬 Contactar a {clientName} por WhatsApp
                    </a>
                  ) : (
                    <div style={{ fontSize: 12, color: '#6d28d9', textAlign: 'center' }}>
                      Teléfono no disponible.
                    </div>
                  )}
                </div>

                <div style={s.waitingBox}>
                  ⏳ Estarás bloqueada hasta que la clienta confirme que el servicio fue realizado.
                  Puedes pedirle que lo libere en su app.
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}