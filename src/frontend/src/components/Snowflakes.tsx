const FLAKES = [
  { id: "f1", left: "5%", size: 18, dur: 8, delay: 0, symbol: "❄", dir: 0 },
  { id: "f2", left: "10%", size: 12, dur: 12, delay: -3, symbol: "❅", dir: 1 },
  { id: "f3", left: "18%", size: 22, dur: 9, delay: -7, symbol: "❆", dir: 0 },
  { id: "f4", left: "25%", size: 10, dur: 14, delay: -1, symbol: "❄", dir: 1 },
  { id: "f5", left: "33%", size: 16, dur: 10, delay: -5, symbol: "❅", dir: 0 },
  { id: "f6", left: "40%", size: 14, dur: 11, delay: -9, symbol: "❄", dir: 1 },
  { id: "f7", left: "47%", size: 20, dur: 7, delay: -2, symbol: "❆", dir: 0 },
  { id: "f8", left: "55%", size: 11, dur: 13, delay: -6, symbol: "❄", dir: 1 },
  { id: "f9", left: "62%", size: 18, dur: 9, delay: -4, symbol: "❅", dir: 0 },
  { id: "f10", left: "70%", size: 13, dur: 15, delay: -8, symbol: "❆", dir: 1 },
  { id: "f11", left: "77%", size: 16, dur: 8, delay: -1, symbol: "❄", dir: 0 },
  { id: "f12", left: "84%", size: 24, dur: 11, delay: -3, symbol: "❅", dir: 1 },
  {
    id: "f13",
    left: "90%",
    size: 10,
    dur: 10,
    delay: -10,
    symbol: "❄",
    dir: 0,
  },
  { id: "f14", left: "95%", size: 15, dur: 12, delay: -6, symbol: "❆", dir: 1 },
  { id: "f15", left: "3%", size: 19, dur: 9, delay: -12, symbol: "❅", dir: 0 },
  { id: "f16", left: "52%", size: 12, dur: 14, delay: -4, symbol: "❄", dir: 1 },
  { id: "f17", left: "68%", size: 17, dur: 7, delay: -11, symbol: "❆", dir: 0 },
  { id: "f18", left: "80%", size: 14, dur: 10, delay: -2, symbol: "❅", dir: 1 },
];

export default function Snowflakes() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {FLAKES.map((f) => (
        <div
          key={f.id}
          style={{
            position: "absolute",
            left: f.left,
            top: "-30px",
            fontSize: `${f.size}px`,
            color: "rgba(200,230,255,0.7)",
            animation: `${f.dir === 0 ? "snowfall" : "snowfall-left"} ${f.dur}s linear ${f.delay}s infinite`,
            userSelect: "none",
          }}
        >
          {f.symbol}
        </div>
      ))}
    </div>
  );
}
