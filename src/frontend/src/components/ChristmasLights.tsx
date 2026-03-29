const BULB_COLORS = [
  { bg: "#dc2626", glow: "rgba(220,38,38,0.8)" },
  { bg: "#16a34a", glow: "rgba(22,163,74,0.8)" },
  { bg: "#2563eb", glow: "rgba(37,99,235,0.8)" },
  { bg: "#f59e0b", glow: "rgba(245,158,11,0.8)" },
  { bg: "#f97316", glow: "rgba(249,115,22,0.8)" },
];

const BULBS = Array.from({ length: 22 }, (_, i) => ({
  id: `bulb-${i}`,
  color: BULB_COLORS[i % BULB_COLORS.length],
  delay: `${(i * 0.3) % 2.5}s`,
  duration: `${1.5 + (i % 5) * 0.4}s`,
  animationName: i % 3 === 0 ? "twinkle-fast" : "twinkle",
}));

export default function ChristmasLights() {
  return (
    <div
      style={{
        background: "#1a0e05",
        paddingTop: "8px",
        paddingBottom: "0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Wire */}
      <div
        style={{
          height: "3px",
          background:
            "linear-gradient(90deg, #3a2a10 0%, #6b4f20 20%, #3a2a10 40%, #6b4f20 60%, #3a2a10 80%, #6b4f20 100%)",
          position: "absolute",
          top: "8px",
          left: 0,
          right: 0,
        }}
      />
      {/* Bulbs */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          position: "relative",
        }}
      >
        {BULBS.map((bulb) => (
          <div
            key={bulb.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "-2px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "6px",
                background: "#8B7355",
                borderRadius: "2px 2px 0 0",
                zIndex: 1,
              }}
            />
            <div
              style={{
                width: "14px",
                height: "20px",
                borderRadius: "50% 50% 55% 55% / 40% 40% 60% 60%",
                background: bulb.color.bg,
                boxShadow: `0 0 8px 3px ${bulb.color.glow}, 0 0 20px 5px ${bulb.color.glow}`,
                animation: `${bulb.animationName} ${bulb.duration} ease-in-out ${bulb.delay} infinite`,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "3px",
                  left: "2px",
                  width: "4px",
                  height: "5px",
                  background: "rgba(255,255,255,0.45)",
                  borderRadius: "50%",
                  transform: "rotate(-20deg)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
