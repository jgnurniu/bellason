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
      backgroundColor: "#0a0010",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: "#fff",
      overflowX: "hidden",
    }}>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "14px 18px" : isTablet ? "16px 32px" : "16px 48px",
        borderBottom: "1px solid rgba(168,85,247,0.13)",
        position: "sticky", top: 0, zIndex: 100,
        backgroundColor: "rgba(10,0,16,0.95)",
        backdropFilter: "blur(16px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <Logo size={isMobile ? 26 : 30} />
          <span style={{ fontSize: isMobile ? "17px" : "20px", fontWeight: "800", letterSpacing: "-0.3px" }}>
            Bellason
          </span>
        </div>

        {isDesktop && (
          <div style={{ display: "flex", gap: "30px" }}>
            {["Inicio", "Servicios", "Cómo funciona", "Para profesionales"].map((item, i) => (
              <a key={item} href={["#", "#servicios", "#como-funciona", "#profesionales"][i]} style={{
                color: i === 0 ? "#a855f7" : "rgba(255,255,255,0.6)",
                textDecoration: "none", fontSize: "14px",
                fontWeight: i === 0 ? "600" : "400",
                borderBottom: i === 0 ? "2px solid #a855f7" : "none",
                paddingBottom: i === 0 ? "2px" : "0",
              }}>{item}</a>
            ))}
          </div>
        )}

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
              color: "#fff", width: "34px", height: "34px",
              borderRadius: "8px", cursor: "pointer", fontSize: "15px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{menuOpen ? "✕" : "☰"}</button>
          </div>
        )}
      </nav>

      {menuOpen && !isDesktop && (
        <div style={{
          background: "rgba(12,0,22,0.99)",
          borderBottom: "1px solid rgba(168,85,247,0.1)",
          padding: "14px 20px",
          display: "flex", flexDirection: "column",
        }}>
          {["Inicio", "Servicios", "Cómo funciona", "Para profesionales"].map((item, i) => (
            <a key={item} href="#" onClick={() => setMenuOpen(false)} style={{
              color: i === 0 ? "#a855f7" : "rgba(255,255,255,0.7)",
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
        minHeight: isDesktop ? "calc(100vh - 65px)" : "auto",
        position: "relative",
        background: "transparent",
      }}>
        {/* LEFT */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: isMobile ? "40px 22px 32px" : isTablet ? "48px 36px" : "60px 64px",
          position: "relative", zIndex: 2,
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(168,85,247,0.12)",
            border: "1px solid rgba(168,85,247,0.3)",
            borderRadius: "50px",
            padding: isMobile ? "6px 14px" : "7px 18px",
            marginBottom: isMobile ? "20px" : "26px",
            width: "fit-content",
          }}>
            <span style={{ fontSize: "12px", color: "#a855f7" }}>✦</span>
            <span style={{ fontSize: isMobile ? "11px" : "12px", color: "#d8b4fe", fontWeight: "500" }}>
              Belleza a domicilio &nbsp;•&nbsp; Rápida &nbsp;•&nbsp; Confiable
            </span>
          </div>

          <h1 style={{
            fontSize: isMobile ? "40px" : isTablet ? "52px" : "68px",
            fontWeight: "800", lineHeight: "1.05",
            margin: "0 0 18px 0",
            letterSpacing: isMobile ? "-1px" : "-2px",
          }}>
            Reserva servicios<br />
            de <span style={{ color: "#a855f7" }}>belleza</span> en<br />
            <span style={{ color: "#a855f7" }}>minutos</span>
          </h1>

          <p style={{
            fontSize: isMobile ? "15px" : "17px",
            color: "rgba(255,255,255,0.58)", lineHeight: "1.65",
            margin: "0 0 22px 0",
            maxWidth: isMobile ? "100%" : "430px",
          }}>
            Uñas, maquillaje y cabello a domicilio con profesionales{" "}
            <span style={{ color: "#a855f7", fontWeight: "600" }}>verificadas</span> cerca de ti en Hermosillo.
          </p>

          <div style={{ display: "flex", gap: "18px", marginBottom: "22px", flexWrap: "wrap" }}>
            {[
              { icon: "✓", text: "Profesionales verificadas con INE" },
              { icon: "✦", text: "Sin costo publicar solicitud" },
            ].map(b => (
              <div key={b.text} style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: isMobile ? "12px" : "13px", color: "rgba(255,255,255,0.5)",
              }}>
                <span style={{ color: "#a855f7" }}>{b.icon}</span>{b.text}
              </div>
            ))}
          </div>

          <div style={{
            display: "flex", gap: "10px", marginBottom: "32px",
            flexDirection: isMobile ? "column" : "row",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "10px",
              padding: isMobile ? "12px 14px" : "13px 18px",
              flex: isMobile ? "none" : 1,
              maxWidth: isMobile ? "100%" : "270px",
            }}>
              <span style={{ opacity: 0.4, fontSize: "16px" }}>📱</span>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Tu número o email"
                style={{
                  background: "transparent", border: "none",
                  outline: "none", color: "#fff",
                  fontSize: isMobile ? "14px" : "15px", width: "100%",
                }}
              />
            </div>
            <button onClick={() => setShowRoleModal(true)} style={{
              ...S.btnPurple,
              padding: isMobile ? "13px 20px" : "13px 24px",
              fontSize: isMobile ? "14px" : "15px",
              whiteSpace: "nowrap", borderRadius: "10px",
              boxShadow: "0 6px 28px rgba(124,58,237,0.5)",
            }}>
              Encontrar profesional →
            </button>
          </div>

          {/* Social proof */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex" }}>
              {[
                { l: "A", h: 270 }, { l: "M", h: 310 },
                { l: "L", h: 340 }, { l: "S", h: 280 },
              ].map((av, i) => (
                <div key={av.l} style={{
                  width: isMobile ? "28px" : "32px",
                  height: isMobile ? "28px" : "32px",
                  borderRadius: "50%",
                  border: "2px solid #0a0010",
                  marginLeft: i === 0 ? 0 : "-9px",
                  background: `linear-gradient(135deg, hsl(${av.h},70%,55%), hsl(${av.h+30},80%,38%))`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: isMobile ? "10px" : "11px", fontWeight: "700", color: "#fff",
                  flexShrink: 0,
                }}>{av.l}</div>
              ))}
            </div>
            <div>
              <div style={{ display: "flex", gap: "2px", marginBottom: "2px" }}>
                {"★★★★★".split("").map((s, i) => (
                  <span key={i} style={{ color: "#f59e0b", fontSize: isMobile ? "11px" : "13px" }}>{s}</span>
                ))}
              </div>
              <span style={{ fontSize: isMobile ? "10px" : "12px", color: "rgba(255,255,255,0.4)" }}>
                Primeras profesionales verificadas en Hermosillo
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT — imagen centrada ── */}
        {!isMobile && (
          <div style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: "60px",      // ← mueve imagen al centro visual
            background: "transparent",
            minHeight: isTablet ? "480px" : "auto",
          }}>
            {/* Glow */}
            <div style={{
              position: "absolute",
              width: isTablet ? "360px" : "500px",
              height: isTablet ? "360px" : "500px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(124,58,237,0.5) 0%, rgba(100,20,200,0.15) 50%, transparent 70%)",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none", zIndex: 0,
            }} />
            {/* Ring */}
            <div style={{
              position: "absolute",
              width: isTablet ? "280px" : "400px",
              height: isTablet ? "280px" : "400px",
              borderRadius: "50%",
              border: "1px solid rgba(168,85,247,0.12)",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 0,
            }} />

            {/* IMAGEN */}
            <img
              src={heroImg}
              alt="Profesional Bellason"
              style={{
                position: "relative", zIndex: 1,
                height: isTablet ? "480px" : "100%",
                maxHeight: isTablet ? "480px" : "760px",
                width: "auto",
                maxWidth: "100%",
                objectFit: "contain",
                objectPosition: "center center",
                display: "block",
                filter: "drop-shadow(0 0 30px rgba(124,58,237,0.4)) drop-shadow(0 0 60px rgba(124,58,237,0.2))",
              }}
            />

            {/* Gradiente izquierdo */}
            <div style={{
              position: "absolute", top: 0, left: 0,
              width: "100px", height: "100%",
              background: "linear-gradient(to right, #0a0010 0%, transparent 100%)",
              zIndex: 2, pointerEvents: "none",
            }} />
            {/* Gradiente inferior */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: "80px",
              background: "linear-gradient(to top, #0a0010 0%, transparent 100%)",
              zIndex: 2, pointerEvents: "none",
            }} />

            {/* Floating cards */}
            {isDesktop && (
              <>
                <div style={{ ...S.floatCard, top: "60px", right: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "10px" }}>
                    <div style={S.iconCircle}>🛡️</div>
                    <span style={{ fontSize: "12px", fontWeight: "700", lineHeight: "1.3" }}>
                      Verificadas<br />con INE
                    </span>
                  </div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>
                    Cada profesional es validada manualmente antes de operar
                  </div>
                </div>

                <div style={{ ...S.floatCard, top: "230px", right: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <div style={S.iconCircle}>⭐</div>
                    <span style={{ fontSize: "20px", fontWeight: "800" }}>4.9 / 5</span>
                  </div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginBottom: "7px" }}>
                    Calificación promedio
                  </div>
                  <div style={{ display: "flex", gap: "3px" }}>
                    {"★★★★★".split("").map((s, i) => (
                      <span key={i} style={{ color: "#a855f7", fontSize: "14px" }}>{s}</span>
                    ))}
                  </div>
                </div>

                <div style={{ ...S.floatCard, top: "400px", right: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(168,85,247,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>💅</div>
                    <span style={{ fontSize: "14px", fontWeight: "800" }}>Sin sorpresas</span>
                  </div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6" }}>
                    Precio acordado antes<br />de que lleguen a tu casa
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {isMobile && (
          <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
            <img src={heroImg} alt="" style={{
              position: "absolute", right: "-5%", bottom: 0,
              height: "65%", width: "auto",
              objectFit: "contain", opacity: 0.07,
            }} />
          </div>
        )}
      </div>

      {/* ══ FEATURE BAR ══ */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        borderTop: "1px solid rgba(168,85,247,0.1)",
        background: "rgba(10,0,18,0.96)",
      }}>
        {[
          { icon: "🏠", title: "A domicilio", sub: "Vamos hasta ti" },
          { icon: "⚡", title: "Rápido y fácil", sub: "Reserva en minutos" },
          { icon: "💳", title: "Sin costo inicial", sub: "Publicar es gratis" },
          { icon: "🛡️", title: "100% verificadas", sub: "Validadas con INE" },
        ].map((f, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "11px",
            padding: isMobile ? "15px 14px" : isTablet ? "18px 22px" : "22px 28px",
            borderRight: (isMobile ? i % 2 === 0 : i < 3) ? "1px solid rgba(168,85,247,0.07)" : "none",
            borderBottom: isMobile && i < 2 ? "1px solid rgba(168,85,247,0.07)" : "none",
          }}>
            <div style={{
              width: isMobile ? "32px" : "36px",
              height: isMobile ? "32px" : "36px",
              borderRadius: "10px",
              background: "rgba(168,85,247,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: isMobile ? "15px" : "17px", flexShrink: 0,
            }}>{f.icon}</div>
            <div>
              <div style={{ fontSize: isMobile ? "12px" : "13px", fontWeight: "700", marginBottom: "2px" }}>{f.title}</div>
              <div style={{ fontSize: isMobile ? "10px" : "11px", color: "rgba(255,255,255,0.38)" }}>{f.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ══ SERVICIOS ══ */}
      <div id="servicios" style={{
        padding: isMobile ? "52px 22px" : isTablet ? "64px 32px" : "80px 64px",
        background: "#0a0010",
      }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? "36px" : "52px" }}>
          <div style={{ ...S.sectionBadge, margin: "0 auto 14px" }}>✦ Servicios disponibles</div>
          <h2 style={{ fontSize: isMobile ? "28px" : "38px", fontWeight: "800", margin: "0 0 10px", letterSpacing: "-0.5px" }}>
            Todo lo que necesitas,<br />
            <span style={{ color: "#a855f7" }}>en tu casa</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", margin: 0 }}>
            Profesionales especializadas en cada servicio
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "repeat(3, 1fr)" : "repeat(6, 1fr)",
          gap: "14px", maxWidth: "960px", margin: "0 auto",
        }}>
          {[
            { icon: "💅", name: "Uñas", sub: "Manicure • Gel • Acrílico" },
            { icon: "💇‍♀️", name: "Cabello", sub: "Corte • Tinte • Tratamiento" },
            { icon: "💄", name: "Maquillaje", sub: "Social • Novia • Artístico" },
            { icon: "👁️", name: "Pestañas", sub: "Extensiones • Lifting" },
            { icon: "🪒", name: "Depilación", sub: "Cera • Hilo • Láser" },
            { icon: "💆‍♀️", name: "Masaje", sub: "Relajante • Deportivo" },
          ].map((s, i) => (
            <div key={i} onClick={() => setShowRoleModal(true)} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(168,85,247,0.15)",
              borderRadius: "16px",
              padding: isMobile ? "18px 14px" : "22px 18px",
              textAlign: "center", cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(168,85,247,0.1)";
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.15)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: isMobile ? "28px" : "34px", marginBottom: "10px" }}>{s.icon}</div>
              <div style={{ fontSize: isMobile ? "13px" : "14px", fontWeight: "700", marginBottom: "5px" }}>{s.name}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", lineHeight: "1.5" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ CÓMO FUNCIONA ══ */}
      <div id="como-funciona" style={{
        padding: isMobile ? "52px 22px" : isTablet ? "64px 32px" : "80px 64px",
        background: "rgba(12,0,20,0.8)",
        borderTop: "1px solid rgba(168,85,247,0.08)",
        borderBottom: "1px solid rgba(168,85,247,0.08)",
      }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? "36px" : "52px" }}>
          <div style={{ ...S.sectionBadge, margin: "0 auto 14px" }}>✦ Proceso simple</div>
          <h2 style={{ fontSize: isMobile ? "28px" : "38px", fontWeight: "800", margin: "0 0 10px", letterSpacing: "-0.5px" }}>
            Cómo funciona
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", margin: 0 }}>
            Gratis publicar. Solo pagas si eliges a alguien.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
          gap: isMobile ? "16px" : "20px",
          maxWidth: "900px", margin: "0 auto", position: "relative",
        }}>
          {!isMobile && (
            <div style={{
              position: "absolute",
              top: "32px", left: "12%", right: "12%", height: "1px",
              background: "linear-gradient(to right, rgba(168,85,247,0.3), rgba(168,85,247,0.6), rgba(168,85,247,0.3))",
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
              background: "rgba(10,0,16,0.9)",
              border: "1px solid rgba(168,85,247,0.2)",
              borderRadius: "18px",
              padding: isMobile ? "20px 18px" : "26px 20px",
              textAlign: isMobile ? "left" : "center",
              display: isMobile ? "flex" : "block",
              gap: isMobile ? "16px" : "0",
              alignItems: isMobile ? "flex-start" : "center",
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "15px", fontWeight: "800",
                margin: isMobile ? "0" : "0 auto 14px",
                flexShrink: 0,
                boxShadow: "0 4px 16px rgba(124,58,237,0.5)",
              }}>{step.n}</div>
              <div>
                <div style={{ fontSize: "22px", margin: isMobile ? "0 0 6px" : "0 0 10px" }}>{step.icon}</div>
                <div style={{ fontSize: "15px", fontWeight: "700", marginBottom: "7px" }}>{step.title}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.42)", lineHeight: "1.6" }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ PARA PROFESIONALES ══ */}
      <div id="profesionales" style={{
        padding: isMobile ? "52px 22px" : isTablet ? "64px 32px" : "80px 64px",
        background: "#0a0010",
      }}>
        <div style={{
          maxWidth: "900px", margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "36px" : "60px",
          alignItems: "center",
        }}>
          <div>
            <div style={{ ...S.sectionBadge, marginBottom: "18px" }}>✦ Para profesionales</div>
            <h2 style={{ fontSize: isMobile ? "26px" : "34px", fontWeight: "800", margin: "0 0 14px", letterSpacing: "-0.5px" }}>
              Consigue clientes<br />
              <span style={{ color: "#a855f7" }}>sin salir a buscarlos</span>
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.7", marginBottom: "24px" }}>
              Crea tu perfil, muestra tu portafolio y recibe solicitudes de clientes en tu zona. Solo pagas cuando un cliente acepta tu oferta.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
              {[
                { icon: "🎁", title: "1 lead gratis para empezar", desc: "Sin tarjeta. Prueba sin riesgo." },
                { icon: "💰", title: "$35 MXN por lead desbloqueado", desc: "Solo pagas cuando el cliente te elige." },
                { icon: "📍", title: "Clientes en tu zona", desc: "Filtra por servicio y colonia en Hermosillo." },
                { icon: "🛡️", title: "Perfil verificado genera confianza", desc: "Tu INE valida que eres real. Eso te diferencia." },
              ].map((b, i) => (
                <div key={i} style={{
                  display: "flex", gap: "12px", alignItems: "flex-start",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(168,85,247,0.1)",
                  borderRadius: "12px", padding: "14px 16px",
                }}>
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>{b.icon}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "3px" }}>{b.title}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => goRegister("provider")} style={{
              ...S.btnPurple, padding: "13px 28px", fontSize: "15px",
              borderRadius: "10px", boxShadow: "0 6px 24px rgba(124,58,237,0.5)",
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
                border: "1px solid rgba(168,85,247,0.2)",
                borderRadius: "16px", padding: "22px 24px",
                display: "flex", alignItems: "center", gap: "20px",
              }}>
                <div style={{ fontSize: "36px", fontWeight: "800", color: "#a855f7", lineHeight: 1, minWidth: "60px" }}>
                  {stat.num}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "4px" }}>{stat.label}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ TESTIMONIOS ══ */}
      <div style={{
        padding: isMobile ? "52px 22px" : isTablet ? "64px 32px" : "72px 64px",
        background: "rgba(12,0,20,0.7)",
        borderTop: "1px solid rgba(168,85,247,0.08)",
      }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? "32px" : "44px" }}>
          <div style={{ ...S.sectionBadge, margin: "0 auto 14px" }}>✦ Lo que dicen</div>
          <h2 style={{ fontSize: isMobile ? "26px" : "34px", fontWeight: "800", margin: 0, letterSpacing: "-0.5px" }}>
            Primeras usuarias en Hermosillo
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "16px", maxWidth: "900px", margin: "0 auto",
        }}>
          {[
            { name: "Janet E.", zone: "Villa Satélite", service: "Uñas", text: "Publiqué mi solicitud y en 10 minutos ya tenía 3 ofertas. Elegí la mejor y la chica llegó puntual. Facilísimo.", rating: 5, initial: "J", hue: 270 },
            { name: "Olivia A.", zone: "Perisur", service: "Maquillaje", text: "Me gustó que podía ver el precio antes de decidir. Sin sorpresas, sin regateo. Así debe ser.", rating: 5, initial: "O", hue: 310 },
            { name: "Perla M.", zone: "San Benito", service: "Profesional", text: "Como profesional, el primer lead gratis me ayudó a conseguir mi primera clienta. Ya recuperé lo invertido con creces.", rating: 5, initial: "P", hue: 340 },
          ].map((t, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(168,85,247,0.15)",
              borderRadius: "18px", padding: "22px 20px",
            }}>
              <div style={{ display: "flex", gap: "2px", marginBottom: "14px" }}>
                {Array(t.rating).fill("★").map((s, j) => (
                  <span key={j} style={{ color: "#f59e0b", fontSize: "13px" }}>{s}</span>
                ))}
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: "1.7", margin: "0 0 18px", fontStyle: "italic" }}>
                "{t.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: `linear-gradient(135deg, hsl(${t.hue},70%,55%), hsl(${t.hue+30},80%,38%))`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", fontWeight: "800", flexShrink: 0,
                }}>{t.initial}</div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700" }}>{t.name}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{t.zone} · {t.service}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ CTA FINAL ══ */}
      <div style={{
        padding: isMobile ? "56px 22px" : "80px 64px",
        textAlign: "center",
        background: "linear-gradient(180deg, #0a0010 0%, rgba(124,58,237,0.08) 50%, #0a0010 100%)",
      }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <div style={{ fontSize: isMobile ? "36px" : "48px", marginBottom: "16px" }}>💅</div>
          <h2 style={{ fontSize: isMobile ? "28px" : "40px", fontWeight: "800", margin: "0 0 14px", letterSpacing: "-0.5px" }}>
            ¿Lista para tu primer<br />
            <span style={{ color: "#a855f7" }}>servicio a domicilio?</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: "1.7", margin: "0 0 32px" }}>
            Publicar es gratis. Sin registro de tarjeta. Sin compromisos.<br />
            Solo describes lo que necesitas y esperas ofertas.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => goRegister("client")} style={{
              ...S.btnPurple, padding: "14px 32px", fontSize: "16px",
              borderRadius: "12px", boxShadow: "0 8px 32px rgba(124,58,237,0.55)",
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
        borderTop: "1px solid rgba(168,85,247,0.1)",
        padding: isMobile ? "22px 22px" : "24px 64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "12px",
        background: "rgba(10,0,16,0.98)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Logo size={20} />
          <span style={{ fontSize: "14px", fontWeight: "700" }}>Bellason</span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", marginLeft: "6px" }}>
            Hermosillo, Sonora
          </span>
        </div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
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
      background: "rgba(0,0,0,0.82)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#10001e",
        border: "1px solid rgba(168,85,247,0.22)",
        borderRadius: "22px",
        padding: isMobile ? "26px 20px" : "38px 34px",
        width: "100%", maxWidth: "430px",
        position: "relative",
        boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "14px", right: "14px",
          background: "rgba(255,255,255,0.06)", border: "none",
          color: "rgba(255,255,255,0.4)", width: "28px", height: "28px",
          borderRadius: "50%", cursor: "pointer", fontSize: "14px",
        }}>✕</button>

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <Logo size={40} />
          </div>
          <h2 style={{ fontSize: isMobile ? "20px" : "22px", fontWeight: "800", margin: "0 0 6px", letterSpacing: "-0.4px" }}>
            Únete a Bellason
          </h2>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "13px", margin: 0 }}>
            ¿Cómo quieres usar la plataforma?
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px" }}>
          {[
            { key: "client",   icon: "👤", title: "Soy cliente",     desc: "Quiero reservar servicios a domicilio" },
            { key: "provider", icon: "💅", title: "Soy profesional", desc: "Ofrezco servicios y quiero clientes" },
          ].map(({ key, icon, title, desc }) => (
            <button key={key} onClick={() => setRole(key)} style={{
              background: role === key
                ? "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(124,58,237,0.1))"
                : "rgba(255,255,255,0.04)",
              border: `2px solid ${role === key ? "#a855f7" : "rgba(255,255,255,0.1)"}`,
              borderRadius: "14px",
              padding: isMobile ? "18px 12px" : "24px 16px",
              cursor: "pointer", color: "#fff", textAlign: "center",
              transition: "all 0.15s", position: "relative",
            }}>
              {role === key && (
                <div style={{
                  position: "absolute", top: "9px", right: "9px",
                  width: "16px", height: "16px", borderRadius: "50%",
                  background: "#a855f7", fontSize: "9px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>✓</div>
              )}
              <div style={{ fontSize: isMobile ? "30px" : "36px", marginBottom: "8px" }}>{icon}</div>
              <div style={{ fontSize: isMobile ? "13px" : "14px", fontWeight: "700", marginBottom: "5px" }}>{title}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", lineHeight: "1.5" }}>{desc}</div>
            </button>
          ))}
        </div>

        {role && (
          <div style={{
            background: "rgba(168,85,247,0.07)",
            border: "1px solid rgba(168,85,247,0.17)",
            borderRadius: "10px", padding: "12px 14px", marginBottom: "16px",
          }}>
            <div style={{ fontSize: "11px", color: "#d8b4fe", fontWeight: "600", marginBottom: "8px" }}>✦ Lo que obtienes</div>
            {(role === "provider"
              ? ["1 lead gratis para empezar", "Clientes verificados en tu zona", "Perfil con portafolio y reseñas"]
              : ["Publicar solicitudes es gratis", "Recibe ofertas de varias profesionales", "Elige por precio y calificación"]
            ).map(p => (
              <div key={p} style={{
                fontSize: "12px", color: "rgba(255,255,255,0.5)",
                marginBottom: "4px", display: "flex", alignItems: "center", gap: "7px",
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
            width: "100%", padding: "13px", borderRadius: "10px", border: "none",
            background: role ? "linear-gradient(135deg, #a855f7, #7c3aed)" : "rgba(255,255,255,0.07)",
            color: role ? "#fff" : "rgba(255,255,255,0.22)",
            fontSize: "15px", fontWeight: "700",
            cursor: role ? "pointer" : "not-allowed",
            boxShadow: role ? "0 6px 22px rgba(124,58,237,0.45)" : "none",
            transition: "all 0.2s", marginBottom: "12px",
          }}>
          {role ? `Continuar como ${role === "client" ? "cliente" : "profesional"} →` : "Selecciona tu perfil"}
        </button>

        <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.28)", margin: 0 }}>
          ¿Ya tienes cuenta?{" "}
          <a href="/login" style={{ color: "#a855f7", textDecoration: "none", fontWeight: "600" }}>Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}

function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: "block" }}>
      <path d="M16 3C16 3 8 10 8 17C8 21.4 11.6 25 16 25C20.4 25 24 21.4 24 17C24 10 16 3 16 3Z" fill="#a855f7" opacity="0.9"/>
      <path d="M16 8C16 8 11 13 11 17C11 19.8 13.2 22 16 22C18.8 22 21 19.8 21 17C21 13 16 8 16 8Z" fill="#7c3aed"/>
      <path d="M16 13C16 13 14 15 14 17C14 18.1 14.9 19 16 19C17.1 19 18 18.1 18 17C18 15 16 13 16 13Z" fill="#fff" opacity="0.8"/>
    </svg>
  );
}

const S = {
  btnPurple: {
    background: "linear-gradient(135deg, #a855f7, #7c3aed)",
    border: "none", color: "#fff",
    padding: "9px 20px", borderRadius: "8px",
    fontSize: "14px", fontWeight: "600", cursor: "pointer",
    boxShadow: "0 4px 14px rgba(124,58,237,0.4)",
  },
  btnOutline: {
    background: "transparent",
    border: "1.5px solid rgba(255,255,255,0.2)",
    color: "#fff", padding: "8px 18px",
    borderRadius: "8px", fontSize: "14px", cursor: "pointer",
  },
  floatCard: {
    position: "absolute", zIndex: 3,
    background: "rgba(12,0,24,0.88)",
    border: "1px solid rgba(168,85,247,0.22)",
    borderRadius: "16px", padding: "14px 16px",
    backdropFilter: "blur(20px)", minWidth: "168px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  },
  iconCircle: {
    width: "28px", height: "28px", borderRadius: "50%",
    background: "linear-gradient(135deg, #a855f7, #7c3aed)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", flexShrink: 0,
  },
  sectionBadge: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    background: "rgba(168,85,247,0.1)",
    border: "1px solid rgba(168,85,247,0.25)",
    borderRadius: "50px", padding: "5px 14px",
    fontSize: "11px", color: "#d8b4fe", fontWeight: "600",
    width: "fit-content",
  },
};
