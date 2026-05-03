import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const SERVICES_MAP = {
  nails: 'Uñas / Manicure',
  hair: 'Cabello / Tinte / Corte',
  makeup: 'Maquillaje',
  lashes: 'Extensiones de Pestañas',
  wax: 'Depilación',
  massage: 'Masaje',
}

export default function ProviderProfile() {
  const { provider_id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [reviews, setReviews] = useState([])
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (provider_id) fetchAll()
  }, [provider_id])

  async function fetchAll() {
    setLoading(true)

    // Perfil + nombre
    const { data: prof, error } = await supabase
      .from('provider_profiles')
      .select(`
        *,
        users:user_id (full_name)
      `)
      .eq('user_id', provider_id)
      .eq('is_active', true)
      .single()

    if (error || !prof) {
      setNotFound(true)
      setLoading(false)
      return
    }
    setProfile(prof)

    // Reseñas
    const { data: revs } = await supabase
      .from('reviews')
      .select(`
        rating,
        comment,
        created_at,
        users:client_id (full_name)
      `)
      .eq('provider_id', provider_id)
      .order('created_at', { ascending: false })
      .limit(20)

    setReviews(revs || [])

    // Portafolio
    const { data: port } = await supabase
      .from('portfolio')
      .select('*')
      .eq('provider_id', provider_id)
      .order('created_at', { ascending: false })
      .limit(12)

    setPortfolio(port || [])
    setLoading(false)
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function avgRating() {
    if (!reviews.length) return null
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  function stars(rating) {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#a855f7' : '#3b0764', fontSize: 14 }}>★</span>
    ))
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
      paddingBottom: 60,
    },
    backBtn: {
      position: 'absolute',
      top: 16,
      left: 16,
      background: 'rgba(0,0,0,0.5)',
      border: '1px solid #3b0764',
      borderRadius: 20,
      color: '#e9d5ff',
      padding: '6px 14px',
      fontSize: 13,
      cursor: 'pointer',
      zIndex: 10,
    },
    heroWrap: {
      position: 'relative',
      background: 'linear-gradient(180deg, #1a0035 0%, #0a0010 100%)',
      padding: '48px 20px 24px',
      textAlign: 'center',
      borderBottom: '1px solid #2d0060',
    },
    avatar: {
      width: 88,
      height: 88,
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid #7c3aed',
      marginBottom: 12,
    },
    avatarPlaceholder: {
      width: 88,
      height: 88,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #3b0764, #7c3aed)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 32,
      margin: '0 auto 12px',
    },
    name: {
      fontSize: 22,
      fontWeight: 800,
      color: '#f3e8ff',
      marginBottom: 6,
    },
    ratingRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginBottom: 8,
    },
    ratingNum: {
      fontSize: 18,
      fontWeight: 800,
      color: '#a855f7',
    },
    ratingCount: {
      fontSize: 12,
      color: '#7c3aed',
    },
    bio: {
      fontSize: 14,
      color: '#c4b5fd',
      lineHeight: 1.6,
      marginTop: 8,
      textAlign: 'left',
    },
    section: {
      padding: '20px 16px 0',
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: 700,
      color: '#7c3aed',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 12,
    },
    chipRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 20,
    },
    chip: {
      background: '#1a0035',
      border: '1px solid #3b0764',
      borderRadius: 20,
      padding: '5px 12px',
      fontSize: 12,
      color: '#e9d5ff',
    },
    divider: {
      height: 1,
      background: '#1a0035',
      margin: '4px 16px',
    },
    portfolioGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 4,
      marginBottom: 20,
    },
    portfolioImg: {
      width: '100%',
      aspectRatio: '1',
      objectFit: 'cover',
      borderRadius: 8,
      border: '1px solid #2d0060',
    },
    reviewCard: {
      background: '#12001f',
      border: '1px solid #2d0060',
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
    },
    reviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    reviewerName: {
      fontSize: 13,
      fontWeight: 700,
      color: '#e9d5ff',
    },
    reviewDate: {
      fontSize: 11,
      color: '#4c1d95',
    },
    reviewComment: {
      fontSize: 13,
      color: '#c4b5fd',
      lineHeight: 1.5,
    },
    empty: {
      fontSize: 13,
      color: '#4c1d95',
      fontStyle: 'italic',
      marginBottom: 20,
    },
    noPortfolio: {
      background: '#12001f',
      border: '1px dashed #2d0060',
      borderRadius: 12,
      padding: 24,
      textAlign: 'center',
      fontSize: 13,
      color: '#4c1d95',
      marginBottom: 20,
    },
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#a855f7' }}>Cargando perfil...</div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div style={{ ...s.page, padding: 24 }}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <div style={{ textAlign: 'center', paddingTop: 100, color: '#6d28d9' }}>
          Perfil no encontrado.
        </div>
      </div>
    )
  }

  const avg = avgRating()
  const fullName = profile.users?.full_name || 'Proveedora'

  return (
    <div style={s.page}>
      {/* Hero */}
      <div style={s.heroWrap}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>← Volver</button>

        {profile.photo_url ? (
          <img src={profile.photo_url} alt={fullName} style={s.avatar} />
        ) : (
          <div style={s.avatarPlaceholder}>💅</div>
        )}

        <div style={s.name}>{fullName}</div>

        {avg ? (
          <div style={s.ratingRow}>
            <span style={s.ratingNum}>{avg}</span>
            <div>{stars(Math.round(avg))}</div>
            <span style={s.ratingCount}>({reviews.length} reseña{reviews.length !== 1 ? 's' : ''})</span>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: '#4c1d95', marginBottom: 8 }}>Sin reseñas aún</div>
        )}

        {profile.bio && <div style={s.bio}>{profile.bio}</div>}
      </div>

      {/* Servicios */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Servicios</div>
        <div style={s.chipRow}>
          {(profile.services || []).length > 0
            ? profile.services.map(sv => (
                <span key={sv} style={s.chip}>{SERVICES_MAP[sv] || sv}</span>
              ))
            : <span style={s.empty}>No especificado</span>
          }
        </div>
      </div>

      <div style={s.divider} />

      {/* Zonas */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Zonas donde trabaja</div>
        <div style={s.chipRow}>
          {(profile.zones || []).length > 0
            ? profile.zones.map(z => (
                <span key={z} style={{ ...s.chip, borderColor: '#3b0764', color: '#a78bfa' }}>
                  📍 {z}
                </span>
              ))
            : <span style={s.empty}>No especificado</span>
          }
        </div>
      </div>

      <div style={s.divider} />

      {/* Portafolio */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Portafolio</div>
        {portfolio.length > 0 ? (
          <div style={s.portfolioGrid}>
            {portfolio.map(item => (
              <img
                key={item.id}
                src={item.photo_url}
                alt={item.description || 'Trabajo'}
                style={s.portfolioImg}
              />
            ))}
          </div>
        ) : (
          <div style={s.noPortfolio}>
            Sin fotos de trabajos aún.
          </div>
        )}
      </div>

      <div style={s.divider} />

      {/* Reseñas */}
      <div style={s.section}>
        <div style={s.sectionTitle}>
          Reseñas {reviews.length > 0 && `· ${reviews.length}`}
        </div>

        {reviews.length === 0 && (
          <div style={s.empty}>Sin reseñas todavía.</div>
        )}

        {reviews.map((rev, i) => (
          <div key={i} style={s.reviewCard}>
            <div style={s.reviewHeader}>
              <span style={s.reviewerName}>
                {rev.users?.full_name || 'Cliente'}
              </span>
              <span style={s.reviewDate}>
                {new Date(rev.created_at).toLocaleDateString('es-MX', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </span>
            </div>
            <div style={{ marginBottom: 6 }}>{stars(rev.rating)}</div>
            {rev.comment && <div style={s.reviewComment}>{rev.comment}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}