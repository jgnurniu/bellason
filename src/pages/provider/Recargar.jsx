import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate, useSearchParams } from 'react-router-dom'

const PACKAGES = [
  { id: 'pkg_4',  credits: 4,  amount: 140, label: '4 créditos',  popular: false },
  { id: 'pkg_10', credits: 10, amount: 330, label: '10 créditos', popular: true  },
  { id: 'pkg_20', credits: 20, amount: 600, label: '20 créditos', popular: false },
]

export default function Recargar() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status') // success | failure | pending

  const [balance, setBalance]     = useState(null)
  const [selected, setSelected]   = useState(PACKAGES[0].id)
  const [loading, setLoading]     = useState(true)
  const [paying, setPaying]       = useState(false)
  const [error, setError]         = useState(null)

  useEffect(() => { loadBalance() }, [])

  async function loadBalance() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('credits')
      .select('balance')
      .eq('provider_id', user.id)
      .maybeSingle()
    setBalance(data?.balance ?? 0)
    setLoading(false)
  }

  async function handlePay() {
    setPaying(true)
    setError(null)

    const pkg = PACKAGES.find(p => p.id === selected)

    const { data: { session } } = await supabase.auth.getSession()

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-mp-preference`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          package_id: pkg.id,
          credits: pkg.credits,
          amount: pkg.amount,
        }),
      }
    )

    const data = await res.json()

    if (!res.ok || !data.init_point) {
      setError('No se pudo iniciar el pago. Intenta de nuevo.')
      setPaying(false)
      return
    }

    // Redirigir al checkout de Mercado Pago
    window.location.href = data.init_point
  }

  const selectedPkg = PACKAGES.find(p => p.id === selected)

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
        <div style={styles.balanceBox}>
          <span style={styles.balanceLabel}>Saldo actual</span>
          <span style={styles.balanceValue}>{balance} crédito{balance !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <h1 style={styles.title}>Recargar créditos</h1>
      <p style={styles.subtitle}>1 crédito = 1 lead desbloqueado ($35 MXN)</p>

      {/* Resultado de pago */}
      {status === 'success' && (
        <div style={styles.successBox}>
          <p style={styles.successText}>✅ Pago exitoso. Tus créditos fueron acreditados.</p>
        </div>
      )}
      {status === 'failure' && (
        <div style={styles.errorBox}>
          <p style={styles.errorText}>❌ El pago no fue completado. Intenta de nuevo.</p>
        </div>
      )}
      {status === 'pending' && (
        <div style={styles.pendingBox}>
          <p style={styles.pendingText}>⏳ Pago en proceso. Te avisaremos cuando se acredite.</p>
        </div>
      )}

      {/* Paquetes */}
      <div style={styles.packages}>
        {PACKAGES.map(pkg => (
          <div
            key={pkg.id}
            style={{
              ...styles.packageCard,
              ...(selected === pkg.id ? styles.packageSelected : {}),
            }}
            onClick={() => setSelected(pkg.id)}
          >
            {pkg.popular && (
              <span style={styles.popularBadge}>Más popular</span>
            )}
            <div style={styles.packageTop}>
              <span style={styles.packageCredits}>{pkg.credits}</span>
              <span style={styles.packageCreditsLabel}>créditos</span>
            </div>
            <p style={styles.packageAmount}>${pkg.amount} MXN</p>
            <p style={styles.packagePer}>
              ${(pkg.amount / pkg.credits).toFixed(0)} por crédito
            </p>
            <div style={{
              ...styles.packageRadio,
              ...(selected === pkg.id ? styles.packageRadioSelected : {}),
            }} />
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div style={styles.summary}>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Paquete</span>
          <span style={styles.summaryValue}>{selectedPkg?.label}</span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Total</span>
          <span style={styles.summaryTotal}>${selectedPkg?.amount} MXN</span>
        </div>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <p style={styles.errorText}>{error}</p>
        </div>
      )}

      <button
        style={{
          ...styles.payBtn,
          opacity: paying ? 0.6 : 1,
          cursor: paying ? 'not-allowed' : 'pointer',
        }}
        disabled={paying}
        onClick={handlePay}
      >
        {paying ? 'Redirigiendo...' : `Pagar $${selectedPkg?.amount} MXN`}
      </button>

      <p style={styles.secureNote}>🔒 Pago seguro con Mercado Pago</p>
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
  balanceBox: {
    backgroundColor: '#12001f',
    border: '1px solid #3b0764',
    borderRadius: '8px',
    padding: '0.4rem 0.85rem',
    textAlign: 'center',
  },
  balanceLabel: {
    color: '#9ca3af',
    fontSize: '0.7rem',
    display: 'block',
  },
  balanceValue: {
    color: '#a855f7',
    fontSize: '1rem',
    fontWeight: '700',
  },
  title: {
    color: '#fff',
    fontSize: '1.4rem',
    fontWeight: '700',
    margin: '0 0 0.25rem',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: '0.85rem',
    margin: '0 0 1.25rem',
  },
  successBox: {
    backgroundColor: '#052e16',
    border: '1px solid #166534',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
  },
  successText: { color: '#4ade80', margin: 0, fontSize: '0.9rem' },
  errorBox: {
    backgroundColor: '#2d0a0a',
    border: '1px solid #7f1d1d',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
  },
  errorText: { color: '#f87171', margin: 0, fontSize: '0.9rem' },
  pendingBox: {
    backgroundColor: '#2d1f00',
    border: '1px solid #92400e',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
  },
  pendingText: { color: '#fbbf24', margin: 0, fontSize: '0.9rem' },
  packages: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.25rem',
  },
  packageCard: {
    backgroundColor: '#12001f',
    border: '1px solid #3b0764',
    borderRadius: '12px',
    padding: '1rem',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  packageSelected: {
    border: '1px solid #7c3aed',
    backgroundColor: '#1a0030',
  },
  popularBadge: {
    position: 'absolute',
    top: '-10px',
    right: '12px',
    backgroundColor: '#7c3aed',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '0.2rem 0.6rem',
    borderRadius: '20px',
  },
  packageTop: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.3rem',
    flex: 1,
  },
  packageCredits: {
    color: '#a855f7',
    fontSize: '1.75rem',
    fontWeight: '700',
  },
  packageCreditsLabel: {
    color: '#9ca3af',
    fontSize: '0.85rem',
  },
  packageAmount: {
    color: '#fff',
    fontWeight: '700',
    fontSize: '1rem',
    margin: 0,
  },
  packagePer: {
    color: '#6b7280',
    fontSize: '0.75rem',
    margin: '0 0 0 0.5rem',
  },
  packageRadio: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '2px solid #3b0764',
    flexShrink: 0,
  },
  packageRadioSelected: {
    border: '2px solid #7c3aed',
    backgroundColor: '#7c3aed',
  },
  summary: {
    backgroundColor: '#12001f',
    border: '1px solid #3b0764',
    borderRadius: '12px',
    padding: '1rem',
    marginBottom: '1rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.3rem 0',
  },
  summaryLabel: { color: '#9ca3af', fontSize: '0.9rem' },
  summaryValue: { color: '#d1d5db', fontSize: '0.9rem' },
  summaryTotal: { color: '#a855f7', fontWeight: '700', fontSize: '1.1rem' },
  payBtn: {
    width: '100%',
    padding: '1rem',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#7c3aed',
    color: '#fff',
    fontWeight: '700',
    fontSize: '1.1rem',
    marginBottom: '0.75rem',
  },
  secureNote: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '0.8rem',
    margin: 0,
  },
}