import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { SERVICES } from '../../constants/services'

export default function Profile() {
  const { id: paramId } = useParams()
  const { user: authUser } = useAuth()
  const providerId = paramId || authUser?.id
  const navigate = useNavigate()

  const [profile, setProfile]     = useState(null)
  const [user, setUser]           = useState(null)
  const [portfolio, setPortfolio] = useState([])
  const [reviews, setReviews]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => { if (providerId) load() }, [providerId])

  async function load() {
    setError(null)

    const [
      { data: prof, error: profErr },
      { data: revs, error: revErr },
      { data: port, error: portErr },
    ] = await Promise.all([
      supabase
        .from('provider_profiles')
        .select('*, users(full_name)')
        .eq('user_id', providerId)
        .single(),
      supabase
        .from('reviews')
        .select('rating, comment, created_at, users(full_name)')
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false }),
      supabase
        .from('portfolio')
        .select('*')
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false }),
    ])

    if (profErr || !prof) {
      setError('Perfil no encontrado.')
      setLoading(false)
      return
    }

    if (revErr)  console.error(revErr)
    if (portErr) console.error(portErr)

    setProfile(prof)
    setUser(prof.users)
    setReviews(revs || [])
    setPortfolio(port || [])
    setLoading(false)
  }

  function getServiceLabel(serviceId) {
    return SERVICES.find(s => s.id === serviceId)?.label || serviceId
  }

  function avgRating() {
    if (!reviews.length) return null
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  function renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#fbbf24' : '#3b0764', fontSize: '1rem' }}>
        ★
      </span>
    ))
  }

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#9ca3af' }}>Cargando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.container}>
        <button style={styles.back} onClick={() => navigate(-1)}>← Volver</button>
        <div style={styles.errorBox}>
          <p style={styles.errorText}>{error}</p>
        </div>
      </div>
    )
  }

  const avg = avgRating()

  return (
    <div style={styles.container}>
      <button style={styles.back} onClick={() => navigate(-1)}>← Volver</button>

      {/* Header del perfil */}
      <div style={styles.profileCard}>
        {profile.photo_url ? (
          <img src={profile.photo_url} alt="foto" style={styles.avatar} />
        ) : (
          <div style={styles.avatarPlaceholder}>
            {user?.full_name?.[0]?.toUpperCase() || '?'}
          </div>
        )}

        <div style={styles.profileInfo}>
          <h1 style={styles.name}>{user?.full_name || 'Proveedora'}</h1>

          {avg ? (
            <div style={styles.ratingRow}>
              <span style={styles.ratingNumber}>{avg}</span>
              <div>{renderStars(Math.round(avg))}</div>
              <span style={styles.ratingCount}>
                ({reviews.length} reseña{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          ) : (
            <p style={styles.noRating}>Sin reseñas aún</p>
          )}
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div style={styles.section}>
          <p style={styles.sectionTitle}>Acerca de</p>
          <p style={styles.bio}>{profile.bio}</p>
        </div>
      )}

      {/* Servicios */}
      {profile.services?.length > 0 && (
        <div style={styles.section}>
          <p style={styles.sectionTitle}>Servicios</p>
          <div style={styles.tagsRow}>
            {profile.services.map(s => (
              <span key={s} style={styles.tag}>{getServiceLabel(s)}</span>
            ))}
          </div>
        </div>
      )}

      {/* Zonas */}
      {profile.zones?.length > 0 && (
        <div style={styles.section}>
          <p style={styles.sectionTitle}>Zonas donde trabaja</p>
          <div style={styles.tagsRow}>
            {profile.zones.map(z => (
              <span key={z} style={styles.tagGray}>📍 {z}</span>
            ))}
          </div>
        </div>
      )}

      {/* Portafolio */}
      <div style={styles.section}>
        <p style={styles.sectionTitle}>Trabajos anteriores</p>
        {portfolio.length === 0 ? (
          <p style={styles.emptyText}>Sin fotos aún.</p>
        ) : (
          <div style={styles.grid}>
            {portfolio.map(item => (
              <div key={item.id} style={styles.gridItem}>
                <img
                  src={item.photo_url}
                  alt={item.description || 'trabajo'}
                  style={styles.gridImg}
                  onError={e => { e.target.style.display = 'none' }}
                />
                {item.description && (
                  <p style={styles.gridCaption}>{item.description}</p>
                )}
                {item.service && (
                  <span style={styles.gridTag}>{getServiceLabel(item.service)}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reseñas */}
      <div style={styles.section}>
        <p style={styles.sectionTitle}>Reseñas</p>
        {reviews.length === 0 ? (
          <p style={styles.emptyText}>Sin reseñas aún.</p>
        ) : (
          reviews.map((rev, i) => (
            <div key={i} style={styles.reviewCard}>
              <div style={styles.reviewTop}>
                <span style={styles.reviewName}>
                  {rev.users?.full_name || 'Cliente'}
                </span>
                <div>{renderStars(rev.rating)}</div>
              </div>
              {rev.comment && (
                <p style={styles.reviewComment}>{rev.comment}</p>
              )}
              <p style={styles.reviewDate}>
                {new Date(rev.created_at).toLocaleDateString('es-MX', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>
          ))
        )}
      </div>
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
  back: {
    background: 'none',
    border: 'none',
    color: '#a855f7',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: 0,
    marginBottom: '1.25rem',
    display: 'block',
  },
  errorBox: {
    backgroundColor: '#2d0a0a',
    border: '1px solid #7f1d1d',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
  },
  errorText: { color: '#f87171', margin: 0, fontSize: '0.9rem' },
  profileCard: {
    backgroundColor: '#12001f',
    border: '1px solid #3b0764',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #7c3aed',
    flexShrink: 0,
  },
  avatarPlaceholder: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: '#3b0764',
    border: '2px solid #7c3aed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#a855f7',
    fontSize: '1.75rem',
    fontWeight: '700',
    flexShrink: 0,
  },
  profileInfo: { flex: 1 },
  name: {
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: '700',
    margin: '0 0 0.4rem',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    flexWrap: 'wrap',
  },
  ratingNumber: {
    color: '#fbbf24',
    fontWeight: '700',
    fontSize: '1rem',
  },
  ratingCount: {
    color: '#9ca3af',
    fontSize: '0.8rem',
  },
  noRating: {
    color: '#6b7280',
    fontSize: '0.85rem',
    margin: 0,
  },
  section: {
    backgroundColor: '#12001f',
    border: '1px solid #3b0764',
    borderRadius: '12px',
    padding: '1rem',
    marginBottom: '1rem',
  },
  sectionTitle: {
    color: '#6b7280',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 0.75rem',
  },
  bio: {
    color: '#d1d5db',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    margin: 0,
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  tag: {
    backgroundColor: '#3b0764',
    color: '#d8b4fe',
    padding: '0.3rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  tagGray: {
    backgroundColor: '#0d0018',
    color: '#9ca3af',
    padding: '0.3rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    border: '1px solid #3b0764',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  gridItem: {
    backgroundColor: '#0d0018',
    border: '1px solid #3b0764',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  gridImg: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    display: 'block',
  },
  gridCaption: {
    color: '#9ca3af',
    fontSize: '0.8rem',
    padding: '0.4rem 0.6rem 0',
    margin: 0,
  },
  gridTag: {
    display: 'inline-block',
    backgroundColor: '#3b0764',
    color: '#d8b4fe',
    fontSize: '0.7rem',
    padding: '0.2rem 0.5rem',
    borderRadius: '20px',
    margin: '0.3rem 0.6rem 0.5rem',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: '0.9rem',
    margin: 0,
  },
  reviewCard: {
    backgroundColor: '#0d0018',
    border: '1px solid #3b0764',
    borderRadius: '8px',
    padding: '0.75rem',
    marginBottom: '0.75rem',
  },
  reviewTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.4rem',
  },
  reviewName: {
    color: '#d8b4fe',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  reviewComment: {
    color: '#d1d5db',
    fontSize: '0.9rem',
    margin: '0.25rem 0 0.4rem',
    lineHeight: '1.5',
  },
  reviewDate: {
    color: '#6b7280',
    fontSize: '0.75rem',
    margin: 0,
  },
}