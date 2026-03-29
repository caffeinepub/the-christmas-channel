import { useSchedule } from "../hooks/useQueries";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatHour(h: bigint): string {
  const n = Number(h);
  if (n === 0) return "12am";
  if (n < 12) return `${n}am`;
  if (n === 12) return "12pm";
  return `${n - 12}pm`;
}

export default function Schedule() {
  const { data: shows = [], isLoading } = useSchedule();

  const byDay: Record<number, typeof shows> = {};
  for (let i = 0; i < 7; i++) byDay[i] = [];
  for (const show of shows) {
    const d = Number(show.dayOfWeek);
    if (d >= 0 && d < 7) byDay[d].push(show);
  }
  for (let i = 0; i < 7; i++) {
    byDay[i].sort((a, b) => Number(a.startHour) - Number(b.startHour));
  }

  const today = new Date().getDay();

  return (
    <section
      className="relative z-10 px-4 py-10 max-w-6xl mx-auto"
      data-ocid="schedule.section"
    >
      <h2
        style={{
          fontFamily: "'Mountains of Christmas', serif",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "#fde68a",
          marginBottom: "1.5rem",
          textAlign: "center",
          textShadow: "0 0 20px rgba(245,200,50,0.4)",
        }}
      >
        📺 This Week's Schedule
      </h2>

      {isLoading ? (
        <div className="text-center py-8" data-ocid="schedule.loading_state">
          <div className="text-4xl mb-2 animate-spin">⭐</div>
          <p style={{ color: "rgba(200,220,200,0.7)" }}>Loading schedule...</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {DAY_NAMES.map((dayName, dayIdx) => {
            const dayShows = byDay[dayIdx];
            const isToday = dayIdx === today;
            return (
              <div
                key={dayName}
                data-ocid={`schedule.item.${dayIdx + 1}`}
                style={{
                  background: isToday
                    ? "linear-gradient(135deg, rgba(25,60,25,0.95), rgba(20,50,20,0.98))"
                    : "linear-gradient(135deg, rgba(18,25,40,0.9), rgba(12,18,30,0.95))",
                  border: isToday
                    ? "2px solid rgba(80,200,80,0.6)"
                    : "1px solid rgba(60,80,120,0.3)",
                  borderRadius: "1rem",
                  padding: "1rem 0.75rem",
                  boxShadow: isToday
                    ? "0 0 20px rgba(50,180,80,0.2)"
                    : "0 2px 12px rgba(0,0,0,0.3)",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "0.75rem",
                    paddingBottom: "0.5rem",
                    borderBottom: isToday
                      ? "1px solid rgba(80,200,80,0.3)"
                      : "1px solid rgba(60,80,120,0.2)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Mountains of Christmas', serif",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: isToday ? "#86efac" : "#93c5fd",
                    }}
                  >
                    {DAY_SHORT[dayIdx]}
                  </span>
                  {isToday && (
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.6rem",
                        color: "#4ade80",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginTop: "2px",
                      }}
                    >
                      TODAY
                    </span>
                  )}
                </div>

                {dayShows.length === 0 ? (
                  <p
                    style={{
                      color: "rgba(150,170,200,0.5)",
                      fontSize: "0.75rem",
                      textAlign: "center",
                      fontStyle: "italic",
                    }}
                    data-ocid="schedule.empty_state"
                  >
                    Holiday music
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {dayShows.map((show) => (
                      <div
                        key={`${show.showName}-${show.startHour}`}
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: "6px",
                          padding: "0.4rem 0.5rem",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.65rem",
                            color: "rgba(253,230,138,0.7)",
                            fontWeight: 600,
                            marginBottom: "2px",
                          }}
                        >
                          {formatHour(show.startHour)}–
                          {formatHour(show.endHour)}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "rgba(230,240,255,0.9)",
                            fontWeight: 600,
                            lineHeight: 1.2,
                          }}
                        >
                          {show.showName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
