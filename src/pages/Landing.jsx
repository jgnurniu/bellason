import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const heroImg = "/hero-v2.png";

function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    width,
  };
}

/* ── Lotus Logo SVG ── */
function LotusLogo({ size = 32, color = "#a855f7" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ display: "block", flexShrink: 0 }}>
      <path d="M20 32C20 32 12 26 12 18C12 13.6 15.6 10 20 10C24.4 10 28 13.6 28 18C28 26 20 32 20 32Z" fill={color} opacity="0.9"/>
      <path d="M20 20C20 20 10 18 8 12C7 9 9 6 12 6C15 6 20 10 20 20Z" fill={color} opacity="0.65"/>
      <path d="M20 20C20 20 30 18 32 12C33 9 31 6 28 6C25 6 20 10 20 20Z" fill={color} opacity="0.65"/>
      <path d="M20 22C20 22 11 22 7 17C5 14 6 11 9 10C12 9 17 13 20 22Z" fill={color} opacity="0.4"/>
      <path d="M20 22C20 22 29 22 33 17C35 14 34 11 31 10C28 9 23 13 20 22Z" fill={color} opacity="0.4"/>
      <circle cx="20" cy="19" r="2.8" fill="#fff" opacity="0.85"/>
    </svg>
  );
}

/* ── Avatar stack helper ── */
function AvatarStack({ size = 36, colors = ["#7c3aed","#a855f7","#9333ea","#6d28d9"], labels = ["A","M","L","S"], showCount = "10K+" }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {labels.map((l, i) => (
        <div key={l} style={{
          width: size, height: size, borderRadius: "50%",
          border: "2px solid #0d0014",
          marginLeft: i === 0 ? 0 : -size * 0.25,
          background: `linear-gradient(135deg, ${colors[i % colors.length]}, #4c1d95)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: size * 0.33, fontWeight: "700", color: "#fff",
          flexShrink: 0, overflow: "hidden",
          zIndex: labels.length - i,
        }}>{l}</div>
      ))}
      <div style={{
        width: size, height: size, borderRadius: "50%",
        border: "2px solid #0d0014",
        marginLeft: -size * 0.25,
        background: "linear-gradient(135deg, #a855f7, #7c3aed)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.22, fontWeight: "700", color: "#fff",
        flexShrink: 0,
      }}>{showCount}</div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  function goRegister(role) {
    navigate(`/registro?rol=${role}`);
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#080010",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      color: "#fff",
      overflowX: "hidden",
    }}>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "14px 20px" : isTablet ? "16px 32px" : "18px 60px",
        borderBottom: "1px solid rgba(168,85,247,0.2)",
        position: "sticky", top: 0, zIndex: 100,
        backgroundColor: "rgba(8,0,16,0.96)",
        backdropFilter: "blur(24px)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <LotusLogo size={isMobile ? 30 : 36} color="#a855f7" />
          <span style={{ fontSize: isMobile ? "19px" : "23px", fontWeight: "800", letterSpacing: "-0.5px", color: "#fff" }}>
            Bellason
          </span>
        </div>

        {/* Nav links — desktop */}
        {isDesktop && (
          <div style={{ display: "flex", gap: "40px" }}>
            {[
              { label: "Inicio", href: "#", active: true },
              { label: "Servicios", href: "#servicios" },
              { label: "Cómo funciona", href: "#como-funciona" },
              { label: "Para profesionales", href: "#profesionales" },
              { label: "Precios", href: "#profesionales" },
            ].map((item) => (
              <a key={item.label} href={item.href} style={{
                color: item.active ? "#a855f7" : "rgba(255,255,255,0.55)",
                textDecoration: "none",
                fontSize: "14.5px",
                fontWeight: item.active ? "600" : "400",
                borderBottom: item.active ? "2px solid #a855f7" : "2px solid transparent",
                paddingBottom: "3px",
                transition: "color 0.2s",
              }}>{item.label}</a>
            ))}
          </div>
        )}

        {/* CTA — desktop */}
        {isDesktop ? (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button onClick={() => navigate("/login")} style={S.btnOutline}>Iniciar sesión</button>
            <button onClick={() => setShowRoleModal(true)} style={S.btnPurple}>Registrarme</button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button onClick={() => setShowRoleModal(true)} style={{ ...S.btnPurple, padding: "8px 14px", fontSize: "13px" }}>
              Registrarme
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff", width: "38px", height: "38px",
              borderRadius: "9px", cursor: "pointer", fontSize: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{menuOpen ? "✕" : "☰"}</button>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      {menuOpen && !isDesktop && (
        <div style={{
          background: "rgba(8,0,16,0.99)",
          borderBottom: "1px solid rgba(168,85,247,0.12)",
          padding: "14px 20px",
          display: "flex", flexDirection: "column",
        }}>
          {[
            { label: "Inicio", href: "#" },
            { label: "Servicios", href: "#servicios" },
            { label: "Cómo funciona", href: "#como-funciona" },
            { label: "Para profesionales", href: "#profesionales" },
          ].map((item, i) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} style={{
              color: i === 0 ? "#a855f7" : "rgba(255,255,255,0.7)",
              textDecoration: "none", fontSize: "15px",
              fontWeight: i === 0 ? "600" : "400",
              padding: "13px 0",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>{item.label}</a>
          ))}
          <button onClick={() => navigate("/login")} style={{ ...S.btnOutline, marginTop: "14px", padding: "12px" }}>
            Iniciar sesión
          </button>
        </div>
      )}

      {/* ══ HERO ══ */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
        minHeight: isDesktop ? "calc(100vh - 73px)" : "auto",
        position: "relative",
        overflow: "visible",
      }}>
        {/* Deep purple radial glow — matches image background */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: isDesktop
            ? "radial-gradient(ellipse 55% 90% at 68% 55%, rgba(139,27,255,0.75) 0%, rgba(90,0,200,0.4) 35%, rgba(50,0,130,0.15) 60%, transparent 80%)"
            : "radial-gradient(ellipse 80% 60% at 50% 70%, rgba(139,27,255,0.5) 0%, rgba(80,0,180,0.2) 55%, transparent 80%)",
          pointerEvents: "none",
          zIndex: 0,
        }} />

        {/* Subtle star sparkles */}
        {isDesktop && (
          <>
            <div style={{ position: "absolute", top: "80px", right: "38%", width: "22px", height: "22px", zIndex: 1, pointerEvents: "none" }}>
              <StarIcon size={22} color="#fff" opacity={0.9} />
            </div>
            <div style={{ position: "absolute", top: "200px", right: "18%", width: "14px", height: "14px", zIndex: 1, pointerEvents: "none" }}>
              <StarIcon size={14} color="#fff" opacity={0.6} />
            </div>
          </>
        )}

        {/* LEFT — Text */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "flex-start",
          padding: isMobile ? "48px 24px 40px" : isTablet ? "52px 36px" : "60px 40px 60px 64px",
          position: "relative", zIndex: 2,
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(168,85,247,0.12)",
            border: "1px solid rgba(168,85,247,0.35)",
            borderRadius: "50px",
            padding: "7px 18px",
            marginBottom: "30px",
            width: "fit-content",
          }}>
            <LotusLogo size={13} color="#a855f7" />
            <span style={{ fontSize: "12.5px", color: "#c4b5fd", fontWeight: "500", letterSpacing: "0.2px" }}>
              Belleza a domicilio &nbsp;•&nbsp; Rápida &nbsp;•&nbsp; Confiable
            </span>
          </div>

          {/* Heading — matches screenshot exactly */}
          <h1 style={{
            fontSize: isMobile ? "44px" : isTablet ? "56px" : "72px",
            fontWeight: "900",
            lineHeight: "1.02",
            margin: "0 0 22px 0",
            letterSpacing: isMobile ? "-1.5px" : "-2.5px",
            color: "#fff",
          }}>
            Reserva servicios<br />
            de <span style={{ color: "#a855f7" }}>belleza</span> en<br />
            <span style={{ color: "#a855f7" }}>minutos</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: isMobile ? "15px" : "17px",
            color: "rgba(255,255,255,0.52)",
            lineHeight: "1.65",
            margin: "0 0 26px 0",
            maxWidth: "460px",
          }}>
            Uñas, maquillaje y cabello a domicilio con profesionales{" "}
            <span style={{ color: "#a855f7", fontWeight: "600" }}>verificadas</span> cerca de ti en Hermosillo.
          </p>

          {/* Bullets row */}
          <div style={{ display: "flex", gap: "22px", marginBottom: "30px", flexWrap: "wrap" }}>
            {[
              { icon: "✓", text: "Profesionales verificados con INE" },
              { icon: "✦", text: "Pago seguro y confiable" },
            ].map(b => (
              <div key={b.text} style={{
                display: "flex", alignItems: "center", gap: "8px",
                fontSize: "13px", color: "rgba(255,255,255,0.52)",
              }}>
                <span style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: "rgba(168,85,247,0.15)",
                  border: "1px solid rgba(168,85,247,0.45)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", color: "#a855f7", flexShrink: 0,
                }}>{b.icon}</span>
                {b.text}
              </div>
            ))}
          </div>

          {/* Input + CTA — side by side, matches screenshot */}
          <div style={{
            display: "flex", gap: "10px", marginBottom: "38px",
            flexDirection: isMobile ? "column" : "row",
            maxWidth: "560px",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "11px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "13px",
              padding: "14px 18px",
              flex: 1,
              maxWidth: isMobile ? "100%" : "260px",
            }}>
              {/* Phone icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Tu número o email"
                style={{
                  background: "transparent", border: "none",
                  outline: "none", color: "#fff",
                  fontSize: "14.5px", width: "100%",
                  "::placeholder": { color: "rgba(255,255,255,0.3)" },
                }}
              />
            </div>
            <button onClick={() => setShowRoleModal(true)} style={{
              ...S.btnPurple,
              padding: isMobile ? "15px 24px" : "14px 26px",
              fontSize: "15px",
              whiteSpace: "nowrap",
              borderRadius: "13px",
              flex: isMobile ? "none" : "0 0 auto",
            }}>
              Encontrar profesional →
            </button>
          </div>

          {/* Social proof — avatar stack + stars */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <AvatarStack size={38} />
            <div>
              <div style={{ display: "flex", gap: "2px", marginBottom: "4px" }}>
                {"★★★★★".split("").map((s, i) => (
                  <span key={i} style={{ color: "#f59e0b", fontSize: "14px" }}>{s}</span>
                ))}
              </div>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.36)" }}>
                10,000+ usuarias ya confían en Bellason
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — Hero image + floating cards */}
        {!isMobile && (
          <div style={{
            position: "relative",
            overflow: "hidden",
            minHeight: isTablet ? "540px" : "680px",
          }}>
            {/* Main purple glow orb behind model */}
            <div style={{
              position: "absolute",
              width: "600px", height: "700px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(139,27,255,0.9) 0%, rgba(100,10,220,0.55) 35%, rgba(60,0,160,0.2) 60%, transparent 80%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 0,
              filter: "blur(4px)",
            }} />

            {/* Outer ring */}
            <div style={{
              position: "absolute",
              width: "440px", height: "440px",
              borderRadius: "50%",
              border: "1px solid rgba(168,85,247,0.2)",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 0,
            }} />

            {/* Hero image — estilos exactos que funcionan */}
            <img
              src={heroImg}
              alt="Profesional Bellason"
              style={{
                position: "absolute",
                paddingBottom: "180px",
                bottom: 0,
                left: "27%",
                transform: "translateX(-50%)",
                zIndex: 1,
                height: "75%",
                width: "auto",
                maxWidth: "none",
                display: "block",
                filter: "drop-shadow(rgba(139,27,255,0.6) 0px 0px 60px)",
              }}
            />

            {/* Bottom fade */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: "60px",
              background: "linear-gradient(to top, #080010 0%, transparent 100%)",
              zIndex: 2, pointerEvents: "none",
            }} />

            {/* ── Floating cards — desktop only ── */}
            {isDesktop && (
              <>
                {/* Card 1: Profesionales verificados */}
                <div style={{ ...S.floatCard, top: "52px", right: "14px", minWidth: "200px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "11px", marginBottom: "12px" }}>
                    <div style={S.iconCircle}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: "13.5px", fontWeight: "700", lineHeight: "1.3" }}>Profesionales<br />verificados</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {["A","M","L"].map((l, i) => (
                      <div key={l} style={{
                        width: "26px", height: "26px", borderRadius: "50%",
                        border: "2px solid rgba(8,0,16,0.9)",
                        marginLeft: i === 0 ? 0 : "-8px",
                        background: `linear-gradient(135deg, hsl(${270 + i*30},65%,52%), hsl(${290 + i*30},78%,35%))`,
                        fontSize: "9px", fontWeight: "700",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", zIndex: 3 - i,
                      }}>{l}</div>
                    ))}
                    <span style={{ marginLeft: "8px", fontSize: "11.5px", color: "rgba(255,255,255,0.5)", fontWeight: "600" }}>+2K</span>
                  </div>
                </div>

                {/* Card 2: Rating 4.9 */}
                <div style={{ ...S.floatCard, top: "232px", right: "14px", minWidth: "185px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "11px", marginBottom: "7px" }}>
                    <div style={{ ...S.iconCircle, background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                      <span style={{ fontSize: "14px", lineHeight: 1 }}>★</span>
                    </div>
                    <span style={{ fontSize: "24px", fontWeight: "900", color: "#fff", letterSpacing: "-1px" }}>4.9 / 5</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", marginBottom: "10px" }}>
                    Calificación promedio
                  </div>
                  <div style={{ display: "flex", gap: "3px" }}>
                    {"★★★★★".split("").map((s, i) => (
                      <span key={i} style={{ color: "#a855f7", fontSize: "16px" }}>{s}</span>
                    ))}
                  </div>
                </div>

                {/* Card 3: Reservas 20K+ */}
                <div style={{ ...S.floatCard, top: "410px", right: "14px", minWidth: "185px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "11px", marginBottom: "6px" }}>
                    <div style={S.iconCircle}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: "22px", fontWeight: "900", letterSpacing: "-1px" }}>20K+</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", lineHeight: "1.65" }}>
                    Reservas realizadas<br />este mes
                  </div>
                </div>

                {/* Bellason watermark on image */}
                <div style={{
                  position: "absolute",
                  bottom: "85px",
                  left: "50%",
                  transform: "translateX(-25%)",
                  zIndex: 3,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                  opacity: 0.8,
                }}>
                  <LotusLogo size={30} color="#a855f7" />
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontWeight: "700", letterSpacing: "1.5px" }}>Bellason</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Mobile ghost image */}
        {isMobile && (
          <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
            <img src={heroImg} alt="" style={{
              position: "absolute", right: "-8%", bottom: 0,
              height: "55%", width: "auto",
              objectFit: "contain", opacity: 0.07,
            }} />
          </div>
        )}
      </div>

      {/* ══ FEATURE BAR ══ */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        borderTop: "1px solid rgba(168,85,247,0.15)",
        borderBottom: "1px solid rgba(168,85,247,0.15)",
        background: "rgba(8,0,16,0.98)",
      }}>
        {[
          { icon: "🏠", title: "A domicilio", sub: "Vamos hasta ti" },
          { icon: "⚡", title: "Rápido y fácil", sub: "Reserva en minutos" },
          { icon: "💳", title: "Pago seguro", sub: "Solo pagas por lo que usas" },
          { icon: "🛡️", title: "100% confianza", sub: "Profesionales evaluados" },
        ].map((f, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "14px",
            padding: isMobile ? "18px 15px" : isTablet ? "22px 24px" : "26px 30px",
            borderRight: (isMobile ? i % 2 === 0 : i < 3) ? "1px solid rgba(168,85,247,0.1)" : "none",
            borderBottom: isMobile && i < 2 ? "1px solid rgba(168,85,247,0.1)" : "none",
          }}>
            <div style={{
              width: "40px", height: "40px",
              borderRadius: "11px",
              background: "rgba(168,85,247,0.12)",
              border: "1px solid rgba(168,85,247,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", flexShrink: 0,
            }}>{f.icon}</div>
            <div>
              <div style={{ fontSize: "13.5px", fontWeight: "700", marginBottom: "3px", color: "#fff" }}>{f.title}</div>
              <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.32)" }}>{f.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ══ SERVICIOS ══ */}
      <div id="servicios" style={{
        padding: isMobile ? "60px 22px" : isTablet ? "72px 32px" : "88px 72px",
        background: "#080010",
      }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? "44px" : "60px" }}>
          <div style={{ ...S.sectionBadge, margin: "0 auto 16px" }}>✦ Servicios disponibles</div>
          <h2 style={{ fontSize: isMobile ? "30px" : "40px", fontWeight: "800", margin: "0 0 12px", letterSpacing: "-0.5px", color: "#fff" }}>
            Todo lo que necesitas,<br />
            <span style={{ color: "#a855f7" }}>en tu casa</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.38)", margin: 0 }}>
            Profesionales especializadas en cada servicio
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "repeat(3, 1fr)" : "repeat(6, 1fr)",
          gap: "14px", maxWidth: "1000px", margin: "0 auto",
        }}>
          {[
            { icon: "💅", name: "Uñas", sub: "Manicure • Gel • Acrílico" },
            { icon: "💇‍♀️", name: "Cabello", sub: "Corte • Tinte • Tratamiento" },
            { icon: "💄", name: "Maquillaje", sub: "Social • Novia • Artístico" },
            { icon: "👁️", name: "Pestañas", sub: "Extensiones • Lifting" },
            { icon: "🪒", name: "Depilación", sub: "Cera • Hilo • Láser" },
            { icon: "💆‍♀️", name: "Masaje", sub: "Relajante • Deportivo" },
          ].map((s, i) => (
            <div key={i} onClick={() => setShowRoleModal(true)}
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(168,85,247,0.18)",
                borderRadius: "18px",
                padding: isMobile ? "22px 14px" : "26px 18px",
                textAlign: "center", cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(168,85,247,0.1)";
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.18)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: isMobile ? "32px" : "38px", marginBottom: "11px" }}>{s.icon}</div>
              <div style={{ fontSize: isMobile ? "13px" : "14px", fontWeight: "700", marginBottom: "5px", color: "#fff" }}>{s.name}</div>
              <div style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.3)", lineHeight: "1.5" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ CÓMO FUNCIONA ══ */}
      <div id="como-funciona" style={{
        padding: isMobile ? "60px 22px" : isTablet ? "72px 32px" : "88px 72px",
        background: "rgba(8,0,16,0.9)",
        borderTop: "1px solid rgba(168,85,247,0.1)",
        borderBottom: "1px solid rgba(168,85,247,0.1)",
      }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? "44px" : "60px" }}>
          <div style={{ ...S.sectionBadge, margin: "0 auto 16px" }}>✦ Proceso simple</div>
          <h2 style={{ fontSize: isMobile ? "30px" : "40px", fontWeight: "800", margin: "0 0 12px", letterSpacing: "-0.5px", color: "#fff" }}>
            Cómo funciona
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.38)", margin: 0 }}>
            Gratis publicar. Solo pagas si eliges a alguien.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
          gap: isMobile ? "16px" : "20px",
          maxWidth: "960px", margin: "0 auto", position: "relative",
        }}>
          {!isMobile && (
            <div style={{
              position: "absolute",
              top: "32px", left: "12%", right: "12%", height: "1px",
              background: "linear-gradient(to right, rgba(168,85,247,0.2), rgba(168,85,247,0.7), rgba(168,85,247,0.2))",
              zIndex: 0,
            }} />
          )}

          {[
            { n: "1", icon: "📝", title: "Publica gratis", desc: "Describe el servicio que necesitas, tu zona y presupuesto. No te cuesta nada." },
            { n: "2", icon: "💬", title: "Recibe ofertas", desc: "Profesionales verificadas te mandan precio y mensaje. Tú decides a quién contratar." },
            { n: "3", icon: "✅", title: "Acepta la mejor", desc: "Elige la oferta que más te convenza. Se desbloquea el contacto directo por WhatsApp." },
            { n: "4", icon: "⭐", title: "Deja tu reseña", desc: "Al terminar, califica el servicio. Así ayudas a otras clientas a elegir bien." },
          ].map((step, i) => (
            <div key={i} style={{
              position: "relative", zIndex: 1,
              background: "rgba(8,0,16,0.95)",
              border: "1px solid rgba(168,85,247,0.22)",
              borderRadius: "20px",
              padding: isMobile ? "22px 18px" : "30px 22px",
              textAlign: isMobile ? "left" : "center",
              display: isMobile ? "flex" : "block",
              gap: isMobile ? "16px" : "0",
              alignItems: isMobile ? "flex-start" : "center",
            }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "50%",
                background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", fontWeight: "800", color: "#fff",
                margin: isMobile ? "0" : "0 auto 18px",
                flexShrink: 0,
                boxShadow: "0 4px 20px rgba(139,27,255,0.55)",
              }}>{step.n}</div>
              <div>
                <div style={{ fontSize: "24px", margin: isMobile ? "0 0 8px" : "0 0 12px" }}>{step.icon}</div>
                <div style={{ fontSize: "15.5px", fontWeight: "700", marginBottom: "8px", color: "#fff" }}>{step.title}</div>
                <div style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.38)", lineHeight: "1.65" }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ PARA PROFESIONALES ══ */}
      <div id="profesionales" style={{
        padding: isMobile ? "60px 22px" : isTablet ? "72px 32px" : "88px 72px",
        background: "#080010",
      }}>
        <div style={{
          maxWidth: "960px", margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "44px" : "72px",
          alignItems: "center",
        }}>
          <div>
            <div style={{ ...S.sectionBadge, marginBottom: "22px" }}>✦ Para profesionales</div>
            <h2 style={{ fontSize: isMobile ? "28px" : "36px", fontWeight: "800", margin: "0 0 16px", letterSpacing: "-0.5px", color: "#fff" }}>
              Consigue clientes<br />
              <span style={{ color: "#a855f7" }}>sin salir a buscarlos</span>
            </h2>
            <p style={{ fontSize: "14.5px", color: "rgba(255,255,255,0.44)", lineHeight: "1.7", marginBottom: "28px" }}>
              Crea tu perfil, muestra tu portafolio y recibe solicitudes de clientes en tu zona. Solo pagas cuando un cliente acepta tu oferta.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
              {[
                { icon: "🎁", title: "1 lead gratis para empezar", desc: "Sin tarjeta. Prueba sin riesgo." },
                { icon: "💰", title: "$35 MXN por lead desbloqueado", desc: "Solo pagas cuando el cliente te elige." },
                { icon: "📍", title: "Clientes en tu zona", desc: "Filtra por servicio y colonia en Hermosillo." },
                { icon: "🛡️", title: "Perfil verificado genera confianza", desc: "Tu INE valida que eres real." },
              ].map((b, i) => (
                <div key={i} style={{
                  display: "flex", gap: "14px", alignItems: "flex-start",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(168,85,247,0.12)",
                  borderRadius: "13px", padding: "15px 18px",
                }}>
                  <span style={{ fontSize: "20px", flexShrink: 0 }}>{b.icon}</span>
                  <div>
                    <div style={{ fontSize: "13.5px", fontWeight: "700", marginBottom: "3px", color: "#fff" }}>{b.title}</div>
                    <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.36)" }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => goRegister("provider")} style={{
              ...S.btnPurple, padding: "14px 30px", fontSize: "15px",
              borderRadius: "13px",
            }}>
              Registrarme como profesional →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { num: "$0", label: "Costo publicar solicitud para el cliente", sub: "El cliente no paga nada por encontrarte" },
              { num: "$35", label: "Costo por lead para la profesional", sub: "Solo cuando el cliente acepta tu oferta" },
              { num: "1", label: "Lead gratis al registrarte", sub: "Para que pruebes sin arriesgar nada" },
            ].map((stat, i) => (
              <div key={i} style={{
                background: "rgba(168,85,247,0.07)",
                border: "1px solid rgba(168,85,247,0.22)",
                borderRadius: "18px", padding: "24px 26px",
                display: "flex", alignItems: "center", gap: "22px",
              }}>
                <div style={{ fontSize: "42px", fontWeight: "900", color: "#a855f7", lineHeight: 1, minWidth: "70px", letterSpacing: "-2px" }}>
                  {stat.num}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "4px", color: "#fff" }}>{stat.label}</div>
                  <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.36)" }}>{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ TESTIMONIOS ══ */}
      <div style={{
        padding: isMobile ? "60px 22px" : isTablet ? "72px 32px" : "80px 72px",
        background: "rgba(8,0,18,0.85)",
        borderTop: "1px solid rgba(168,85,247,0.1)",
      }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? "40px" : "52px" }}>
          <div style={{ ...S.sectionBadge, margin: "0 auto 16px" }}>✦ Lo que dicen</div>
          <h2 style={{ fontSize: isMobile ? "28px" : "36px", fontWeight: "800", margin: 0, letterSpacing: "-0.5px", color: "#fff" }}>
            Primeras usuarias en Hermosillo
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "16px", maxWidth: "960px", margin: "0 auto",
        }}>
          {[
            { name: "Janet E.", zone: "Villa Satélite", service: "Uñas", text: "Publiqué mi solicitud y en 10 minutos ya tenía 3 ofertas. Elegí la mejor y la chica llegó puntual. Facilísimo.", rating: 5, initial: "J", hue: 270 },
            { name: "Olivia A.", zone: "Perisur", service: "Maquillaje", text: "Me gustó que podía ver el precio antes de decidir. Sin sorpresas, sin regateo. Así debe ser.", rating: 5, initial: "O", hue: 310 },
            { name: "Perla M.", zone: "San Benito", service: "Profesional", text: "Como profesional, el primer lead gratis me ayudó a conseguir mi primera clienta. Ya recuperé lo invertido con creces.", rating: 5, initial: "P", hue: 340 },
          ].map((t, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(168,85,247,0.18)",
              borderRadius: "20px", padding: "26px 24px",
            }}>
              <div style={{ display: "flex", gap: "3px", marginBottom: "15px" }}>
                {Array(t.rating).fill("★").map((s, j) => (
                  <span key={j} style={{ color: "#f59e0b", fontSize: "14px" }}>{s}</span>
                ))}
              </div>
              <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.58)", lineHeight: "1.75", margin: "0 0 20px", fontStyle: "italic" }}>
                "{t.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: `linear-gradient(135deg, hsl(${t.hue},65%,52%), hsl(${t.hue + 30},78%,35%))`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "15px", fontWeight: "800", flexShrink: 0,
                }}>{t.initial}</div>
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#fff" }}>{t.name}</div>
                  <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.3)" }}>{t.zone} · {t.service}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ CTA FINAL ══ */}
      <div style={{
        padding: isMobile ? "64px 22px" : "96px 72px",
        textAlign: "center",
        background: "linear-gradient(180deg, #080010 0%, rgba(139,27,255,0.07) 50%, #080010 100%)",
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ fontSize: isMobile ? "42px" : "56px", marginBottom: "20px" }}>💅</div>
          <h2 style={{ fontSize: isMobile ? "30px" : "46px", fontWeight: "900", margin: "0 0 16px", letterSpacing: "-1px", color: "#fff" }}>
            ¿Lista para tu primer<br />
            <span style={{ color: "#a855f7" }}>servicio a domicilio?</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", lineHeight: "1.7", margin: "0 0 36px" }}>
            Publicar es gratis. Sin registro de tarjeta. Sin compromisos.<br />
            Solo describes lo que necesitas y esperas ofertas.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => goRegister("client")} style={{
              ...S.btnPurple, padding: "15px 34px", fontSize: "16px",
              borderRadius: "13px",
            }}>
              Quiero un servicio →
            </button>
            <button onClick={() => goRegister("provider")} style={{
              ...S.btnOutline, padding: "15px 30px", fontSize: "15.5px", borderRadius: "13px",
            }}>
              Soy profesional
            </button>
          </div>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <div style={{
        borderTop: "1px solid rgba(168,85,247,0.12)",
        padding: isMobile ? "22px 22px" : "28px 72px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "12px",
        background: "rgba(8,0,16,0.99)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <LotusLogo size={24} color="#a855f7" />
          <span style={{ fontSize: "15.5px", fontWeight: "700", color: "#fff" }}>Bellason</span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", marginLeft: "6px" }}>
            Hermosillo, Sonora
          </span>
        </div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
          bellason.mx · Todos los derechos reservados
        </div>
      </div>

      {showRoleModal && (
        <RoleModal onSelect={goRegister} onClose={() => setShowRoleModal(false)} />
      )}
    </div>
  );
}

/* ── Role Modal ── */
function RoleModal({ onSelect, onClose }) {
  const [role, setRole] = useState(null);
  const { isMobile } = useBreakpoint();

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.88)", backdropFilter: "blur(14px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#0f0022",
        border: "1px solid rgba(168,85,247,0.25)",
        borderRadius: "26px",
        padding: isMobile ? "30px 22px" : "44px 38px",
        width: "100%", maxWidth: "460px",
        position: "relative",
        boxShadow: "0 28px 90px rgba(0,0,0,0.75), 0 0 60px rgba(139,27,255,0.12)",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "14px", right: "14px",
          background: "rgba(255,255,255,0.06)", border: "none",
          color: "rgba(255,255,255,0.4)", width: "32px", height: "32px",
          borderRadius: "50%", cursor: "pointer", fontSize: "14px",
        }}>✕</button>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <LotusLogo size={48} color="#a855f7" />
          </div>
          <h2 style={{ fontSize: isMobile ? "21px" : "24px", fontWeight: "800", margin: "0 0 7px", letterSpacing: "-0.5px", color: "#fff" }}>
            Únete a Bellason
          </h2>
          <p style={{ color: "rgba(255,255,255,0.34)", fontSize: "13.5px", margin: 0 }}>
            ¿Cómo quieres usar la plataforma?
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px" }}>
          {[
            { key: "client", icon: "👤", title: "Soy cliente", desc: "Quiero reservar servicios a domicilio" },
            { key: "provider", icon: "💅", title: "Soy profesional", desc: "Ofrezco servicios y quiero clientes" },
          ].map(({ key, icon, title, desc }) => (
            <button key={key} onClick={() => setRole(key)} style={{
              background: role === key
                ? "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(124,58,237,0.12))"
                : "rgba(255,255,255,0.04)",
              border: `2px solid ${role === key ? "#a855f7" : "rgba(255,255,255,0.1)"}`,
              borderRadius: "16px",
              padding: isMobile ? "20px 12px" : "26px 18px",
              cursor: "pointer", color: "#fff", textAlign: "center",
              transition: "all 0.15s", position: "relative",
            }}>
              {role === key && (
                <div style={{
                  position: "absolute", top: "10px", right: "10px",
                  width: "18px", height: "18px", borderRadius: "50%",
                  background: "#a855f7", fontSize: "9px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>✓</div>
              )}
              <div style={{ fontSize: isMobile ? "32px" : "38px", marginBottom: "9px" }}>{icon}</div>
              <div style={{ fontSize: isMobile ? "13px" : "14px", fontWeight: "700", marginBottom: "5px", color: "#fff" }}>{title}</div>
              <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.34)", lineHeight: "1.5" }}>{desc}</div>
            </button>
          ))}
        </div>

        {role && (
          <div style={{
            background: "rgba(168,85,247,0.07)",
            border: "1px solid rgba(168,85,247,0.18)",
            borderRadius: "12px", padding: "14px 18px", marginBottom: "16px",
          }}>
            <div style={{ fontSize: "11.5px", color: "#c4b5fd", fontWeight: "600", marginBottom: "9px" }}>✦ Lo que obtienes</div>
            {(role === "provider"
              ? ["1 lead gratis para empezar", "Clientes verificados en tu zona", "Perfil con portafolio y reseñas"]
              : ["Publicar solicitudes es gratis", "Recibe ofertas de varias profesionales", "Elige por precio y calificación"]
            ).map(p => (
              <div key={p} style={{
                fontSize: "12.5px", color: "rgba(255,255,255,0.46)",
                marginBottom: "5px", display: "flex", alignItems: "center", gap: "8px",
              }}>
                <span style={{ color: "#a855f7", flexShrink: 0 }}>✓</span> {p}
              </div>
            ))}
          </div>
        )}

        <button
          disabled={!role}
          onClick={() => role && onSelect(role)}
          style={{
            width: "100%", padding: "14px", borderRadius: "13px", border: "none",
            background: role ? "linear-gradient(135deg, #a855f7, #7c3aed)" : "rgba(255,255,255,0.07)",
            color: role ? "#fff" : "rgba(255,255,255,0.2)",
            fontSize: "15.5px", fontWeight: "700",
            cursor: role ? "pointer" : "not-allowed",
            boxShadow: role ? "0 6px 28px rgba(139,27,255,0.5)" : "none",
            transition: "all 0.2s", marginBottom: "14px",
          }}>
          {role ? `Continuar como ${role === "client" ? "cliente" : "profesional"} →` : "Selecciona tu perfil"}
        </button>

        <p style={{ textAlign: "center", fontSize: "12.5px", color: "rgba(255,255,255,0.24)", margin: 0 }}>
          ¿Ya tienes cuenta?{" "}
          <a href="/login" style={{ color: "#a855f7", textDecoration: "none", fontWeight: "600" }}>Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}

/* ── Star sparkle icon ── */
function StarIcon({ size = 20, color = "#fff", opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ opacity }}>
      <path d="M12 2L13.5 9H20L14.5 13.5L16.5 20L12 16L7.5 20L9.5 13.5L4 9H10.5L12 2Z"/>
    </svg>
  );
}

/* ── Shared styles ── */
const S = {
  btnPurple: {
    background: "linear-gradient(135deg, #a855f7, #7c3aed)",
    border: "none", color: "#fff",
    padding: "10px 22px", borderRadius: "9px",
    fontSize: "14px", fontWeight: "600", cursor: "pointer",
    boxShadow: "0 4px 20px rgba(139,27,255,0.5)",
    transition: "opacity 0.2s",
  },
  btnOutline: {
    background: "transparent",
    border: "1.5px solid rgba(255,255,255,0.2)",
    color: "#fff", padding: "9px 20px",
    borderRadius: "9px", fontSize: "14px", cursor: "pointer",
    transition: "border-color 0.2s",
  },
  floatCard: {
    position: "absolute", zIndex: 3,
    background: "rgba(10,0,22,0.88)",
    border: "1px solid rgba(168,85,247,0.25)",
    borderRadius: "18px", padding: "16px 18px",
    backdropFilter: "blur(24px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.55)",
  },
  iconCircle: {
    width: "32px", height: "32px", borderRadius: "50%",
    background: "linear-gradient(135deg, #a855f7, #7c3aed)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "14px", flexShrink: 0, color: "#fff",
  },
  sectionBadge: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    background: "rgba(168,85,247,0.1)",
    border: "1px solid rgba(168,85,247,0.28)",
    borderRadius: "50px", padding: "5px 16px",
    fontSize: "11.5px", color: "#c4b5fd", fontWeight: "600",
    width: "fit-content",
  },
};