import { motion } from "framer-motion";

// Stylised equirectangular projection (viewBox 1000x500).
const proj = (lon: number, lat: number) => [((lon + 180) / 360) * 1000, ((90 - lat) / 180) * 500] as const;
const india = proj(78, 21);
const dests = [
  { name: "UK", ll: [-1, 52] },
  { name: "USA", ll: [-90, 38] },
  { name: "UAE", ll: [54, 24] },
  { name: "Europe", ll: [10, 50] },
  { name: "SE Asia", ll: [104, 2] },
  { name: "Africa", ll: [36, -2] },
] as const;

// dotted land approximation
const blobs: [number, number, number, number][] = [
  [-130, 25, 60, 45], [-80, -55, 35, 65], [-10, 35, 45, 35], [-18, -35, 55, 70], [40, 5, 105, 70], [110, -40, 45, 30], [-55, 60, 30, 20],
];
const dots: [number, number][] = [];
for (const [lo, la, w, h] of blobs)
  for (let x = lo; x < lo + w; x += 4)
    for (let y = la; y < la + h; y += 4)
      if (Math.sin(x * 0.3) * Math.cos(y * 0.25) > -0.55) dots.push([x, y]);

export function WorldMap() {
  return (
    <svg viewBox="0 60 1000 340" className="h-auto w-full" role="img" aria-label="Map showing export routes from India to UK, USA, UAE, Europe, Southeast Asia and Africa">
      {dots.map(([lo, la], i) => {
        const [x, y] = proj(lo, la);
        return <circle key={i} cx={x} cy={y} r={1.6} className="fill-on-forest/15" />;
      })}
      {dests.map((d, i) => {
        const [x, y] = proj(d.ll[0], d.ll[1]);
        const mx = (india[0] + x) / 2;
        const my = Math.min(india[1], y) - 60;
        return (
          <g key={d.name}>
            <motion.path
              d={`M${india[0]},${india[1]} Q${mx},${my} ${x},${y}`}
              fill="none"
              className="stroke-gold"
              strokeWidth={1.2}
              strokeDasharray="0 1"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.9 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: 0.3 + i * 0.2, ease: "easeInOut" }}
            />
            <circle cx={x} cy={y} r={10} className="fill-gold/20">
              <animate attributeName="r" values="6;14;6" dur="3s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
            </circle>
            <circle cx={x} cy={y} r={4} className="fill-gold" />
            <text x={x} y={y - 14} textAnchor="middle" className="fill-on-forest text-[11px] tracking-widest uppercase">{d.name}</text>
          </g>
        );
      })}
      <circle cx={india[0]} cy={india[1]} r={7} className="fill-gold-soft" />
      <text x={india[0]} y={india[1] + 24} textAnchor="middle" className="fill-gold-soft text-[12px] font-semibold tracking-widest uppercase">India</text>
    </svg>
  );
}
