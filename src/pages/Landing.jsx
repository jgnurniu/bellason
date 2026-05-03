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
      backgroundColor: "#0d0014",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: "#fff",
      overflowX: "hidden",
    }}>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "14px 18px" : isTablet ? "16px 32px" : "16px 56px",
        borderBottom: "1px solid rgba(168,85,247,0.15)",
        position: "sticky", top: 0, zIndex: 100,
        backgroundColor: "rgba(13,0,20,0.97)",
        backdropFilter: "blur(20px)",
      }}>
        {/* Logo + Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <LotusLogo size={isMobile ? 28 : 34} />
          <span style={{ fontSize: isMobile ? "18px" : "22px", fontWeight: "700", letterSpacing: "-0.3px", color: "#fff" }}>
            Bellason
          </span>
        </div>

        {/* Nav links — desktop */}
        {isDesktop && (
          <div style={{ display: "flex", gap: "36px" }}>
            {[
              { label: "Inicio", href: "#", active: true },
              { label: "Servicios", href: "#servicios" },
              { label: "Cómo funciona", href: "#como-funciona" },
              { label: "Para profesionales", href: "#profesionales" },
              { label: "Precios", href: "#profesionales" },
            ].map((item) => (
              <a key={item.label} href={item.href} style={{
                color: item.active ? "#c084fc" : "rgba(255,255,255,0.58)",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: item.active ? "600" : "400",
                borderBottom: item.active ? "2px solid #c084fc" : "2px solid transparent",
                paddingBottom: "3px",
                transition: "color 0.2s",
              }}>{item.label}</a>
            ))}
          </div>
        )}

        {/* CTA buttons — desktop */}
        {isDesktop ? (
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => navigate("/login")} style={S.btnOutline}>Iniciar sesión</button>
            <button onClick={() => setShowRoleModal(true)} style={S.btnPurple}>Registrarme</button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button onClick={() => setShowRoleModal(true)} style={{ ...S.btnPurple, padding: "7px 13px", fontSize: "13px" }}>
              Registrarme
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff", width: "36px", height: "36px",
              borderRadius: "8px", cursor: "pointer", fontSize: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{menuOpen ? "✕" : "☰"}</button>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      {menuOpen && !isDesktop && (
        <div style={{
          background: "rgba(13,0,20,0.99)",
          borderBottom: "1px solid rgba(168,85,247,0.1)",
          padding: "14px 20px",
          display: "flex", flexDirection: "column",
        }}>
          {["Inicio", "Servicios", "Cómo funciona", "Para profesionales"].map((item, i) => (
            <a key={item} href="#" onClick={() => setMenuOpen(false)} style={{
              color: i === 0 ? "#c084fc" : "rgba(255,255,255,0.7)",
              textDecoration: "none", fontSize: "15px",
              fontWeight: i === 0 ? "600" : "400",
              padding: "12px 0",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>{item}</a>
          ))}
          <button onClick={() => navigate("/login")} style={{ ...S.btnOutline, marginTop: "14px", padding: "11px" }}>
            Iniciar sesión
          </button>
        </div>
      )}

      {/* ══ HERO ══ */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
        minHeight: isDesktop ? "calc(100vh - 69px)" : "auto",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background radial glow */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 60% 80% at 65% 50%, rgba(120,40,220,0.35) 0%, rgba(80,0,160,0.12) 50%, transparent 75%)",
          pointerEvents: "none",
          zIndex: 0,
        }} />

        {/* LEFT — Texto */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: isMobile ? "48px 24px 36px" : isTablet ? "52px 36px" : "64px 56px 64px 64px",
          position: "relative", zIndex: 2,
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(192,132,252,0.1)",
            border: "1px solid rgba(192,132,252,0.3)",
            borderRadius: "50px",
            padding: "6px 16px",
            marginBottom: "28px",
            width: "fit-content",
          }}>
            <LotusLogo size={14} color="#c084fc" />
            <span style={{ fontSize: "12px", color: "#d8b4fe", fontWeight: "500", letterSpacing: "0.3px" }}>
              Belleza a domicilio &nbsp;•&nbsp; Rápida &nbsp;•&nbsp; Confiable
            </span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: isMobile ? "42px" : isTablet ? "54px" : "68px",
            fontWeight: "800",
            lineHeight: "1.03",
            margin: "0 0 20px 0",
            letterSpacing: isMobile ? "-1px" : "-2px",
            color: "#fff",
          }}>
            Reserva servicios<br />
            de <span style={{ color: "#c084fc" }}>belleza</span> en<br />
            <span style={{ color: "#c084fc" }}>minutos</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: isMobile ? "15px" : "17px",
            color: "rgba(255,255,255,0.55)",
            lineHeight: "1.65",
            margin: "0 0 24px 0",
            maxWidth: "440px",
          }}>
            Uñas, maquillaje y cabello a domicilio con profesionales{" "}
            <span style={{ color: "#c084fc", fontWeight: "600" }}>verificadas</span> cerca de ti en Hermosillo.
          </p>

          {/* Bullets */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "28px", flexWrap: "wrap" }}>
            {[
              { icon: "✓", text: "Profesionales verificados con INE" },
              { icon: "✦", text: "Pago seguro y confiable" },
            ].map(b => (
              <div key={b.text} style={{
                display: "flex", alignItems: "center", gap: "7px",
                fontSize: "13px", color: "rgba(255,255,255,0.55)",
              }}>
                <span style={{
                  width: "18px", height: "18px", borderRadius: "50%",
                  background: "rgba(192,132,252,0.15)",
                  border: "1px solid rgba(192,132,252,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", color: "#c084fc", flexShrink: 0,
                }}>{b.icon}</span>
                {b.text}
              </div>
            ))}
          </div>

          {/* Input + CTA */}
          <div style={{
            display: "flex", gap: "10px", marginBottom: "36px",
            flexDirection: isMobile ? "column" : "row",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.13)",
              borderRadius: "12px",
              padding: "13px 18px",
              flex: isMobile ? "none" : 1,
              maxWidth: isMobile ? "100%" : "280px",
            }}>
              <span style={{ fontSize: "16px", opacity: 0.45 }}>📱</span>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Tu número o email"
                style={{
                  background: "transparent", border: "none",
                  outline: "none", color: "#fff",
                  fontSize: "15px", width: "100%",
                }}
              />
            </div>
            <button onClick={() => setShowRoleModal(true)} style={{
              ...S.btnPurple,
              padding: isMobile ? "14px 22px" : "13px 26px",
              fontSize: "15px",
              whiteSpace: "nowrap",
              borderRadius: "12px",
              boxShadow: "0 6px 32px rgba(120,40,220,0.55)",
            }}>
              Encontrar profesional →
            </button>
          </div>

          {/* Social proof */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ display: "flex" }}>
              {[
                { l: "A", h: 270 }, { l: "M", h: 310 },
                { l: "L", h: 340 }, { l: "S", h: 280 }, { k: true },
              ].map((av, i) => (
                av.k ? (
                  <div key="count" style={{
                    width: "36px", height: "36px",
                    borderRadius: "50%",
                    border: "2px solid #0d0014",
                    marginLeft: "-9px",
                    background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "9px", fontWeight: "700", color: "#fff",
                    flexShrink: 0,
                  }}>10K+</div>
                ) : (
                  <div key={av.l} style={{
                    width: "36px", height: "36px",
                    borderRadius: "50%",
                    border: "2px solid #0d0014",
                    marginLeft: i === 0 ? 0 : "-9px",
                    background: `linear-gradient(135deg, hsl(${av.h},65%,52%), hsl(${av.h + 30},78%,38%))`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: "700", color: "#fff",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}>
                    <span>{av.l}</span>
                  </div>
                )
              ))}
            </div>
            <div>
              <div style={{ display: "flex", gap: "2px", marginBottom: "3px" }}>
                {"★★★★★".split("").map((s, i) => (
                  <span key={i} style={{ color: "#f59e0b", fontSize: "13px" }}>{s}</span>
                ))}
              </div>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)" }}>
                10,000+ usuarias ya confían en Bellason
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — Imagen + cards */}
        {!isMobile && (
          <div style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            overflow: "hidden",
            minHeight: isTablet ? "520px" : "auto",
          }}>
            {/* Purple glow behind image */}
            <div style={{
              position: "absolute",
              width: "420px", height: "520px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(120,40,220,0.7) 0%, rgba(80,10,180,0.3) 45%, transparent 70%)",
              bottom: "-40px",
              left: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "none",
              zIndex: 0,
              filter: "blur(8px)",
            }} />

            {/* Ring decoration */}
            <div style={{
              position: "absolute",
              width: "380px", height: "380px",
              borderRadius: "50%",
              border: "1px solid rgba(168,85,247,0.18)",
              bottom: "-20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 0,
            }} />

            {/* Hero image */}
            <img
              src={heroImg}
              alt="Profesional Bellason"
              style={{
                position: "relative", zIndex: 1,
                height: isTablet ? "90%" : "100%",
                maxHeight: isTablet ? "520px" : "780px",
                width: "auto",
                maxWidth: "95%",
                objectFit: "contain",
                objectPosition: "bottom center",
                display: "block",
                filter: "drop-shadow(0 0 40px rgba(120,40,220,0.5))",
              }}
            />

            {/* Gradient left fade */}
            <div style={{
              position: "absolute", top: 0, left: 0,
              width: "80px", height: "100%",
              background: "linear-gradient(to right, #0d0014 0%, transparent 100%)",
              zIndex: 2, pointerEvents: "none",
            }} />
            {/* Gradient bottom fade */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: "60px",
              background: "linear-gradient(to top, #0d0014 0%, transparent 100%)",
              zIndex: 2, pointerEvents: "none",
            }} />

            {/* Floating cards — desktop only */}
            {isDesktop && (
              <>
                {/* Card 1: Profesionales verificados */}
                <div style={{ ...S.floatCard, top: "56px", right: "18px", minWidth: "190px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <div style={S.iconCircle}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "700", lineHeight: "1.3" }}>Profesionales<br />verificados</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "-6px", marginBottom: "6px" }}>
                    {[270, 310, 340].map((h, i) => (
                      <div key={h} style={{
                        width: "24px", height: "24px", borderRadius: "50%",
                        border: "2px solid rgba(13,0,20,0.8)",
                        marginLeft: i === 0 ? 0 : "-7px",
                        background: `linear-gradient(135deg, hsl(${h},65%,52%), hsl(${h + 30},75%,38%))`,
                        fontSize: "9px", fontWeight: "700",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff",
                      }}>
                        {["A", "M", "L"][i]}
                      </div>
                    ))}
                    <span style={{ marginLeft: "6px", fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: "600" }}>+2K</span>
                  </div>
                </div>

                {/* Card 2: Rating */}
                <div style={{ ...S.floatCard, top: "220px", right: "18px", minWidth: "175px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <div style={{ ...S.iconCircle, background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                      <span style={{ fontSize: "13px" }}>★</span>
                    </div>
                    <span style={{ fontSize: "22px", fontWeight: "800", color: "#fff" }}>4.9 / 5</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "9px" }}>
                    Calificación promedio
                  </div>
                  <div style={{ display: "flex", gap: "3px" }}>
                    {"★★★★★".split("").map((s, i) => (
                      <span key={i} style={{ color: "#c084fc", fontSize: "15px" }}>{s}</span>
                    ))}
                  </div>
                </div>

                {/* Card 3: Reservas */}
                <div style={{ ...S.floatCard, top: "390px", right: "18px", minWidth: "175px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                    <div style={S.iconCircle}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <span style={{ fontSize: "20px", fontWeight: "800" }}>20K+</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6" }}>
                    Reservas realizadas<br />este mes
                  </div>
                </div>

                {/* Bellason watermark on image */}
                <div style={{
                  position: "absolute",
                  bottom: "70px",
                  left: "50%",
                  transform: "translateX(-30%)",
                  zIndex: 3,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "5px",
                  opacity: 0.75,
                }}>
                  <LotusLogo size={28} color="#c084fc" />
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: "600", letterSpacing: "1px" }}>Bellason</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Mobile background ghost image */}
        {isMobile && (
          <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
            <img src={heroImg} alt="" style={{
              position: "absolute", right: "-10%", bottom: 0,
              height: "60%", width: "auto",
              objectFit: "contain", opacity: 0.06,
            }} />
          </div>
        )}
      </div>

      {/* ══ FEATURE BAR ══ */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        borderTop: "1px solid rgba(168,85,247,0.12)",
        background: "rgba(13,0,20,0.97)",
      }}>
        {[
          { icon: "🏠", title: "A domicilio", sub: "Vamos hasta ti" },
          { icon: "⚡", title: "Rápido y fácil", sub: "Reserva en minutos" },
          { icon: "💳", title: "Pago seguro", sub: "Solo pagas por lo que usas" },
          { icon: "🛡️", title: "100% confianza", sub: "Profesionales evaluados" },
        ].map((f, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: isMobile ? "16px 14px" : isTablet ? "20px 22px" : "24px 28px",
            borderRight: (isMobile ? i % 2 === 0 : i < 3) ? "1px solid rgba(168,85,247,0.08)" : "none",
            borderBottom: isMobile && i < 2 ? "1px solid rgba(168,85,247,0.08)" : "none",
          }}>
            <div style={{
              width: "38px", height: "38px",
              borderRadius: "10px",
              background: "rgba(192,132,252,0.1)",
              border: "1px solid rgba(192,132,252,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "17px", flexShrink: 0,
            }}>{f.icon}</div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "2px", color: "#fff" }}>{f.title}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{f.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ══ SERVICIOS ══ */}
      <div id="servicios" style={{
        padding: isMobile ? "56px 22px" : isTablet ? "68px 32px" : "84px 64px",
        background: "#0d0014",
      }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? "40px" : "56px" }}>
          <div style={{ ...S.sectionBadge, margin: "0 auto 14px" }}>✦ Servicios disponibles</div>
          <h2 style={{ fontSize: isMobile ? "28px" : "38px", fontWeight: "800", margin: "0 0 10px", letterSpacing: "-0.5px", color: "#fff" }}>
            Todo lo que necesitas,<br />
            <span style={{ color: "#c084fc" }}>en tu casa</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.42)", margin: 0 }}>
            Profesionales especializadas en cada servicio
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "repeat(3, 1fr)" : "repeat(6, 1fr)",
          gap: "14px", maxWidth: "980px", margin: "0 auto",
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
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(192,132,252,0.15)",
                borderRadius: "16px",
                padding: isMobile ? "20px 14px" : "24px 18px",
                textAlign: "center", cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(192,132,252,0.1)";
                e.currentTarget.style.borderColor = "rgba(192,132,252,0.45)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = "rgba(192,132,252,0.15)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: isMobile ? "30px" : "36px", marginBottom: "10px" }}>{s.icon}</div>
              <div style={{ fontSize: isMobile ? "13px" : "14px", fontWeight: "700", marginBottom: "5px", color: "#fff" }}>{s.name}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.32)", lineHeight: "1.5" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ CÓMO FUNCIONA ══ */}
      <div id="como-funciona" style={{
        padding: isMobile ? "56px 22px" : isTablet ? "68px 32px" : "84px 64px",
        background: "rgba(13,0,20,0.9)",
        borderTop: "1px solid rgba(192,132,252,0.08)",
        borderBottom: "1px solid rgba(192,132,252,0.08)",
      }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? "40px" : "56px" }}>
          <div style={{ ...S.sectionBadge, margin: "0 auto 14px" }}>✦ Proceso simple</div>
          <h2 style={{ fontSize: isMobile ? "28px" : "38px", fontWeight: "800", margin: "0 0 10px", letterSpacing: "-0.5px", color: "#fff" }}>
            Cómo funciona
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.42)", margin: 0 }}>
            Gratis publicar. Solo pagas si eliges a alguien.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
          gap: isMobile ? "16px" : "20px",
          maxWidth: "920px", margin: "0 auto", position: "relative",
        }}>
          {!isMobile && (
            <div style={{
              position: "absolute",
              top: "30px", left: "12%", right: "12%", height: "1px",
              background: "linear-gradient(to right, rgba(192,132,252,0.25), rgba(192,132,252,0.6), rgba(192,132,252,0.25))",
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
              background: "rgba(13,0,20,0.95)",
              border: "1px solid rgba(192,132,252,0.2)",
              borderRadius: "18px",
              padding: isMobile ? "20px 18px" : "28px 22px",
              textAlign: isMobile ? "left" : "center",
              display: isMobile ? "flex" : "block",
              gap: isMobile ? "16px" : "0",
              alignItems: isMobile ? "flex-start" : "center",
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "linear-gradient(135deg, #c084fc, #7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "15px", fontWeight: "800", color: "#fff",
                margin: isMobile ? "0" : "0 auto 16px",
                flexShrink: 0,
                boxShadow: "0 4px 18px rgba(120,40,220,0.5)",
              }}>{step.n}</div>
              <div>
                <div style={{ fontSize: "22px", margin: isMobile ? "0 0 7px" : "0 0 10px" }}>{step.icon}</div>
                <div style={{ fontSize: "15px", fontWeight: "700", marginBottom: "7px", color: "#fff" }}>{step.title}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: "1.65" }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ PARA PROFESIONALES ══ */}
      <div id="profesionales" style={{
        padding: isMobile ? "56px 22px" : isTablet ? "68px 32px" : "84px 64px",
        background: "#0d0014",
      }}>
        <div style={{
          maxWidth: "920px", margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "40px" : "64px",
          alignItems: "center",
        }}>
          <div>
            <div style={{ ...S.sectionBadge, marginBottom: "20px" }}>✦ Para profesionales</div>
            <h2 style={{ fontSize: isMobile ? "26px" : "34px", fontWeight: "800", margin: "0 0 14px", letterSpacing: "-0.5px", color: "#fff" }}>
              Consigue clientes<br />
              <span style={{ color: "#c084fc" }}>sin salir a buscarlos</span>
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.48)", lineHeight: "1.7", marginBottom: "26px" }}>
              Crea tu perfil, muestra tu portafolio y recibe solicitudes de clientes en tu zona. Solo pagas cuando un cliente acepta tu oferta.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "30px" }}>
              {[
                { icon: "🎁", title: "1 lead gratis para empezar", desc: "Sin tarjeta. Prueba sin riesgo." },
                { icon: "💰", title: "$35 MXN por lead desbloqueado", desc: "Solo pagas cuando el cliente te elige." },
                { icon: "📍", title: "Clientes en tu zona", desc: "Filtra por servicio y colonia en Hermosillo." },
                { icon: "🛡️", title: "Perfil verificado genera confianza", desc: "Tu INE valida que eres real." },
              ].map((b, i) => (
                <div key={i} style={{
                  display: "flex", gap: "12px", alignItems: "flex-start",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(192,132,252,0.1)",
                  borderRadius: "12px", padding: "14px 16px",
                }}>
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>{b.icon}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "3px", color: "#fff" }}>{b.title}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)" }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => goRegister("provider")} style={{
              ...S.btnPurple, padding: "13px 28px", fontSize: "15px",
              borderRadius: "12px", boxShadow: "0 6px 28px rgba(120,40,220,0.55)",
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
                background: "rgba(192,132,252,0.07)",
                border: "1px solid rgba(192,132,252,0.2)",
                borderRadius: "16px", padding: "22px 24px",
                display: "flex", alignItems: "center", gap: "20px",
              }}>
                <div style={{ fontSize: "38px", fontWeight: "800", color: "#c084fc", lineHeight: 1, minWidth: "64px" }}>
                  {stat.num}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "4px", color: "#fff" }}>{stat.label}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)" }}>{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ TESTIMONIOS ══ */}
      <div style={{
        padding: isMobile ? "56px 22px" : isTablet ? "68px 32px" : "76px 64px",
        background: "rgba(13,0,22,0.8)",
        borderTop: "1px solid rgba(192,132,252,0.08)",
      }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? "36px" : "48px" }}>
          <div style={{ ...S.sectionBadge, margin: "0 auto 14px" }}>✦ Lo que dicen</div>
          <h2 style={{ fontSize: isMobile ? "26px" : "34px", fontWeight: "800", margin: 0, letterSpacing: "-0.5px", color: "#fff" }}>
            Primeras usuarias en Hermosillo
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "16px", maxWidth: "920px", margin: "0 auto",
        }}>
          {[
            { name: "Janet E.", zone: "Villa Satélite", service: "Uñas", text: "Publiqué mi solicitud y en 10 minutos ya tenía 3 ofertas. Elegí la mejor y la chica llegó puntual. Facilísimo.", rating: 5, initial: "J", hue: 270 },
            { name: "Olivia A.", zone: "Perisur", service: "Maquillaje", text: "Me gustó que podía ver el precio antes de decidir. Sin sorpresas, sin regateo. Así debe ser.", rating: 5, initial: "O", hue: 310 },
            { name: "Perla M.", zone: "San Benito", service: "Profesional", text: "Como profesional, el primer lead gratis me ayudó a conseguir mi primera clienta. Ya recuperé lo invertido con creces.", rating: 5, initial: "P", hue: 340 },
          ].map((t, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(192,132,252,0.15)",
              borderRadius: "18px", padding: "24px 22px",
            }}>
              <div style={{ display: "flex", gap: "2px", marginBottom: "14px" }}>
                {Array(t.rating).fill("★").map((s, j) => (
                  <span key={j} style={{ color: "#f59e0b", fontSize: "13px" }}>{s}</span>
                ))}
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.7", margin: "0 0 18px", fontStyle: "italic" }}>
                "{t.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  background: `linear-gradient(135deg, hsl(${t.hue},65%,52%), hsl(${t.hue + 30},78%,38%))`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", fontWeight: "800", flexShrink: 0,
                }}>{t.initial}</div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff" }}>{t.name}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.32)" }}>{t.zone} · {t.service}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ CTA FINAL ══ */}
      <div style={{
        padding: isMobile ? "60px 22px" : "84px 64px",
        textAlign: "center",
        background: "linear-gradient(180deg, #0d0014 0%, rgba(120,40,220,0.08) 50%, #0d0014 100%)",
      }}>
        <div style={{ maxWidth: "580px", margin: "0 auto" }}>
          <div style={{ fontSize: isMobile ? "38px" : "52px", marginBottom: "18px" }}>💅</div>
          <h2 style={{ fontSize: isMobile ? "28px" : "42px", fontWeight: "800", margin: "0 0 14px", letterSpacing: "-0.5px", color: "#fff" }}>
            ¿Lista para tu primer<br />
            <span style={{ color: "#c084fc" }}>servicio a domicilio?</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.42)", lineHeight: "1.7", margin: "0 0 34px" }}>
            Publicar es gratis. Sin registro de tarjeta. Sin compromisos.<br />
            Solo describes lo que necesitas y esperas ofertas.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => goRegister("client")} style={{
              ...S.btnPurple, padding: "14px 32px", fontSize: "16px",
              borderRadius: "12px", boxShadow: "0 8px 36px rgba(120,40,220,0.6)",
            }}>
              Quiero un servicio →
            </button>
            <button onClick={() => goRegister("provider")} style={{
              ...S.btnOutline, padding: "14px 28px", fontSize: "15px", borderRadius: "12px",
            }}>
              Soy profesional
            </button>
          </div>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <div style={{
        borderTop: "1px solid rgba(192,132,252,0.1)",
        padding: isMobile ? "22px 22px" : "26px 64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "12px",
        background: "rgba(13,0,20,0.99)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <LotusLogo size={22} color="#c084fc" />
          <span style={{ fontSize: "15px", fontWeight: "700", color: "#fff" }}>Bellason</span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.22)", marginLeft: "6px" }}>
            Hermosillo, Sonora
          </span>
        </div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.22)" }}>
          bellason.mx · Todos los derechos reservados
        </div>
      </div>

      {showRoleModal && (
        <RoleModal onSelect={goRegister} onClose={() => setShowRoleModal(false)} />
      )}
    </div>
  );
}

