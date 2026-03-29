import { useCurrentShow } from "../hooks/useQueries";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatHour(h: bigint): string {
  const n = Number(h);
  if (n === 0) return "12:00 AM";
  if (n < 12) return `${n}:00 AM`;
  if (n === 12) return "12:00 PM";
  return `${n - 12}:00 PM`;
}

export default function OnAirNow() {
  const { data: show, isLoading } = useCurrentShow();

  return (
    <section
      className="relative z-10 px-4 py-8 max-w-2xl mx-auto"
      data-ocid="on-air.section"
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(22,40,20,0.92) 0%, rgba(15,30,15,0.95) 100%)",
          border: "2px solid rgba(50,180,80,0.4)",
          borderRadius: "1.25rem",
          padding: "2rem",
          backdropFilter: "blur(10px)",
          boxShadow:
            "0 0 40px rgba(30,160,60,0.15), 0 4px 24px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="live-dot"
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: "#ef4444",
              boxShadow: "0 0 12px rgba(239,68,68,0.9)",
              flexShrink: 0,
            }}
            data-ocid="on-air.loading_state"
          />
          <span
            style={{
              fontFamily: "'Mountains of Christmas', serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#f0fdf4",
              letterSpacing: "0.05em",
            }}
          >
            🎙️ ON AIR NOW
          </span>
          <span
            style={{
              marginLeft: "auto",
              background: "rgba(239,68,68,0.18)",
              border: "1px solid rgba(239,68,68,0.5)",
              color: "#fca5a5",
              padding: "2px 12px",
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            LIVE
          </span>
        </div>

        {isLoading ? (
          <div className="text-center py-8" data-ocid="on-air.loading_state">
            <div className="text-4xl mb-2 animate-bounce">🎄</div>
            <p style={{ color: "rgba(200,220,200,0.7)" }}>Tuning in...</p>
          </div>
        ) : show ? (
          <div data-ocid="on-air.card">
            <h2
              style={{
                fontFamily: "'Mountains of Christmas', serif",
                fontSize: "2rem",
                fontWeight: 700,
                color: "#f0fdf4",
                marginBottom: "0.5rem",
                lineHeight: 1.2,
              }}
            >
              {show.showName}
            </h2>
            <p
              style={{
                color: "#86efac",
                fontWeight: 600,
                fontSize: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              with {show.hostName}
            </p>
            <p
              style={{
                color: "rgba(200,240,210,0.8)",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                marginBottom: "1rem",
              }}
            >
              {show.description}
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background: "rgba(20,80,40,0.6)",
                  border: "1px solid rgba(80,200,100,0.3)",
                  color: "#bbf7d0",
                  padding: "4px 12px",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                }}
              >
                📅 {DAY_NAMES[Number(show.dayOfWeek)]}
              </span>
              <span
                style={{
                  background: "rgba(20,80,40,0.6)",
                  border: "1px solid rgba(80,200,100,0.3)",
                  color: "#bbf7d0",
                  padding: "4px 12px",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                }}
              >
                🕐 {formatHour(show.startHour)} – {formatHour(show.endHour)} CST
              </span>
            </div>
          </div>
        ) : (
          <div data-ocid="on-air.empty_state">
            <h2
              style={{
                fontFamily: "'Mountains of Christmas', serif",
                fontSize: "2rem",
                fontWeight: 700,
                color: "#f0fdf4",
                marginBottom: "0.5rem",
              }}
            >
              🎵 Holiday Music
            </h2>
            <p style={{ color: "#86efac", marginBottom: "0.5rem" }}>
              The Christmas Channel
            </p>
            <p style={{ color: "rgba(200,240,210,0.8)", fontSize: "0.95rem" }}>
              Enjoy a continuous stream of your favorite holiday classics while
              we prepare our next show. Stay tuned for more festive programming!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
