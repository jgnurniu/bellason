import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const heroImg = "https://github.com/jgnurniu/bellason/blob/main/public/hero-v2.png?raw=true";

/* ── Google Fonts injection ── */
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Inter:wght@300;400;500;600;700;800;900&display=swap";
fontLink.rel = "stylesheet";
if (!document.head.querySelector('link[href*="Syne"]')) document.head.appendChild(fontLink);

const styleEl = document.createElement("style");
styleEl.textContent = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes floatA {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes floatB {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-7px); }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(168,85,247,0.0); }
    50%       { box-shadow: 0 0 0 14px rgba(168,85,247,0.08); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes lineGrow {
    from { width: 0; }
    to   { width: 100%; }
  }
  @keyframes orbit {
    from { transform: translate(-50%,-50%) rotate(0deg) translateX(220px) rotate(0deg); }
    to   { transform: translate(-50%,-50%) rotate(360deg) translateX(220px) rotate(-360deg); }
  }
  @keyframes starPulse {
    0%, 100% { opacity: 0.9; transform: scale(1) rotate(0deg); }
    50%       { opacity: 0.5; transform: scale(0.7) rotate(20deg); }
  }
  .btn-purple-hover:hover { opacity: 0.88; transform: translateY(-1px); }
  .btn-outline-hover:hover { border-color: rgba(168,85,247,0.7) !important; color: #c4b5fd !important; transform: translateY(-1px); }
  .service-card:hover { background: rgba(168,85,247,0.1) !important; border-color: rgba(168,85,247,0.55) !important; transform: translateY(-6px) !important; }
  .step-card:hover { border-color: rgba(168,85,247,0.45) !important; background: rgba(168,85,247,0.05) !important; }
  .benefit-row:hover { border-color: rgba(168,85,247,0.3) !important; background: rgba(168,85,247,0.05) !important; }
  .testimonial-card:hover { border-color: rgba(168,85,247,0.4) !important; transform: translateY(-4px); }
  .nav-link:hover { color: rgba(255,255,255,0.85) !important; }
  * { box-sizing: border-box; }
  ::selection { background: rgba(168,85,247,0.35); }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #080010; }
  ::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.4); border-radius: 10px; }