function RoleModal({ onSelect, onClose }) {
  const [role, setRole] = useState(null);
  const { isMobile } = useBreakpoint();

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#0f0020",
        border: "1px solid rgba(192,132,252,0.22)",
        borderRadius: "24px",
        padding: isMobile ? "28px 22px" : "40px 36px",
        width: "100%", maxWidth: "440px",
        position: "relative",
        boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "14px", right: "14px",
          background: "rgba(255,255,255,0.06)", border: "none",
          color: "rgba(255,255,255,0.4)", width: "30px", height: "30px",
          borderRadius: "50%", cursor: "pointer", fontSize: "14px",
        }}>✕</button>

        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
            <LotusLogo size={44} color="#c084fc" />
          </div>
          <h2 style={{ fontSize: isMobile ? "20px" : "23px", fontWeight: "800", margin: "0 0 6px", letterSpacing: "-0.4px", color: "#fff" }}>
            Únete a Bellason
          </h2>
          <p style={{ color: "rgba(255,255,255,0.36)", fontSize: "13px", margin: 0 }}>
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
                ? "linear-gradient(135deg, rgba(192,132,252,0.18), rgba(124,58,237,0.1))"
                : "rgba(255,255,255,0.04)",
              border: `2px solid ${role === key ? "#c084fc" : "rgba(255,255,255,0.1)"}`,
              borderRadius: "14px",
              padding: isMobile ? "18px 12px" : "24px 16px",
              cursor: "pointer", color: "#fff", textAlign: "center",
              transition: "all 0.15s", position: "relative",
            }}>
              {role === key && (
                <div style={{
                  position: "absolute", top: "9px", right: "9px",
                  width: "17px", height: "17px", borderRadius: "50%",
                  background: "#c084fc", fontSize: "9px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>✓</div>
              )}
              <div style={{ fontSize: isMobile ? "30px" : "36px", marginBottom: "8px" }}>{icon}</div>
              <div style={{ fontSize: isMobile ? "13px" : "14px", fontWeight: "700", marginBottom: "5px", color: "#fff" }}>{title}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.36)", lineHeight: "1.5" }}>{desc}</div>
            </button>
          ))}
        </div>

        {role && (
          <div style={{
            background: "rgba(192,132,252,0.07)",
            border: "1px solid rgba(192,132,252,0.17)",
            borderRadius: "10px", padding: "12px 16px", marginBottom: "16px",
          }}>
            <div style={{ fontSize: "11px", color: "#d8b4fe", fontWeight: "600", marginBottom: "8px" }}>✦ Lo que obtienes</div>
            {(role === "provider"
              ? ["1 lead gratis para empezar", "Clientes verificados en tu zona", "Perfil con portafolio y reseñas"]
              : ["Publicar solicitudes es gratis", "Recibe ofertas de varias profesionales", "Elige por precio y calificación"]
            ).map(p => (
              <div key={p} style={{
                fontSize: "12px", color: "rgba(255,255,255,0.48)",
                marginBottom: "4px", display: "flex", alignItems: "center", gap: "7px",
              }}>
                <span style={{ color: "#c084fc", flexShrink: 0 }}>✓</span> {p}
              </div>
            ))}
          </div>
        )}

        <button
          disabled={!role}
          onClick={() => role && onSelect(role)}
          style={{
            width: "100%", padding: "13px", borderRadius: "12px", border: "none",
            background: role ? "linear-gradient(135deg, #c084fc, #7c3aed)" : "rgba(255,255,255,0.07)",
            color: role ? "#fff" : "rgba(255,255,255,0.2)",
            fontSize: "15px", fontWeight: "700",
            cursor: role ? "pointer" : "not-allowed",
            boxShadow: role ? "0 6px 24px rgba(120,40,220,0.5)" : "none",
            transition: "all 0.2s", marginBottom: "12px",
          }}>
          {role ? `Continuar como ${role === "client" ? "cliente" : "profesional"} →` : "Selecciona tu perfil"}
        </button>

        <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.26)", margin: 0 }}>
          ¿Ya tienes cuenta?{" "}
          <a href="/login" style={{ color: "#c084fc", textDecoration: "none", fontWeight: "600" }}>Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}

