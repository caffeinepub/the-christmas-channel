import { useEffect, useState } from "react";

const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function weatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦️";
  return "⛈️";
}

function weatherDesc(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly Cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  return "Thunderstorm";
}

interface DayForecast {
  date: string;
  dayName: string;
  high: number;
  low: number;
  code: number;
}

export default function WeatherForecast() {
  const [forecast, setForecast] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=46.7867&longitude=-92.1005&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=fahrenheit&timezone=America%2FChicago&forecast_days=7",
    )
      .then((r) => r.json())
      .then((data) => {
        const days: DayForecast[] = data.daily.time.map(
          (dateStr: string, i: number) => {
            const d = new Date(`${dateStr}T12:00:00`);
            return {
              date: dateStr,
              dayName: DAY_SHORT[d.getDay()],
              high: Math.round(data.daily.temperature_2m_max[i]),
              low: Math.round(data.daily.temperature_2m_min[i]),
              code: data.daily.weathercode[i],
            };
          },
        );
        setForecast(days);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <section
      className="relative z-10 px-4 py-10 max-w-4xl mx-auto"
      data-ocid="weather.section"
    >
      <h2
        style={{
          fontFamily: "'Mountains of Christmas', serif",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "#93c5fd",
          marginBottom: "0.25rem",
          textAlign: "center",
          textShadow: "0 0 20px rgba(147,197,253,0.4)",
        }}
      >
        🌨️ Duluth, MN Weather
      </h2>
      <p
        style={{
          textAlign: "center",
          color: "rgba(147,197,253,0.65)",
          fontSize: "0.85rem",
          marginBottom: "1.5rem",
        }}
      >
        7-Day Forecast
      </p>

      {loading && (
        <div className="text-center py-6" data-ocid="weather.loading_state">
          <div className="text-3xl animate-pulse">🌨️</div>
          <p style={{ color: "rgba(150,180,220,0.7)", marginTop: "0.5rem" }}>
            Fetching forecast...
          </p>
        </div>
      )}

      {error && (
        <div className="text-center py-6" data-ocid="weather.error_state">
          <p style={{ color: "rgba(255,150,150,0.8)" }}>
            Unable to load weather data. Please try again later.
          </p>
        </div>
      )}

      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "0.6rem",
            overflowX: "auto",
          }}
        >
          {forecast.map((day, i) => (
            <div
              key={day.date}
              data-ocid={`weather.item.${i + 1}`}
              style={{
                background: "rgba(15, 25, 50, 0.75)",
                border: "1px solid rgba(100, 150, 220, 0.25)",
                borderRadius: "0.875rem",
                padding: "0.875rem 0.5rem",
                textAlign: "center",
                backdropFilter: "blur(8px)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
                minWidth: "70px",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  color: i === 0 ? "#93c5fd" : "rgba(148,163,184,0.9)",
                  marginBottom: "0.4rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {i === 0 ? "Today" : day.dayName}
              </div>
              <div
                style={{
                  fontSize: "1.75rem",
                  marginBottom: "0.4rem",
                  lineHeight: 1,
                }}
              >
                {weatherEmoji(day.code)}
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "rgba(147,197,253,0.6)",
                  marginBottom: "0.4rem",
                }}
              >
                {weatherDesc(day.code)}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#fbbf24",
                }}
              >
                {day.high}°
              </div>
              <div
                style={{ fontSize: "0.75rem", color: "rgba(148,163,184,0.75)" }}
              >
                {day.low}°
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