`;
if (!document.head.querySelector("style[data-bellason]")) {
  styleEl.setAttribute("data-bellason", "1");
  document.head.appendChild(styleEl);
}

/* ── Breakpoint hook ── */
function useBreakpoint() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return { isMobile: width < 640, isTablet: width >= 640 && width < 1024, isDesktop: width >= 1024, width };
}

/* ── Intersection observer for scroll animations ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ══ SVG ICON LIBRARY ══ */
const Icon = {
  Lotus: ({ size = 38 }) => (
    <img
      src="https://github.com/jgnurniu/bellason/blob/main/public/logo-v1.png?raw=true"
      alt="Logo"
      width={size}
      height={size}
      style={{ display: "block", flexShrink: 0, objectFit: "contain" }}
    />
  ),
  Home: ({ size = 18, color = "#a855f7" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Zap: ({ size = 18, color = "#a855f7" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  CreditCard: ({ size = 18, color = "#a855f7" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  Shield: ({ size = 18, color = "#a855f7" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Scissors: ({ size = 22, color = "#a855f7" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>
    </svg>
  ),
  Sparkles: ({ size = 22, color = "#a855f7" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"/><path d="M5 3L5.5 5L7 5.5L5.5 6L5 8L4.5 6L3 5.5L4.5 5L5 3Z"/><path d="M19 14L19.5 16L21 16.5L19.5 17L19 19L18.5 17L17 16.5L18.5 16L19 14Z"/>
    </svg>
  ),
  Eye: ({ size = 22, color = "#a855f7" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Feather: ({ size = 22, color = "#a855f7" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>
    </svg>
  ),
  Hand: ({ size = 22, color = "#a855f7" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
    </svg>
  ),
  Waves: ({ size = 22, color = "#a855f7" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
    </svg>
  ),
  FileText: ({ size = 20, color = "#fff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  MessageCircle: ({ size = 20, color = "#fff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  ThumbsUp: ({ size = 20, color = "#fff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
    </svg>
  ),
  Star: ({ size = 20, color = "#fff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  StarFilled: ({ size = 14, color = "#f59e0b" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Users: ({ size = 16, color = "#fff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Calendar: ({ size = 16, color = "#fff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  MapPin: ({ size = 16, color = "#a855f7" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Phone: ({ size = 16, color = "rgba(255,255,255,0.38)" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
  Gift: ({ size = 20, color = "#fff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  ),
  DollarSign: ({ size = 20, color = "#fff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Check: ({ size = 12, color = "#a855f7" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  CheckCircle: ({ size = 20, color = "#a855f7" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Menu: ({ size = 18, color = "#fff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  X: ({ size = 16, color = "rgba(255,255,255,0.5)" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  ArrowRight: ({ size = 16, color = "#fff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Quote: ({ size = 28, color = "rgba(168,85,247,0.25)" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
    </svg>
  ),
  Verified: ({ size = 16, color = "#a855f7" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
};

/* ── Avatar stack ── */
function AvatarStack({ size = 36 }) {
  const avatars = [
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/women/68.jpg",
    "https://randomuser.me/api/portraits/women/65.jpg",
    "https://randomuser.me/api/portraits/women/17.jpg",
  ];
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {avatars.map((src, i) => (
        <img key={i} src={src} alt="" style={{
          width: size, height: size, borderRadius: "50%",
          border: "2px solid #0d0014",
          marginLeft: i === 0 ? 0 : -size * 0.28,
          objectFit: "cover", flexShrink: 0,
          zIndex: avatars.length - i,
        }}/>
      ))}
      <div style={{
        width: size, height: size, borderRadius: "50%",
        border: "2px solid #0d0014",
        marginLeft: -size * 0.28,
        background: "linear-gradient(135deg, #a855f7, #7c3aed)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.22, fontWeight: "700", color: "#fff", flexShrink: 0,
        fontFamily: "'Syne', sans-serif",
      }}>10K+</div>
    </div>
  );
}

/* ── Animated section wrapper ── */
function AnimSection({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN LANDING
════════════════════════════════════════ */
export default function Landing() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  function goRegister(role) { navigate(`/registro?rol=${role}`); }

  /* ── Font families ── */
  const FF = "'Syne', system-ui, sans-serif";
  const FB = "'DM Sans', system-ui, sans-serif";
  /* FI = Inter, used for "Bellason" wordmark — clean, thin, modern */
  const FI = "'Inter', system-ui, sans-serif";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#07000f", fontFamily: FB, color: "#fff", overflowX: "hidden" }}>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "14px 22px" : isTablet ? "16px 32px" : "16px 56px",
        borderBottom: "1px solid rgba(168,85,247,0.14)",
        position: "sticky", top: 0, zIndex: 100,
        backgroundColor: "rgba(7,0,15,0.94)",
        backdropFilter: "blur(28px)",
        animation: "fadeIn 0.6s ease both",
        fontFamily: FF,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Icon.Lotus size={isMobile ? 28 : 33} color="#a855f7" />
          {/* ── BELLASON WORDMARK: Inter, weight 300 (thin), white ── */}
          <span style={{
            fontSize: isMobile ? "18px" : "25px",
            fontWeight: "300",
            letterSpacing: "0.5px",
            color: "#fff",
            fontFamily: FI,
          }}>
            Bellason
          </span>
        </div>

        {isDesktop && (
          <div style={{ display: "flex", gap: "36px" }}>
            {[
              { label: "Inicio", href: "#", active: true },
              { label: "Servicios", href: "#servicios" },
              { label: "Cómo funciona", href: "#como-funciona" },
              { label: "Para profesionales", href: "#profesionales" },
              { label: "Precios", href: "#profesionales" },
            ].map((item) => (
              <a key={item.label} href={item.href} className="nav-link" style={{
                color: item.active ? "#a855f7" : "rgba(255,255,255,0.45)",
                textDecoration: "none", fontSize: "14px",
                fontWeight: item.active ? "600" : "400",
                borderBottom: item.active ? "1.5px solid rgba(168,85,247,0.6)" : "1.5px solid transparent",
                paddingBottom: "4px", transition: "color 0.2s, border-color 0.2s",
                fontFamily: FB,
              }}>{item.label}</a>
            ))}
          </div>
        )}

        {isDesktop ? (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button onClick={() => navigate("/login")} className="btn-outline-hover" style={S.btnOutline}>Iniciar sesión</button>
            <button onClick={() => setShowRoleModal(true)} className="btn-purple-hover" style={{ ...S.btnPurple, display: "flex", alignItems: "center", gap: "7px" }}>
              Registrarme <Icon.ArrowRight size={14} color="#fff" />
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button onClick={() => setShowRoleModal(true)} className="btn-purple-hover" style={{ ...S.btnPurple, padding: "8px 14px", fontSize: "13px" }}>
              Registrarme
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff", width: "38px", height: "38px", borderRadius: "10px",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
            }}>
              {menuOpen ? <Icon.X size={16} /> : <Icon.Menu size={18} />}
            </button>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      {menuOpen && !isDesktop && (
        <div style={{
          background: "rgba(7,0,15,0.99)", borderBottom: "1px solid rgba(168,85,247,0.1)",
          padding: "12px 22px", display: "flex", flexDirection: "column",
          animation: "fadeIn 0.2s ease both",
        }}>
          {[{ label: "Inicio", href: "#" }, { label: "Servicios", href: "#servicios" },
            { label: "Cómo funciona", href: "#como-funciona" }, { label: "Para profesionales", href: "#profesionales" }]
            .map((item, i) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} style={{
              color: i === 0 ? "#a855f7" : "rgba(255,255,255,0.6)", textDecoration: "none",
              fontSize: "15px", fontWeight: i === 0 ? "600" : "400",
              padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontFamily: FF,
            }}>{item.label}</a>
          ))}
          <button onClick={() => navigate("/login")} className="btn-outline-hover" style={{ ...S.btnOutline, marginTop: "14px", padding: "12px" }}>
            Iniciar sesión
          </button>
        </div>
      )}

      {/* ══ HERO ══ */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
        minHeight: isDesktop ? "calc(100vh - 57px)" : "auto",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background mesh */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 80% at 70% 50%, rgba(120,20,240,0.22) 0%, transparent 70%)",
        }}/>
        {/* Noise grain */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}/>

        {/* LEFT COLUMN */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: isMobile ? "center" : "flex-start",
          padding: isMobile ? "56px 24px 48px" : isTablet ? "56px 40px" : "0 0 0 64px",
          position: "relative", zIndex: 2,
        }}>

          {/* Badge de Confianza */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            width: "fit-content",
            alignSelf: isMobile ? "center" : "flex-start",
            padding: "10px 24px",
            borderRadius: "100px",
            background: "rgba(139, 92, 246, 0.12)",
            border: "1.5px solid rgba(139, 92, 246, 0.3)",
            marginBottom: "24px",
          }}>
            <Icon.Sparkles size={18} color="#a855f7" style={{ marginRight: "12px", filter: "blur(0.5px)" }} />
            <span style={{
              fontSize: "14px",
              color: "#e2e8f0",
              fontWeight: "600",
              letterSpacing: "0.4px",
              fontFamily: FB,
            }}>
              Belleza a domicilio
              <span style={{ color: "#a855f7", margin: "0 8px", fontSize: "16px" }}>•</span>
              Rápida
              <span style={{ color: "#a855f7", margin: "0 8px", fontSize: "16px" }}>•</span>
              Confiable
            </span>
          </div>

          <h1 style={{
            fontSize: isMobile ? "42px" : isTablet ? "54px" : "68px",
            fontWeight: 900,
            lineHeight: "1.03",
            margin: "0 0 20px",
            letterSpacing: isMobile ? "-1.5px" : "-2px",
            color: "#fff",
            fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            textAlign: isMobile ? "center" : "left",
            animation: "fadeUp 0.7s ease 0.1s both",
          }}>
            Reserva servicios<br/>
            de <span style={{
              background: "linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #7c3aed 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>belleza</span> en<br/>
            <span style={{
              background: "linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #7c3aed 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>minutos</span>
          </h1>

          <p style={{
            textAlign: isMobile ? "center" : "left",
            fontSize: isMobile ? "15px" : "16.5px",
            color: "rgba(255,255,255,0.45)",
            lineHeight: "1.7",
            margin: "0 0 28px",
            maxWidth: isMobile ? "100%" : "460px",
            fontFamily: FB,
            animation: "fadeUp 0.7s ease 0.2s both",
          }}>
            Uñas, maquillaje y cabello a domicilio con profesionales{" "}
            <span style={{ color: "rgba(196,181,253,0.9)", fontWeight: "500" }}>verificadas</span>{" "}
            cerca de ti en Hermosillo.
          </p>

          {/* Trust bullets */}
          <div style={{
            display: "flex",
            gap: isMobile ? "16px" : "24px",
            marginBottom: "32px",
            flexWrap: "wrap",
            justifyContent: isMobile ? "center" : "flex-start",
            animation: "fadeUp 0.7s ease 0.3s both",
          }}>
            {[
              { icon: <Icon.Check size={16} color="#a855f7"/>, text: "Profesionales verificados" },
              { icon: <Icon.Star size={16} color="#a855f7"/>, text: "Pago seguro y confiable" },
            ].map(b => (
              <div key={b.text} style={{
                display: "flex", alignItems: "center", gap: "10px",
                fontSize: "14.5px", color: "rgba(255,255,255,0.9)", fontWeight: "500",
              }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: "transparent", border: "1px solid #a855f7",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>{b.icon}</div>
                {b.text}
              </div>
            ))}
          </div>

          {/* Input + CTA */}
          <div style={{
            display: "flex",
            gap: "12px",
            marginBottom: "36px",
            flexDirection: isMobile ? "column" : "row",
            width: isMobile ? "100%" : "auto",
            maxWidth: "600px",
            animation: "fadeUp 0.7s ease 0.35s both",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "12px",
              background: "#121217",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px", padding: "16px 20px",
              flex: isMobile ? "none" : 1,
              width: isMobile ? "100%" : "auto",
              maxWidth: isMobile ? "100%" : "300px",
              transition: "border-color 0.2s",
            }}>
              <Icon.Phone size={18} color="#a855f7"/>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Tu número o email"
                style={{
                  background: "transparent", border: "none", outline: "none",
                  color: "#fff", fontSize: "15px", width: "100%", fontFamily: FB,
                }}
              />
            </div>
            <button
              onClick={() => setShowRoleModal(true)}
              className="btn-purple-hover"
              style={{
                ...S.btnPurple,
                padding: isMobile ? "16px 24px" : "16px 32px",
                fontSize: "15.5px",
                whiteSpace: "nowrap",
                borderRadius: "12px",
                width: isMobile ? "100%" : "auto",
                flex: isMobile ? "none" : "0 0 auto",
                display: "flex", alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: FF, fontWeight: "600",
                background: "linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)",
                boxShadow: "0 4px 20px rgba(168, 85, 247, 0.35)",
                border: "none", color: "#fff", cursor: "pointer",
              }}
            >
              Encontrar profesional <Icon.ArrowRight size={17} color="#fff"/>
            </button>
          </div>

          {/* Social proof */}
          <div style={{
            display: "flex", alignItems: "center", gap: "16px",
            animation: "fadeUp 0.7s ease 0.45s both",
            justifyContent: isMobile ? "center" : "flex-start",
            width: "100%",
          }}>
            <AvatarStack size={42}/>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
                {[0,1,2,3,4].map(i => <Icon.StarFilled key={i} size={15} color="#a855f7"/>)}
              </div>
              <span style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.6)", fontFamily: FB }}>
                10,000+ usuarias ya confían en Bellason
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — Hero image + floating cards */}
        {!isMobile && (
          <div style={{ position: "relative", minHeight: isTablet ? "500px" : "660px" }}>
            {/* Orb */}
            <div style={{
              position: "absolute", width: "580px", height: "660px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(130,20,255,0.85) 0%, rgba(90,0,200,0.45) 35%, rgba(50,0,140,0.12) 60%, transparent 80%)",
              top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              pointerEvents: "none", zIndex: 0, filter: "blur(6px)",
            }}/>
            {/* Outer ring */}
            <div style={{
              position: "absolute", width: "420px", height: "420px", borderRadius: "50%",
              border: "1px solid rgba(168,85,247,0.18)",
              top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 0,
            }}/>
            {/* Hero image */}
            <img src={heroImg} alt="Profesional Bellason" style={{
              position: "absolute", bottom: 0, left: "27%", transform: "translateX(-50%)",
              zIndex: 1, height: "100%", width: "auto", maxWidth: "none", display: "block",
              filter: "drop-shadow(rgba(130,20,255,0.55) 0px 0px 40px)",
              animation: "fadeIn 1s ease 0.5s both",
            }}/>
            {/* Bottom fade */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "80px",
              background: "linear-gradient(to top, #07000f 0%, transparent 100%)",
              zIndex: 2, pointerEvents: "none",
            }}/>

            {isDesktop && (
              <>
                {/* Card 1 */}
                <div style={{
                  ...S.floatCard,
                  top: "56px", right: "12px", width: "230px", height: "130px",
                  padding: "14px", display: "flex", alignItems: "center", boxSizing: "border-box",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", width: "100%" }}>
                    <div style={{ ...S.iconCircle, background: "#8b5cf6", width: "46px", height: "46px", flexShrink: 0 }}>
                      <Icon.Users size={22} color="#fff" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" }}>
                      <span style={{ fontSize: "15px", fontWeight: "600", color: "#fff", lineHeight: "1.2", fontFamily: FF }}>
                        Profesionales<br />verificados
                      </span>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {[
                          "https://randomuser.me/api/portraits/women/44.jpg",
                          "https://randomuser.me/api/portraits/women/68.jpg",
                          "https://randomuser.me/api/portraits/women/65.jpg",
                        ].map((src, i) => (
                          <img key={i} src={src} alt="" style={{
                            width: "28px", height: "28px", borderRadius: "50%",
                            border: "2px solid #0f0a18", marginLeft: i === 0 ? 0 : "-10px",
                            objectFit: "cover", zIndex: 3 - i,
                          }}/>
                        ))}
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "50%",
                          backgroundColor: "#8b5cf6", border: "2px solid #0f0a18",
                          marginLeft: "-10px", display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: "11px", fontWeight: "700",
                          color: "#fff", zIndex: 0, fontFamily: FB,
                        }}>+2K</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div style={{
                  ...S.floatCard,
                  top: "240px", right: "12px", width: "230px", height: "130px",
                  padding: "14px", display: "flex", alignItems: "center", boxSizing: "border-box",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", width: "100%" }}>
                    <div style={{ ...S.iconCircle, background: "#8b5cf6", width: "46px", height: "46px", flexShrink: 0 }}>
                      <Icon.StarFilled size={22} color="#fff" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span style={{ fontSize: "20px", fontWeight: "700", color: "#fff", marginBottom: "2px", fontFamily: FF }}>4.9 / 5</span>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "6px", fontFamily: FB }}>Calificación promedio</span>
                      <div style={{ display: "flex", gap: "5px" }}>
                        {[0,1,2,3,4].map(i => <Icon.StarFilled key={i} size={16} color="#8b5cf6"/>)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div style={{
                  ...S.floatCard,
                  top: "416px", right: "12px", width: "230px", height: "130px",
                  padding: "14px", display: "flex", alignItems: "center", boxSizing: "border-box",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", width: "100%" }}>
                    <div style={{ ...S.iconCircle, background: "#8b5cf6", width: "46px", height: "46px", flexShrink: 0 }}>
                      <Icon.Calendar size={22} color="#fff" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span style={{ fontSize: "20px", fontWeight: "700", color: "#fff", marginBottom: "2px", fontFamily: FF }}>20k+</span>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.4", fontFamily: FB }}>
                        Reservas realizadas<br/>este mes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Watermark */}
                <div style={{
                  position: "absolute", bottom: "88px", left: "50%", transform: "translateX(-25%)",
                  zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", opacity: 0.7,
                }}>
                  <Icon.Lotus size={26} color="#a855f7"/>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", fontWeight: "300", letterSpacing: "4px", fontFamily: FI }}>BELLASON</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Mini stats strip — solo en móvil */}
        {isMobile && (
          <div style={{
            gridColumn: "1 / -1",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
            padding: "0 24px 48px",
            position: "relative",
            zIndex: 2,
          }}>
            {[
              { icon: <Icon.Users size={18} color="#a855f7"/>, num: "2K+", label: "Profesionales" },
              { icon: <Icon.StarFilled size={18} color="#a855f7"/>, num: "4.9", label: "Calificación" },
              { icon: <Icon.Calendar size={18} color="#a855f7"/>, num: "20K+", label: "Reservas/mes" },
            ].map((stat, i) => (
              <div key={i} style={{
                background: "rgba(168,85,247,0.07)",
                border: "1px solid rgba(168,85,247,0.18)",
                borderRadius: "14px",
                padding: "14px 10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                textAlign: "center",
              }}>
                {stat.icon}
                <span style={{ fontSize: "17px", fontWeight: "800", color: "#fff", fontFamily: FF, letterSpacing: "-0.5px" }}>{stat.num}</span>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: FB, lineHeight: "1.3" }}>{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══ FEATURE BAR ══ */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        borderTop: "1px solid rgba(168,85,247,0.12)",
        borderBottom: "1px solid rgba(168,85,247,0.12)",
        background: "rgba(7,0,15,0.98)",
      }}>
        {[
          { icon: <Icon.Home size={17} color="#a855f7"/>, title: "A domicilio", sub: "Vamos hasta ti" },
          { icon: <Icon.Zap size={17} color="#a855f7"/>, title: "Rápido y fácil", sub: "Reserva en minutos" },
          { icon: <Icon.CreditCard size={17} color="#a855f7"/>, title: "Pago seguro", sub: "Solo pagas por lo que usas" },
          { icon: <Icon.Shield size={17} color="#a855f7"/>, title: "100% confianza", sub: "Profesionales evaluadas" },
        ].map((f, i) => (
          <AnimSection key={i} delay={i * 0.08}>
            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              gap: isMobile ? "8px" : "14px",
              padding: isMobile ? "20px 12px" : isTablet ? "22px 24px" : "26px 30px",
              borderRight: (isMobile ? i % 2 === 0 : i < 3) ? "1px solid rgba(168,85,247,0.08)" : "none",
              borderBottom: isMobile && i < 2 ? "1px solid rgba(168,85,247,0.08)" : "none",
              textAlign: isMobile ? "center" : "left",
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "11px",
                background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "3px", color: "#fff", fontFamily: FF }}>{f.title}</div>
                <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.28)", fontFamily: FB }}>{f.sub}</div>
              </div>
            </div>
          </AnimSection>
        ))}
      </div>

      {/* ══ SERVICIOS ══ */}
      <div id="servicios" style={{ padding: isMobile ? "72px 22px" : isTablet ? "80px 36px" : "96px 72px", background: "#07000f" }}>
        <AnimSection>
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", textAlign: "center",
            marginBottom: isMobile ? "48px" : "64px",
          }}>
            <div style={{
              color: "#a855f7",
              fontSize: "13px", fontWeight: "600", letterSpacing: "1.5px",
              textTransform: "uppercase", marginBottom: "16px",
              fontFamily: "'Poppins', 'Inter', 'SF Pro Display', system-ui, sans-serif",
            }}>
              SERVICIOS DISPONIBLES
            </div>
            <h2 style={{
              fontSize: isMobile ? "38px" : "48px",
              fontWeight: "800", margin: "0", letterSpacing: "-1px", lineHeight: "1.1",
              color: "#fff",
              fontFamily: "'Poppins', 'SF Pro Display', 'Inter', system-ui, sans-serif",
              textAlign: "center",
            }}>
              Todo lo que necesitas,<br/>
              <span style={{ color: "#a855f7" }}>en tu casa</span>
            </h2>
          </div>
        </AnimSection>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "repeat(3,1fr)" : "repeat(6,1fr)",
          gap: "14px", maxWidth: "1040px", margin: "0 auto",
        }}>
          {[
            { icon: <Icon.Sparkles size={28} color="#a855f7"/>, name: "Uñas", sub: "Manicure · Gel · Acrílico" },
            { icon: <Icon.Scissors size={28} color="#a855f7"/>, name: "Cabello", sub: "Corte · Tinte · Trat." },
            { icon: <Icon.Feather size={28} color="#a855f7"/>, name: "Maquillaje", sub: "Social · Novia · Artístico" },
            { icon: <Icon.Eye size={28} color="#a855f7"/>, name: "Pestañas", sub: "Extensiones · Lifting" },
            { icon: <Icon.Hand size={28} color="#a855f7"/>, name: "Depilación", sub: "Cera · Hilo · Láser" },
            { icon: <Icon.Waves size={28} color="#a855f7"/>, name: "Masaje", sub: "Relajante · Deportivo" },
          ].map((s, i) => (
            <AnimSection key={i} delay={i * 0.07}>
              <div onClick={() => setShowRoleModal(true)} className="service-card" style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(168,85,247,0.15)",
                borderRadius: "18px", padding: isMobile ? "24px 14px" : "28px 18px",
                textAlign: "center", cursor: "pointer", transition: "all 0.25s ease",
              }}>
                <div style={{ marginBottom: "14px", display: "flex", justifyContent: "center" }}>{s.icon}</div>
                <div style={{ fontSize: "13.5px", fontWeight: "700", marginBottom: "6px", color: "#fff", fontFamily: "'Poppins', 'SF Pro Display', 'Inter', system-ui, sans-serif" }}>{s.name}</div>
                <div style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.28)", lineHeight: "1.6", fontFamily: FB }}>{s.sub}</div>
              </div>
            </AnimSection>
          ))}
        </div>
      </div>

      {/* ══ CÓMO FUNCIONA ══ */}
      <div id="como-funciona" style={{
        padding: isMobile ? "72px 22px" : isTablet ? "80px 36px" : "96px 72px",
        background: "rgba(7,0,15,0.97)",
        borderTop: "1px solid rgba(168,85,247,0.08)",
        borderBottom: "1px solid rgba(168,85,247,0.08)",
      }}>
        <AnimSection>
          <div style={{ textAlign: "center", marginBottom: isMobile ? "48px" : "64px" }}>
            <div style={{ ...S.sectionBadge, margin: "0 auto 18px" }}>
              <Icon.Zap size={12} color="#c4b5fd"/> Proceso simple
            </div>
            <h2 style={{ fontSize: isMobile ? "30px" : "40px", fontWeight: "800", margin: "0 0 12px", letterSpacing: "-0.5px", color: "#fff", fontFamily: "'Poppins', 'SF Pro Display', 'Inter', system-ui, sans-serif" }}>Cómo funciona</h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.32)", margin: 0, fontFamily: FB }}>Gratis publicar. Solo pagas si eliges a alguien.</p>
          </div>
        </AnimSection>

        <div style={{
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4,1fr)",
          gap: isMobile ? "16px" : "20px", maxWidth: "980px", margin: "0 auto", position: "relative",
        }}>
          {!isMobile && (
            <div style={{
              position: "absolute", top: "34px", left: "12%", right: "12%", height: "1px",
              background: "linear-gradient(to right, rgba(168,85,247,0.15), rgba(168,85,247,0.6), rgba(168,85,247,0.15))", zIndex: 0,
            }}/>
          )}
          {[
            { n: "1", icon: <Icon.FileText size={20} color="#fff"/>, title: "Publica gratis", desc: "Describe el servicio que necesitas, tu zona y presupuesto. No te cuesta nada." },
            { n: "2", icon: <Icon.MessageCircle size={20} color="#fff"/>, title: "Recibe ofertas", desc: "Profesionales verificadas te mandan precio y mensaje. Tú decides a quién contratar." },
            { n: "3", icon: <Icon.ThumbsUp size={20} color="#fff"/>, title: "Acepta la mejor", desc: "Elige la oferta que más te convenza. Se desbloquea el contacto directo por WhatsApp." },
            { n: "4", icon: <Icon.Star size={20} color="#fff"/>, title: "Deja tu reseña", desc: "Al terminar, califica el servicio. Así ayudas a otras clientas a elegir bien." },
          ].map((step, i) => (
            <AnimSection key={i} delay={i * 0.1}>
              <div className="step-card" style={{
                position: "relative", zIndex: 1,
                background: "rgba(7,0,15,0.96)", border: "1px solid rgba(168,85,247,0.18)",
                borderRadius: "20px", padding: isMobile ? "22px 18px" : "30px 22px",
                textAlign: isMobile ? "left" : "center",
                display: isMobile ? "flex" : "block", gap: isMobile ? "16px" : 0,
                alignItems: isMobile ? "flex-start" : "center", transition: "all 0.25s ease",
              }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "13px",
                  background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: isMobile ? "0" : "0 auto 18px", flexShrink: 0,
                  boxShadow: "0 6px 24px rgba(139,27,255,0.5)",
                  position: "relative",
                }}>
                  {step.icon}
                  <div style={{
                    position: "absolute", top: "-8px", right: "-8px",
                    width: "20px", height: "20px", borderRadius: "50%",
                    background: "#07000f", border: "2px solid rgba(168,85,247,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", fontWeight: "800", color: "#a855f7", fontFamily: FF,
                  }}>{step.n}</div>
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "700", marginBottom: "8px", color: "#fff", fontFamily: FF }}>{step.title}</div>
                  <div style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.34)", lineHeight: "1.7", fontFamily: FB }}>{step.desc}</div>
                </div>
              </div>
            </AnimSection>
          ))}
        </div>
      </div>

      {/* ══ PARA PROFESIONALES ══ */}
      <div id="profesionales" style={{ padding: isMobile ? "72px 22px" : isTablet ? "80px 36px" : "96px 72px", background: "#07000f" }}>
        <div style={{
          maxWidth: "980px", margin: "0 auto",
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "48px" : "80px", alignItems: "center",
        }}>
          <AnimSection>
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: isMobile ? "center" : "flex-start",
            }}>
              {/* Badge */}
              <div style={{ ...S.sectionBadge, marginBottom: "22px" }}>
                <Icon.Users size={12} color="#c4b5fd"/> Para profesionales
              </div>

              {/* ── TÍTULO EN MAYÚSCULAS igual que la imagen de referencia ── */}
              <h2 style={{
                fontSize: isMobile ? "28px" : "36px",
                fontWeight: "900",
                margin: "0 0 18px",
                letterSpacing: "0px",
                lineHeight: "1.1",
                color: "#fff",
                fontFamily: FI,
                textAlign: isMobile ? "center" : "left",
                textTransform: "uppercase",
              }}>
                Consigue clientes<br/>
                <span style={{
                  background: "linear-gradient(135deg, #c084fc, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  sin salir a buscarlos
                </span>
              </h2>

              <p style={{
                fontSize: "14.5px", color: "rgba(255,255,255,0.38)", lineHeight: "1.75",
                marginBottom: "30px", fontFamily: FI,
                textAlign: isMobile ? "center" : "left",
              }}>
                Crea tu perfil, muestra tu portafolio y recibe solicitudes de clientes en tu zona. Solo pagas cuando un cliente acepta tu oferta.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "34px", width: "100%" }}>
                {[
                  { icon: <Icon.Gift size={18} color="#fff"/>, title: "1 lead gratis para empezar", desc: "Sin tarjeta. Prueba sin riesgo." },
                  { icon: <Icon.DollarSign size={18} color="#fff"/>, title: "$35 MXN por lead desbloqueado", desc: "Solo pagas cuando el cliente te elige." },
                  { icon: <Icon.MapPin size={18} color="#fff"/>, title: "Clientes en tu zona", desc: "Filtra por servicio y colonia en Hermosillo." },
                  { icon: <Icon.Verified size={18} color="#fff"/>, title: "Perfil verificado genera confianza", desc: "Tu INE valida que eres real." },
                ].map((b, i) => (
                  <div key={i} className="benefit-row" style={{
                    display: "flex", gap: "14px", alignItems: "flex-start",
                    background: "rgba(255,255,255,0.025)", border: "1px solid rgba(168,85,247,0.1)",
                    borderRadius: "13px", padding: "15px 18px", transition: "all 0.2s ease",
                  }}>
                    <div style={{ ...S.iconCircle, width: "36px", height: "36px", flexShrink: 0 }}>{b.icon}</div>
                    <div>
                      <div style={{ fontSize: "13.5px", fontWeight: "700", marginBottom: "3px", color: "#fff", fontFamily: FI }}>{b.title}</div>
                      <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.32)", fontFamily: FI }}>{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => goRegister("provider")} className="btn-purple-hover" style={{
                ...S.btnPurple, padding: "14px 28px", fontSize: "14.5px", borderRadius: "12px",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: "8px", fontFamily: FI,
                width: isMobile ? "100%" : "auto",
              }}>
                Registrarme como profesional <Icon.ArrowRight size={15} color="#fff"/>
              </button>
            </div>
          </AnimSection>

          {/* Stats column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { num: "$0", label: "Costo publicar solicitud", sub: "El cliente no paga nada por encontrarte" },
              { num: "$35", label: "Costo por lead para la profesional", sub: "Solo cuando el cliente acepta tu oferta" },
              { num: "1", label: "Lead gratis al registrarte", sub: "Para que pruebes sin arriesgar nada" },
            ].map((stat, i) => (
              <AnimSection key={i} delay={i * 0.1}>
                <div style={{
                  background: "transparent",
                  border: "1px solid rgba(168,85,247,0.2)",
                  borderRadius: "18px", padding: "24px 26px",
                  display: "flex", alignItems: "center", gap: "22px",
                }}>
                  <div style={{
                    fontSize: "44px", fontWeight: "900",
                    color: "#a855f7",
                    lineHeight: 1, minWidth: "72px", letterSpacing: "-2px", fontFamily: FI,
                  }}>{stat.num}</div>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: "700", marginBottom: "5px", color: "#fff", fontFamily: FI }}>{stat.label}</div>
                    <div style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.7)", fontFamily: FI }}>{stat.sub}</div>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </div>

      {/* ══ TESTIMONIOS ══ */}
      <div style={{
        padding: isMobile ? "72px 22px" : isTablet ? "80px 36px" : "88px 72px",
        background: "rgba(7,0,15,0.97)",
        borderTop: "1px solid rgba(168,85,247,0.08)",
      }}>
        <AnimSection>
          <div style={{ textAlign: "center", marginBottom: isMobile ? "44px" : "56px" }}>
            <div style={{ ...S.sectionBadge, margin: "0 auto 18px" }}>
              <Icon.Star size={12} color="#c4b5fd"/> Lo que dicen
            </div>
            <h2 style={{ fontSize: isMobile ? "28px" : "38px", fontWeight: "800", margin: 0, letterSpacing: "-0.5px", color: "#fff", fontFamily: "'Poppins', 'SF Pro Display', 'Inter', system-ui, sans-serif" }}>
              Primeras usuarias en Hermosillo
            </h2>
          </div>
        </AnimSection>

        <div style={{
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
          gap: "16px", maxWidth: "980px", margin: "0 auto",
        }}>
          {[
            { name: "Janet E.", zone: "Villa Satélite", service: "Uñas", text: "Publiqué mi solicitud y en 10 minutos ya tenía 3 ofertas. Elegí la mejor y la chica llegó puntual. Facilísimo.", rating: 5, initial: "J", hue: 270 },
            { name: "Olivia A.", zone: "Perisur", service: "Maquillaje", text: "Me gustó que podía ver el precio antes de decidir. Sin sorpresas, sin regateo. Así debe ser.", rating: 5, initial: "O", hue: 310 },
            { name: "Perla M.", zone: "San Benito", service: "Profesional", text: "Como profesional, el primer lead gratis me ayudó a conseguir mi primera clienta. Ya recuperé lo invertido con creces.", rating: 5, initial: "P", hue: 340 },
          ].map((t, i) => (
            <AnimSection key={i} delay={i * 0.1}>
              <div className="testimonial-card" style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(168,85,247,0.15)",
                borderRadius: "20px", padding: "28px 26px", position: "relative",
                transition: "all 0.25s ease",
              }}>
                <div style={{ position: "absolute", top: "20px", right: "22px" }}>
                  <Icon.Quote size={28}/>
                </div>
                <div style={{ display: "flex", gap: "3px", marginBottom: "16px" }}>
                  {Array(t.rating).fill(0).map((_, j) => <Icon.StarFilled key={j} size={13} color="#f59e0b"/>)}
                </div>
                <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.52)", lineHeight: "1.8", margin: "0 0 22px", fontStyle: "italic", fontFamily: FB }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: `linear-gradient(135deg, hsl(${t.hue},65%,52%), hsl(${t.hue+30},78%,35%))`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", fontWeight: "800", flexShrink: 0, fontFamily: FF,
                  }}>{t.initial}</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff", fontFamily: FF }}>{t.name}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", fontFamily: FB }}>{t.zone} · {t.service}</div>
                  </div>
                </div>
              </div>
            </AnimSection>
          ))}
        </div>
      </div>

      {/* ══ CTA FINAL ══ */}
      <div style={{
        padding: isMobile ? "80px 22px" : "104px 72px", textAlign: "center",
        background: "linear-gradient(180deg, #07000f 0%, rgba(120,20,240,0.06) 50%, #07000f 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", width: "500px", height: "500px",
          borderRadius: "50%", border: "1px solid rgba(168,85,247,0.08)",
          top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }}/>
        <AnimSection>
          <div style={{ maxWidth: "580px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "20px",
              background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <Icon.Lotus size={36} color="#a855f7"/>
            </div>
            <h2 style={{ fontSize: isMobile ? "30px" : "46px", fontWeight: "900", margin: "0 0 16px", letterSpacing: "-1px", color: "#fff", fontFamily: "'Poppins', 'SF Pro Display', 'Inter', system-ui, sans-serif" }}>
              ¿Lista para tu primer<br/>
              <span style={{ background: "linear-gradient(135deg,#c084fc,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                servicio a domicilio?
              </span>
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.36)", lineHeight: "1.75", margin: "0 0 38px", fontFamily: FB }}>
              Publicar es gratis. Sin registro de tarjeta. Sin compromisos.<br/>
              Solo describes lo que necesitas y esperas ofertas.
            </p>
            <div style={{
              display: "flex",
              gap: "14px",
              justifyContent: "center",
              flexWrap: "wrap",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center",
            }}>
              <button onClick={() => goRegister("client")} className="btn-purple-hover" style={{
                ...S.btnPurple, padding: "15px 32px", fontSize: "15px", borderRadius: "13px",
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
                fontFamily: FF, fontWeight: "700",
              }}>
                Quiero un servicio <Icon.ArrowRight size={15} color="#fff"/>
              </button>
              <button onClick={() => goRegister("provider")} className="btn-outline-hover" style={{
                ...S.btnOutline, padding: "15px 28px", fontSize: "14.5px", borderRadius: "13px",
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
                fontFamily: FB,
              }}>
                Soy profesional <Icon.ArrowRight size={14} color="rgba(255,255,255,0.5)"/>
              </button>
            </div>
          </div>
        </AnimSection>
      </div>

      {/* ══ FOOTER ══ */}
      <div style={{
        borderTop: "1px solid rgba(168,85,247,0.1)",
        padding: isMobile ? "22px 22px" : "26px 64px",
        display: "flex",
        alignItems: "center",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: isMobile ? "center" : "space-between",
        textAlign: isMobile ? "center" : "left",
        flexWrap: "wrap", gap: "12px", background: "rgba(7,0,15,0.99)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Icon.Lotus size={22} color="#a855f7"/>
          {/* Footer wordmark también con Inter thin */}
          <span style={{ fontSize: "15px", fontWeight: "300", color: "#fff", fontFamily: FI, letterSpacing: "0.5px" }}>Bellason</span>
          <div style={{ width: "1px", height: "14px", background: "rgba(255,255,255,0.1)", margin: "0 4px" }}/>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Icon.MapPin size={12} color="rgba(168,85,247,0.5)"/>
            <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.18)", fontFamily: FB }}>Hermosillo, Sonora</span>
          </div>
        </div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.16)", fontFamily: FB }}>
          bellason.mx · Todos los derechos reservados
        </div>
      </div>

      {showRoleModal && <RoleModal onSelect={goRegister} onClose={() => setShowRoleModal(false)}/>}
    </div>
  );
}

/* ════════════════════════════════════════
   ROLE MODAL
════════════════════════════════════════ */
function RoleModal({ onSelect, onClose }) {
  const [role, setRole] = useState(null);
  const { isMobile } = useBreakpoint();
  const FF = "'Syne', system-ui, sans-serif";
  const FB = "'DM Sans', system-ui, sans-serif";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(16px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
      animation: "fadeIn 0.2s ease both",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#0c0018", border: "1px solid rgba(168,85,247,0.22)",
        borderRadius: "26px", padding: isMobile ? "30px 22px" : "44px 40px",
        width: "100%", maxWidth: "460px", position: "relative",
        boxShadow: "0 32px 100px rgba(0,0,0,0.8), 0 0 80px rgba(130,20,255,0.1)",
        animation: "scaleIn 0.25s ease both",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "16px", right: "16px",
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.4)", width: "32px", height: "32px",
          borderRadius: "50%", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
        }}>
          <Icon.X size={14}/>
        </button>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "18px" }}>
            <Icon.Lotus size={48} color="#a855f7"/>
          </div>
          <h2 style={{ fontSize: isMobile ? "21px" : "24px", fontWeight: "800", margin: "0 0 8px", letterSpacing: "-0.5px", color: "#fff", fontFamily: FF }}>
            Únete a Bellason
          </h2>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13.5px", margin: 0, fontFamily: FB }}>
            ¿Cómo quieres usar la plataforma?
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px" }}>
          {[
            { key: "client", icon: <Icon.Users size={32} color={role === "client" ? "#a855f7" : "rgba(255,255,255,0.5)"}/>, title: "Soy cliente", desc: "Quiero reservar servicios a domicilio" },
            { key: "provider", icon: <Icon.Sparkles size={32} color={role === "provider" ? "#a855f7" : "rgba(255,255,255,0.5)"}/>, title: "Soy profesional", desc: "Ofrezco servicios y quiero clientes" },
          ].map(({ key, icon, title, desc }) => (
            <button key={key} onClick={() => setRole(key)} style={{
              background: role === key ? "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(124,58,237,0.1))" : "rgba(255,255,255,0.03)",
              border: `1.5px solid ${role === key ? "#a855f7" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "16px", padding: isMobile ? "20px 12px" : "26px 18px",
              cursor: "pointer", color: "#fff", textAlign: "center",
              transition: "all 0.18s ease", position: "relative",
            }}>
              {role === key && (
                <div style={{
                  position: "absolute", top: "10px", right: "10px",
                  width: "18px", height: "18px", borderRadius: "50%",
                  background: "linear-gradient(135deg,#a855f7,#7c3aed)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon.Check size={9} color="#fff"/>
                </div>
              )}
              <div style={{ marginBottom: "10px", display: "flex", justifyContent: "center" }}>{icon}</div>
              <div style={{ fontSize: isMobile ? "13px" : "14px", fontWeight: "700", marginBottom: "5px", color: "#fff", fontFamily: FF }}>{title}</div>
              <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.3)", lineHeight: "1.5", fontFamily: FB }}>{desc}</div>
            </button>
          ))}
        </div>

        {role && (
          <div style={{
            background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.16)",
            borderRadius: "13px", padding: "16px 18px", marginBottom: "16px",
            animation: "fadeUp 0.25s ease both",
          }}>
            <div style={{ fontSize: "11px", color: "#c4b5fd", fontWeight: "600", marginBottom: "10px", letterSpacing: "0.5px", textTransform: "uppercase", fontFamily: FF }}>
              Lo que obtienes
            </div>
            {(role === "provider"
              ? ["1 lead gratis para empezar", "Clientes verificados en tu zona", "Perfil con portafolio y reseñas"]
              : ["Publicar solicitudes es gratis", "Recibe ofertas de varias profesionales", "Elige por precio y calificación"]
            ).map(p => (
              <div key={p} style={{
                fontSize: "12.5px", color: "rgba(255,255,255,0.42)",
                marginBottom: "7px", display: "flex", alignItems: "center", gap: "9px", fontFamily: FB,
              }}>
                <Icon.CheckCircle size={14} color="#a855f7"/> {p}
              </div>
            ))}
          </div>
        )}

        <button disabled={!role} onClick={() => role && onSelect(role)} className={role ? "btn-purple-hover" : ""} style={{
          width: "100%", padding: "14px", borderRadius: "13px", border: "none",
          background: role ? "linear-gradient(135deg, #a855f7, #7c3aed)" : "rgba(255,255,255,0.05)",
          color: role ? "#fff" : "rgba(255,255,255,0.18)",
          fontSize: "15px", fontWeight: "700",
          cursor: role ? "pointer" : "not-allowed",
          boxShadow: role ? "0 8px 32px rgba(139,27,255,0.45)" : "none",
          transition: "all 0.2s", marginBottom: "14px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          fontFamily: FF,
        }}>
          {role
            ? <><span>Continuar como {role === "client" ? "cliente" : "profesional"}</span> <Icon.ArrowRight size={15} color="#fff"/></>
            : "Selecciona tu perfil"
          }
        </button>

        <p style={{ textAlign: "center", fontSize: "12.5px", color: "rgba(255,255,255,0.2)", margin: 0, fontFamily: FB }}>
          ¿Ya tienes cuenta?{" "}
          <a href="/login" style={{ color: "#a855f7", textDecoration: "none", fontWeight: "600" }}>Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}