/* ── Lotus Logo SVG (igual al de la imagen) ── */
function LotusLogo({ size = 32, color = "#c084fc" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ display: "block", flexShrink: 0 }}>
      {/* Petal center */}
      <path d="M20 32C20 32 12 26 12 18C12 13.6 15.6 10 20 10C24.4 10 28 13.6 28 18C28 26 20 32 20 32Z" fill={color} opacity="0.85"/>
      {/* Left petal */}
      <path d="M20 20C20 20 10 18 8 12C7 9 9 6 12 6C15 6 20 10 20 20Z" fill={color} opacity="0.6"/>
      {/* Right petal */}
      <path d="M20 20C20 20 30 18 32 12C33 9 31 6 28 6C25 6 20 10 20 20Z" fill={color} opacity="0.6"/>
      {/* Far left petal */}
      <path d="M20 22C20 22 11 22 7 17C5 14 6 11 9 10C12 9 17 13 20 22Z" fill={color} opacity="0.4"/>
      {/* Far right petal */}
      <path d="M20 22C20 22 29 22 33 17C35 14 34 11 31 10C28 9 23 13 20 22Z" fill={color} opacity="0.4"/>
      {/* Center dot */}
      <circle cx="20" cy="19" r="3" fill="#fff" opacity="0.75"/>
    </svg>
  );
}

