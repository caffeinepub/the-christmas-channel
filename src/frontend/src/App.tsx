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

export default function App() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const [showAdmin, setShowAdmin] = useState(false);

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