/* ── Shared styles ── */
const S = {
  btnPurple: {
    background: "linear-gradient(135deg, #a855f7, #7c3aed)",
    border: "none", color: "#fff", padding: "10px 22px", borderRadius: "10px",
    fontSize: "14px", fontWeight: "600", cursor: "pointer",
    boxShadow: "0 4px 20px rgba(139,27,255,0.45)",
    transition: "opacity 0.2s, transform 0.2s",
    fontFamily: "'Syne', system-ui, sans-serif",
  },
  btnOutline: {
    background: "transparent", border: "1.5px solid rgba(255,255,255,0.15)",
    color: "#fff", padding: "9px 20px", borderRadius: "10px",
    fontSize: "14px", cursor: "pointer", transition: "border-color 0.2s, color 0.2s, transform 0.2s",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  floatCard: {
    position: "absolute", zIndex: 3,
    background: "rgba(10,0,24,0.85)", border: "1px solid rgba(168,85,247,0.22)",
    borderRadius: "18px", padding: "16px 18px",
    backdropFilter: "blur(28px)",
    boxShadow: "0 12px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
  },
  iconCircle: {
    width: "32px", height: "32px", borderRadius: "9px",
    background: "linear-gradient(135deg, #a855f7, #7c3aed)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "14px", flexShrink: 0,
  },
  sectionBadge: {
    display: "inline-flex", alignItems: "center", gap: "7px",
    background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.22)",
    borderRadius: "50px", padding: "5px 16px",
    fontSize: "11.5px", color: "#c4b5fd", fontWeight: "600",
    width: "fit-content", fontFamily: "'DM Sans', system-ui, sans-serif",
    letterSpacing: "0.3px",
  },
};