const S = {
  btnPurple: {
    background: "linear-gradient(135deg, #c084fc, #7c3aed)",
    border: "none", color: "#fff",
    padding: "9px 20px", borderRadius: "8px",
    fontSize: "14px", fontWeight: "600", cursor: "pointer",
    boxShadow: "0 4px 16px rgba(120,40,220,0.45)",
  },
  btnOutline: {
    background: "transparent",
    border: "1.5px solid rgba(255,255,255,0.22)",
    color: "#fff", padding: "8px 18px",
    borderRadius: "8px", fontSize: "14px", cursor: "pointer",
  },
  floatCard: {
    position: "absolute", zIndex: 3,
    background: "rgba(14,0,28,0.88)",
    border: "1px solid rgba(192,132,252,0.22)",
    borderRadius: "16px", padding: "14px 16px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  },
  iconCircle: {
    width: "30px", height: "30px", borderRadius: "50%",
    background: "linear-gradient(135deg, #c084fc, #7c3aed)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", flexShrink: 0, color: "#fff",
  },
  sectionBadge: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    background: "rgba(192,132,252,0.1)",
    border: "1px solid rgba(192,132,252,0.25)",
    borderRadius: "50px", padding: "5px 14px",
    fontSize: "11px", color: "#d8b4fe", fontWeight: "600",
    width: "fit-content",
  },
};
