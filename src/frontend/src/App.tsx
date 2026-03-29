import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AdminPanel from "./components/AdminPanel";
import ChristmasLights from "./components/ChristmasLights";
import Countdown from "./components/Countdown";
import OnAirNow from "./components/OnAirNow";
import Schedule from "./components/Schedule";
import Snowflakes from "./components/Snowflakes";
import WeatherForecast from "./components/WeatherForecast";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";

const listenPlatforms = [
  {
    name: "Live365",
    url: "https://live365.com",
    icon: "📻",
    desc: "Stream on Live365",
    accentColor: "rgba(220,80,60,0.25)",
    borderColor: "rgba(220,100,80,0.45)",
  },
  {
    name: "RadioLine",
    url: "https://www.radioline.co",
    icon: "🎙️",
    desc: "Listen on RadioLine",
    accentColor: "rgba(60,100,220,0.22)",
    borderColor: "rgba(80,130,240,0.45)",
  },
  {
    name: "Online Radio Box",
    url: "https://onlineradiobox.com",
    icon: "📡",
    desc: "OnlineRadioBox",
    accentColor: "rgba(40,160,100,0.2)",
    borderColor: "rgba(70,200,130,0.4)",
  },
  {
    name: "GetMeRadio",
    url: "https://getmeradio.com",
    icon: "🎧",
    desc: "GetMeRadio.com",
    accentColor: "rgba(160,70,200,0.2)",
    borderColor: "rgba(190,100,230,0.4)",
  },
  {
    name: "Our Website",
    url: "#",
    icon: "🌐",
    desc: "christmaschannelradio.com",
    accentColor: "rgba(253,200,50,0.15)",
    borderColor: "rgba(253,230,138,0.45)",
    sameTab: true,
  },
];

