import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const heroImg = "/hero-professional.png";

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
            {["Inicio", "Servicios", "Cómo funciona", "Para profesionales", "Precios"].map((item, i) => (
              <a key={item} href="#" style={{
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

      {/* Mobile menu */}
      {menuOpen && !isDesktop && (
        <div style={{
          background: "rgba(12,0,22,0.99)",
          borderBottom: "1px solid rgba(168,85,247,0.1)",
          padding: "14px 20px",
          display: "flex", flexDirection: "column",
        }}>
          {["Inicio", "Servicios", "Cómo funciona", "Para profesionales", "Precios"].map((item, i) => (
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

        {/* —— LEFT: texto —— */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: isMobile ? "40px 22px 32px" : isTablet ? "48px 36px" : "60px 64px",
          position: "relative", zIndex: 2,
          background: "transparent",
        }}>
          {/* Badge */}
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
            <span style={{ color: "#a855f7", fontWeight: "600" }}>verificadas</span> cerca de ti.
          </p>

          <div style={{ display: "flex", gap: "18px", marginBottom: "22px", flexWrap: "wrap" }}>
            {[
              { icon: "✓", text: "Profesionales verificados" },
              { icon: "✦", text: "Pago seguro y confiable" },
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

          {/* ✅ Social proof — avatares con iniciales, sin pravatar */}
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
              <div style={{
                width: isMobile ? "28px" : "32px",
                height: isMobile ? "28px" : "32px",
                borderRadius: "50%",
                border: "2px solid #0a0010", marginLeft: "-9px",
                background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "8px", fontWeight: "800", flexShrink: 0,
              }}>10K+</div>
            </div>
            <div>
              <div style={{ display: "flex", gap: "2px", marginBottom: "2px" }}>
                {"★★★★★".split("").map((s, i) => (
                  <span key={i} style={{ color: "#f59e0b", fontSize: isMobile ? "11px" : "13px" }}>{s}</span>
                ))}
              </div>
              <span style={{ fontSize: isMobile ? "10px" : "12px", color: "rgba(255,255,255,0.4)" }}>
                10,000+ usuarias ya confían en Bellason
              </span>
            </div>
          </div>
        </div>

        {/* —— RIGHT —— */}
        {!isMobile && (
          <div style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            background: "transparent",
            minHeight: isTablet ? "480px" : "auto",
          }}>

            {/* Glow morado */}
            <div style={{
              position: "absolute",
              width: isTablet ? "360px" : "500px",
              height: isTablet ? "360px" : "500px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(124,58,237,0.5) 0%, rgba(100,20,200,0.15) 50%, transparent 70%)",
              bottom: "0", left: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "none", zIndex: 0,
            }} />

            {/* Ring */}
            <div style={{
              position: "absolute",
              width: isTablet ? "280px" : "400px",
              height: isTablet ? "280px" : "400px",
              borderRadius: "50%",
              border: "1px solid rgba(168,85,247,0.12)",
              bottom: "10%", left: "50%",
              transform: "translateX(-50%)",
              zIndex: 0,
            }} />

            {/* IMAGEN */}
            <img
              src={heroImg}
              alt="Profesional Bellason"
              style={{
                position: "relative", zIndex: 1,
                height: isTablet ? "400px" : "85%",
                maxHeight: isTablet ? "400px" : "640px",
                width: "auto", maxWidth: "85%",
                objectFit: "contain", objectPosition: "center bottom",
                display: "block",
                filter: "drop-shadow(0 0 30px rgba(124,58,237,0.4)) drop-shadow(0 0 60px rgba(124,58,237,0.2))",
              }}
            />

            {/* Gradiente izquierdo — fusiona con columna texto */}
            <div style={{
              position: "absolute", top: 0, left: 0,
              width: "120px", height: "100%",
              background: "linear-gradient(to right, #0a0010 0%, transparent 100%)",
              zIndex: 2, pointerEvents: "none",
            }} />

            {/* Gradiente inferior — fusiona pies */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: "80px",
              background: "linear-gradient(to top, #0a0010 0%, transparent 100%)",
              zIndex: 2, pointerEvents: "none",
            }} />

            {/* Watermark */}
            <div style={{
              position: "absolute", bottom: "14px", left: "50%",
              transform: "translateX(-50%)", zIndex: 3,
              display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
              opacity: 0.5,
            }}>
              <Logo size={17} />
              <span style={{ fontSize: "9px", fontWeight: "700", color: "rgba(255,255,255,0.6)", letterSpacing: "0.5px" }}>
                Bellason
              </span>
            </div>

            {/* Floating cards — solo desktop */}
            {isDesktop && (
              <>
                {/* Card 1 — verificados */}
                <div style={{ ...S.floatCard, top: "60px", right: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "10px" }}>
                    <div style={S.iconCircle}>👩</div>
                    <span style={{ fontSize: "12px", fontWeight: "700", lineHeight: "1.3" }}>
                      Profesionales<br />verificados
                    </span>
                  </div>
                  {/* ✅ Avatares con iniciales, sin pravatar */}
                  <div style={{ display: "flex" }}>
                    {[
                      { l: "A", h: 270 }, { l: "M", h: 310 }, { l: "L", h: 340 },
                    ].map((av, i) => (
                      <div key={av.l} style={{
                        width: "22px", height: "22px", borderRadius: "50%",
                        border: "1.5px solid rgba(168,85,247,0.4)",
                        marginLeft: i === 0 ? 0 : "-6px",
                        background: `linear-gradient(135deg, hsl(${av.h},70%,55%), hsl(${av.h+30},80%,38%))`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "8px", fontWeight: "700", color: "#fff",
                        flexShrink: 0,
                      }}>{av.l}</div>
                    ))}
                    <div style={{
                      width: "22px", height: "22px", borderRadius: "50%",
                      border: "1.5px solid rgba(168,85,247,0.4)", marginLeft: "-6px",
                      background: "#7c3aed", fontSize: "8px", fontWeight: "800",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>+2K</div>
                  </div>
                </div>

                {/* Card 2 — rating */}
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

                {/* Card 3 — reservas */}
                <div style={{ ...S.floatCard, top: "400px", right: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "8px",
                      background: "rgba(168,85,247,0.18)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
                    }}>📅</div>
                    <span style={{ fontSize: "20px", fontWeight: "800" }}>20K+</span>
                  </div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6" }}>
                    Reservas realizadas<br />este mes
                  </div>
                </div>
              </>
            )}

            <span style={{ position: "absolute", top: "40px", left: "24px", fontSize: "20px", opacity: 0.7, zIndex: 4 }}>✦</span>
            <span style={{ position: "absolute", top: "180px", left: "12px", fontSize: "10px", color: "#a855f7", opacity: 0.5, zIndex: 4 }}>✦</span>
            <span style={{ position: "absolute", top: "90px", right: "185px", fontSize: "8px", color: "#a855f7", opacity: 0.6, zIndex: 4 }}>✦</span>
          </div>
        )}

        {/* Mobile — imagen fantasma */}
        {isMobile && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          }}>
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
          { icon: "💳", title: "Pago seguro", sub: "Solo pagas por lo que usas" },
          { icon: "❤️", title: "100% confianza", sub: "Profesionales evaluados" },
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

      {/* ══ ROLE MODAL ══ */}
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
            <div style={{ fontSize: "11px", color: "#d8b4fe", fontWeight: "600", marginBottom: "8px" }}>
              ✦ Lo que obtienes
            </div>
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
          {role
            ? `Continuar como ${role === "client" ? "cliente" : "profesional"} →`
            : "Selecciona tu perfil"}
        </button>

        <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.28)", margin: 0 }}>
          ¿Ya tienes cuenta?{" "}
          <a href="/login" style={{ color: "#a855f7", textDecoration: "none", fontWeight: "600" }}>
            Inicia sesión
          </a>
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
};