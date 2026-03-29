import { useEffect, useState } from "react";

function getNextChristmas() {
  const now = new Date();
  const year = now.getFullYear();
  let christmas = new Date(year, 11, 25, 0, 0, 0);
  if (now > christmas) {
    christmas = new Date(year + 1, 11, 25, 0, 0, 0);
  }
  return christmas;
}

function getTimeLeft() {
  const target = getNextChristmas();
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(30,15,5,0.95) 0%, rgba(20,10,3,0.98) 100%)",
          border: "2px solid rgba(220,150,50,0.5)",
          borderRadius: "1rem",
          minWidth: "80px",
          padding: "1rem 0.75rem",
          textAlign: "center",
          boxShadow:
            "0 0 20px rgba(220,150,50,0.15), 0 4px 16px rgba(0,0,0,0.5)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Horizontal line across middle */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            height: "1px",
            background: "rgba(220,150,50,0.3)",
          }}
        />
        <span
          style={{
            fontFamily: "'Mountains of Christmas', serif",
            fontSize: "3rem",
            fontWeight: 700,
            color: "#fde68a",
            lineHeight: 1,
            display: "block",
            textShadow: "0 0 20px rgba(245,200,50,0.8)",
          }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span
        style={{
          color: "rgba(253,230,138,0.8)",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative z-10 px-4 py-10 max-w-3xl mx-auto text-center"
      data-ocid="countdown.section"
    >
      <h2
        style={{
          fontFamily: "'Mountains of Christmas', serif",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "#fde68a",
          marginBottom: "1.5rem",
          textShadow: "0 0 20px rgba(245,200,50,0.5)",
        }}
      >
        🎅 Days Until Christmas
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1.25rem",
          flexWrap: "wrap",
        }}
      >
        <Digit value={time.days} label="Days" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingBottom: "2rem",
          }}
        >
          <span
            style={{
              fontFamily: "'Mountains of Christmas', serif",
              fontSize: "2.5rem",
              color: "#fde68a",
              opacity: 0.7,
            }}
          >
            :
          </span>
        </div>
        <Digit value={time.hours} label="Hours" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingBottom: "2rem",
          }}
        >
          <span
            style={{
              fontFamily: "'Mountains of Christmas', serif",
              fontSize: "2.5rem",
              color: "#fde68a",
              opacity: 0.7,
            }}
          >
            :
          </span>
        </div>
        <Digit value={time.minutes} label="Minutes" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingBottom: "2rem",
          }}
        >
          <span
            style={{
              fontFamily: "'Mountains of Christmas', serif",
              fontSize: "2.5rem",
              color: "#fde68a",
              opacity: 0.7,
            }}
          >
            :
          </span>
        </div>
        <Digit value={time.seconds} label="Seconds" />
      </div>
    </section>
  );
}