export default function App() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const [showAdmin, setShowAdmin] = useState(false);
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  const isLoggedIn = loginStatus === "success" && !!identity;

  if (showAdmin && isAdmin) {
    return (
      <>
        <Toaster />
        <div
          style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 100 }}
        >
          <button
            type="button"
            onClick={() => setShowAdmin(false)}
            data-ocid="nav.back_button"
            style={{
              background: "rgba(15,25,40,0.9)",
              border: "1px solid rgba(80,120,180,0.4)",
              color: "#93c5fd",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ← Back to Station
          </button>
        </div>
        <AdminPanel />
      </>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #050a14 0%, #0a1628 30%, #0d1e3a 60%, #081220 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Toaster />
      <Snowflakes />

      {/* Stars background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.03) 1px, transparent 1px), radial-gradient(circle at 80% 15%, rgba(255,255,255,0.04) 1px, transparent 1px), radial-gradient(circle at 50% 8%, rgba(255,255,255,0.03) 1px, transparent 1px), radial-gradient(circle at 10% 60%, rgba(255,255,255,0.02) 1px, transparent 1px), radial-gradient(circle at 90% 40%, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "300px 200px",
        }}
        aria-hidden="true"
      />

      <header style={{ position: "relative", zIndex: 10 }}>
        <ChristmasLights />
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.75rem 1.5rem",
            background: "rgba(5,10,20,0.8)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(60,80,120,0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🎄</span>
            <span
              style={{
                fontFamily: "'Mountains of Christmas', serif",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#fde68a",
              }}
            >
              The Christmas Channel
            </span>
          </div>
          <div
            style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowAdmin(true)}
                data-ocid="nav.admin_button"
                style={{
                  background: "rgba(20,60,30,0.8)",
                  border: "1px solid rgba(80,180,100,0.4)",
                  color: "#86efac",
                  padding: "0.4rem 1rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                ⚙️ Manage Shows
              </button>
            )}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={clear}
                data-ocid="nav.logout_button"
                style={{
                  background: "rgba(30,15,15,0.8)",
                  border: "1px solid rgba(180,60,60,0.4)",
                  color: "#fca5a5",
                  padding: "0.4rem 1rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={login}
                disabled={loginStatus === "logging-in"}
                data-ocid="nav.login_button"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(180,30,30,0.8), rgba(140,20,20,0.9))",
                  border: "1px solid rgba(220,60,60,0.5)",
                  color: "#fef2f2",
                  padding: "0.4rem 1rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                {loginStatus === "logging-in" ? "Signing in..." : "Sign In"}
              </button>
            )}
          </div>
        </nav>
      </header>

      <main style={{ position: "relative", zIndex: 5 }}>
        {/* Hero */}
        <section
          className="text-center px-4 py-12"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(180,30,30,0.12) 0%, transparent 70%)",
          }}
          data-ocid="hero.section"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1.5rem",
              marginBottom: "1rem",
              fontSize: "2rem",
            }}
          >
            <span className="float-deco" style={{ animationDelay: "0s" }}>
              🔔
            </span>
            <span className="float-deco" style={{ animationDelay: "0.5s" }}>
              ⭐
            </span>
            <span className="float-deco" style={{ animationDelay: "1s" }}>
              🦌
            </span>
            <span className="float-deco" style={{ animationDelay: "1.5s" }}>
              ⭐
            </span>
            <span className="float-deco" style={{ animationDelay: "0.8s" }}>
              🔔
            </span>
          </div>

          <h1
            className="shimmer-text"
            style={{
              fontFamily: "'Mountains of Christmas', serif",
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: "0.75rem",
            }}
          >
            🎄 The Christmas Channel 🎄
          </h1>
          <p
            style={{
              color: "rgba(200,220,200,0.85)",
              fontSize: "1.1rem",
              fontStyle: "italic",
              letterSpacing: "0.05em",
            }}
          >
            Spreading Holiday Joy All Season Long
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "2rem",
              color: "rgba(253,230,138,0.4)",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>🍬</span>
            <div
              style={{
                flex: "0 0 80px",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(253,230,138,0.4))",
              }}
            />
            <span style={{ fontSize: "1.25rem" }}>★</span>
            <div
              style={{
                flex: "0 0 80px",
                height: "1px",
                background:
                  "linear-gradient(90deg, rgba(253,230,138,0.4), transparent)",
              }}
            />
            <span style={{ fontSize: "1.5rem" }}>🍬</span>
          </div>
        </section>

        <OnAirNow />

        {/* Ways to Listen */}
        <section
          data-ocid="listen.section"
          style={{
            padding: "2.5rem 1rem",
            borderTop: "1px solid rgba(253,230,138,0.12)",
            background:
              "linear-gradient(180deg, rgba(5,10,20,0.6) 0%, rgba(8,15,30,0.8) 100%)",
          }}
        >
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "'Mountains of Christmas', serif",
                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                fontWeight: 700,
                color: "#fde68a",
                textAlign: "center",
                marginBottom: "0.4rem",
                letterSpacing: "0.02em",
              }}
            >
              🎧 Ways to Listen
            </h2>
            <p
              style={{
                textAlign: "center",
                color: "rgba(180,210,240,0.65)",
                fontSize: "0.95rem",
                marginBottom: "2rem",
                fontStyle: "italic",
              }}
            >
              Tune in from your favorite platform
            </p>

            {/* Live365 Player Embed */}
            <div
              style={{
                margin: "0 auto 2rem auto",
                maxWidth: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <iframe
                width="450"
                height="316"
                frameBorder="0"
                src="https://live365.com/embeds/v1/player/a76054?s=md&m=dark&c=mp3"
                title="Live365 Player"
                allowFullScreen
                style={{ maxWidth: "100%", display: "block" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              {listenPlatforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target={platform.sameTab ? "_self" : "_blank"}
                  rel={platform.sameTab ? undefined : "noreferrer noopener"}
                  data-ocid={`listen.${platform.name.toLowerCase().replace(/\s+/g, "_")}.link`}
                  onMouseEnter={() => setHoveredPlatform(platform.name)}
                  onMouseLeave={() => setHoveredPlatform(null)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "1.2rem 1.5rem",
                    minWidth: "130px",
                    background:
                      hoveredPlatform === platform.name
                        ? platform.accentColor
                        : "rgba(10,20,40,0.7)",
                    border: `1px solid ${hoveredPlatform === platform.name ? platform.borderColor : "rgba(60,90,140,0.35)"}`,
                    borderRadius: "0.75rem",
                    textDecoration: "none",
                    cursor: "pointer",
                    transition:
                      "background 0.2s ease, border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease",
                    transform:
                      hoveredPlatform === platform.name
                        ? "translateY(-3px) scale(1.03)"
                        : "translateY(0) scale(1)",
                    boxShadow:
                      hoveredPlatform === platform.name
                        ? `0 8px 24px ${platform.accentColor}`
                        : "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  <span style={{ fontSize: "2rem", lineHeight: 1 }}>
                    {platform.icon}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Mountains of Christmas', serif",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color:
                        hoveredPlatform === platform.name
                          ? "#fde68a"
                          : "#93c5fd",
                      transition: "color 0.2s ease",
                      textAlign: "center",
                      lineHeight: 1.2,
                    }}
                  >
                    {platform.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(180,200,230,0.55)",
                      textAlign: "center",
                    }}
                  >
                    {platform.desc}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Recently Played */}
        <section
          data-ocid="recently-played.section"
          style={{
            padding: "2.5rem 1rem",
            borderTop: "1px solid rgba(253,230,138,0.12)",
            background:
              "linear-gradient(180deg, rgba(8,15,30,0.8) 0%, rgba(5,10,20,0.6) 100%)",
          }}
        >
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "'Mountains of Christmas', serif",
                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                fontWeight: 700,
                color: "#fde68a",
                textAlign: "center",
                marginBottom: "0.4rem",
                letterSpacing: "0.02em",
              }}
            >
              🎵 Recently Played
            </h2>
            <p
              style={{
                textAlign: "center",
                color: "rgba(180,210,240,0.65)",
                fontSize: "0.95rem",
                marginBottom: "2rem",
                fontStyle: "italic",
              }}
            >
              The latest tracks we've played on The Christmas Channel
            </p>
            <div
              style={{
                margin: "0 auto",
                maxWidth: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <iframe
                width="450"
                height="511"
                frameBorder="0"
                src="https://live365.com/embeds/v1/played/a76054?s=md&m=dark"
                title="Recently Played"
                style={{ maxWidth: "100%", display: "block" }}
              />
            </div>
          </div>
        </section>

        <div
          style={{
            borderTop: "1px solid rgba(253,230,138,0.1)",
            borderBottom: "1px solid rgba(253,230,138,0.1)",
            background: "rgba(5,10,5,0.4)",
          }}
        >
          <Countdown />
        </div>

        <Schedule />

        <div
          style={{
            borderTop: "1px solid rgba(100,150,220,0.1)",
            background: "rgba(5,10,20,0.4)",
          }}
        >
          <WeatherForecast />
        </div>
      </main>

      <footer
        style={{
          position: "relative",
          zIndex: 5,
          borderTop: "1px solid rgba(60,80,120,0.3)",
          background: "rgba(3,6,12,0.9)",
          padding: "2rem 1rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Mountains of Christmas', serif",
            fontSize: "1.1rem",
            color: "rgba(253,230,138,0.8)",
            marginBottom: "0.75rem",
          }}
        >
          🎄 The Christmas Channel — Spreading Holiday Joy 🎄
        </div>
        <p style={{ fontSize: "0.8rem", color: "rgba(150,170,200,0.55)" }}>
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "rgba(147,197,253,0.7)",
              textDecoration: "underline",
            }}
            data-ocid="footer.link"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
