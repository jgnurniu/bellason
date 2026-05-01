import { useNavigate } from 'react-router-dom'
import { SERVICES } from '../constants/services'

const SERVICE_ICONS = {
  nails:   '💅',
  hair:    '✂️',
  makeup:  '💄',
  lashes:  '👁️',
  wax:     '🪶',
  massage: '💆',
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>

      {/* NAV */}
      <nav style={styles.nav}>
        <span style={styles.logo}>Bellason</span>
        <div style={styles.navLinks}>
          <button style={styles.navLogin} onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
          <button style={styles.navRegister} onClick={() => navigate('/registro')}>
            Registrarse
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroBadge}>📍 Hermosillo, Sonora</div>
        <h1 style={styles.heroTitle}>
          Belleza a domicilio,<br />cerca de ti
        </h1>
        <p style={styles.heroSubtitle}>
          Encuentra proveedoras de belleza en tu zona,<br />
          ve sus trabajos y agenda tu cita al instante.
        </p>
        <div style={styles.heroButtons}>
          <button style={styles.btnPrimary} onClick={() => navigate('/registro')}>
            Buscar servicio
          </button>
          <button style={styles.btnSecondary} onClick={() => navigate('/registro')}>
            Soy proveedora
          </button>
        </div>
      </section>

      {/* CÓMO FUNCIONA — CLIENTE */}
      <section style={styles.section}>
        <p style={styles.sectionTag}>Para clientes</p>
        <h2 style={styles.sectionTitle}>Pide como un InDrive de belleza</h2>

        <div style={styles.steps}>
          {[
            { n: '1', title: 'Publica lo que necesitas', desc: 'Elige el servicio, tu zona y tu presupuesto. Es gratis.' },
            { n: '2', title: 'Recibe ofertas', desc: 'Las proveedoras cerca de ti mandan su precio y mensaje.' },
            { n: '3', title: 'Acepta la mejor', desc: 'Tú decides quién va. Ves su portafolio y reseñas antes de aceptar.' },
            { n: '4', title: 'Lista en casa', desc: 'La proveedora llega a tu domicilio. Al terminar dejas tu reseña.' },
          ].map(step => (
            <div key={step.n} style={styles.stepCard}>
              <div style={styles.stepNumber}>{step.n}</div>
              <div>
                <p style={styles.stepTitle}>{step.title}</p>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA — PROVEEDORA */}
      <section style={{ ...styles.section, backgroundColor: '#12001f' }}>
        <p style={styles.sectionTag}>Para proveedoras</p>
        <h2 style={styles.sectionTitle}>Consigue clientes sin publicidad</h2>

        <div style={styles.steps}>
          {[
            { n: '1', title: 'Crea tu perfil', desc: 'Sube fotos de tus trabajos, agrega tus servicios y zonas donde trabajas.' },
            { n: '2', title: 'Ve solicitudes cerca', desc: 'Filtra por servicio y zona. Solo ves lo que te interesa.' },
            { n: '3', title: 'Haz tu oferta', desc: 'Manda tu precio y un mensaje. El cliente decide.' },
            { n: '4', title: 'Gana el lead', desc: 'Si el cliente acepta, se descuenta 1 crédito y recibes su contacto.' },
          ].map(step => (
            <div key={step.n} style={styles.stepCard}>
              <div style={styles.stepNumber}>{step.n}</div>
              <div>
                <p style={styles.stepTitle}>{step.title}</p>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.creditsNote}>
          <p style={styles.creditsNoteText}>
            💳 Recarga mínima $140 MXN = 4 créditos. Solo pagas cuando el cliente te elige.
          </p>
        </div>
      </section>

      {/* SERVICIOS */}
      <section style={styles.section}>
        <p style={styles.sectionTag}>Servicios disponibles</p>
        <h2 style={styles.sectionTitle}>¿Qué necesitas hoy?</h2>

        <div style={styles.servicesGrid}>
          {SERVICES.map(s => (
            <div key={s.id} style={styles.serviceCard}>
              <span style={styles.serviceIcon}>{SERVICE_ICONS[s.id] || '✨'}</span>
              <span style={styles.serviceLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* MODO CLIENTE / PROVEEDORA */}
      <section style={{ ...styles.section, backgroundColor: '#12001f' }}>
        <p style={styles.sectionTag}>Flexible</p>
        <h2 style={styles.sectionTitle}>¿Proveedora que también quiere servicios?</h2>
        <p style={styles.sectionDesc}>
          Puedes cambiar entre modo cliente y modo proveedora desde tu cuenta.
          No necesitas registrarte dos veces.
        </p>
      </section>

      {/* CTA FINAL */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Empieza ahora</h2>
        <p style={styles.ctaDesc}>Es gratis para clientes. Proveedoras pagan solo cuando consiguen un lead.</p>
        <div style={styles.heroButtons}>
          <button style={styles.btnPrimary} onClick={() => navigate('/registro')}>
            Crear cuenta
          </button>
          <button style={styles.btnGhost} onClick={() => navigate('/login')}>
            Ya tengo cuenta
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <span style={styles.footerLogo}>Bellason</span>
        <p style={styles.footerText}>Hermosillo, Sonora · bellason.mx</p>
      </footer>

    </div>
  )
}

const styles = {
  page: {
    backgroundColor: '#0a0010',
    minHeight: '100vh',
    fontFamily: 'system-ui, sans-serif',
  },

  // NAV
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #1a0030',
    position: 'sticky',
    top: 0,
    backgroundColor: '#0a0010',
    zIndex: 10,
  },
  logo: {
    color: '#a855f7',
    fontSize: '1.4rem',
    fontWeight: '800',
    letterSpacing: '-0.5px',
  },
  navLinks: {
    display: 'flex',
    gap: '0.5rem',
  },
  navLogin: {
    background: 'none',
    border: '1px solid #3b0764',
    color: '#a855f7',
    padding: '0.45rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  navRegister: {
    background: '#7c3aed',
    border: 'none',
    color: '#fff',
    padding: '0.45rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
  },

  // HERO
  hero: {
    textAlign: 'center',
    padding: '4rem 1.5rem 3rem',
    maxWidth: '600px',
    margin: '0 auto',
  },
  heroBadge: {
    display: 'inline-block',
    backgroundColor: '#1a0030',
    border: '1px solid #3b0764',
    color: '#a855f7',
    fontSize: '0.8rem',
    fontWeight: '600',
    padding: '0.3rem 0.85rem',
    borderRadius: '20px',
    marginBottom: '1.5rem',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 'clamp(1.8rem, 5vw, 2.75rem)',
    fontWeight: '800',
    lineHeight: '1.2',
    margin: '0 0 1rem',
  },
  heroSubtitle: {
    color: '#9ca3af',
    fontSize: '1rem',
    lineHeight: '1.6',
    margin: '0 0 2rem',
  },
  heroButtons: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    backgroundColor: '#7c3aed',
    border: 'none',
    color: '#fff',
    padding: '0.85rem 1.75rem',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    border: '1px solid #7c3aed',
    color: '#a855f7',
    padding: '0.85rem 1.75rem',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
  btnGhost: {
    backgroundColor: 'transparent',
    border: '1px solid #3b0764',
    color: '#9ca3af',
    padding: '0.85rem 1.75rem',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // SECCIONES
  section: {
    padding: '3rem 1.5rem',
    maxWidth: '600px',
    margin: '0 auto',
  },
  sectionTag: {
    color: '#7c3aed',
    fontSize: '0.8rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    margin: '0 0 0.5rem',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 'clamp(1.3rem, 4vw, 1.75rem)',
    fontWeight: '800',
    margin: '0 0 1.75rem',
    lineHeight: '1.3',
  },
  sectionDesc: {
    color: '#9ca3af',
    fontSize: '1rem',
    lineHeight: '1.7',
    margin: 0,
  },

  // STEPS
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  stepCard: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    backgroundColor: '#0d0018',
    border: '1px solid #1a0030',
    borderRadius: '12px',
    padding: '1rem',
  },
  stepNumber: {
    backgroundColor: '#3b0764',
    color: '#d8b4fe',
    fontWeight: '800',
    fontSize: '0.9rem',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: '0.95rem',
    margin: '0 0 0.25rem',
  },
  stepDesc: {
    color: '#9ca3af',
    fontSize: '0.875rem',
    margin: 0,
    lineHeight: '1.5',
  },

  // CREDITS NOTE
  creditsNote: {
    backgroundColor: '#1a0030',
    border: '1px solid #3b0764',
    borderRadius: '10px',
    padding: '0.85rem 1rem',
    marginTop: '1.25rem',
  },
  creditsNoteText: {
    color: '#d8b4fe',
    fontSize: '0.875rem',
    margin: 0,
    lineHeight: '1.5',
  },

  // SERVICIOS
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.75rem',
  },
  serviceCard: {
    backgroundColor: '#12001f',
    border: '1px solid #1a0030',
    borderRadius: '12px',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  serviceIcon: {
    fontSize: '1.5rem',
  },
  serviceLabel: {
    color: '#d8b4fe',
    fontWeight: '600',
    fontSize: '0.9rem',
  },

  // CTA
  ctaSection: {
    textAlign: 'center',
    padding: '3rem 1.5rem 4rem',
    maxWidth: '500px',
    margin: '0 auto',
  },
  ctaTitle: {
    color: '#fff',
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: '800',
    margin: '0 0 0.75rem',
  },
  ctaDesc: {
    color: '#9ca3af',
    fontSize: '0.95rem',
    margin: '0 0 2rem',
    lineHeight: '1.6',
  },

  // FOOTER
  footer: {
    borderTop: '1px solid #1a0030',
    padding: '1.5rem',
    textAlign: 'center',
  },
  footerLogo: {
    color: '#a855f7',
    fontWeight: '800',
    fontSize: '1.1rem',
    display: 'block',
    marginBottom: '0.4rem',
  },
  footerText: {
    color: '#6b7280',
    fontSize: '0.8rem',
    margin: 0,
  },
}