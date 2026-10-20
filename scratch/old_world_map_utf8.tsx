import { AnimatePresence, motion } from "framer-motion";
import { Anchor, Clock, PackageCheck, Ship, X } from "lucide-react";
import { useState } from "react";
import { worldMapConfig } from "@/data/worldMap";
import { cn } from "@/lib/utils";

interface Hub {
  id: string;
  name: string;
  code: string;
  flag: string;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  textAnchor: "start" | "middle" | "end";
  pillX: number;
  pillY: number;
  pillW: number;
  pillH: number;
  routeD?: string;
  ports: string;
  products: string;
  transit: string;
  isOrigin?: boolean;
}

const indiaOrigin: Hub = {
  id: "india",
  name: "India (Export Origin Gateway)",
  code: "INDIA",
  flag: "🇮🇳",
  x: 681.6,
  y: 233.8,
  labelX: 681.6,
  labelY: 260,
  textAnchor: "middle",
  pillX: 648,
  pillY: 247,
  pillW: 68,
  pillH: 19,
  ports: "JNPT (Mumbai), Mundra Port, Chennai Port, Cochin Port",
  products: "Full Export Portfolio (Agricultural, Spices, Natural Stone, Fresh Produce)",
  transit: "Domestic Consolidation, Quality Assay & Customs Clearance",
  isOrigin: true,
};

const destinationHubs: Hub[] = [
  {
    id: "usa",
    name: "United States",
    code: "USA",
    flag: "🇺🇸",
    x: 265.6,
    y: 158.5,
    // Custom offset: above-left
    labelX: 250,
    labelY: 144,
    textAnchor: "end",
    pillX: 214,
    pillY: 132,
    pillW: 44,
    pillH: 18,
    // High-arching Great Circle sea route over North Atlantic
    routeD: "M 681.6 233.8 C 550 90, 380 90, 265.6 158.5",
    ports: "Port of New York & New Jersey, Houston, Los Angeles",
    products: "Spices, Basmati Rice, Granite & Marble Slabs",
    transit: "28–34 Days (East Coast) / 38–42 Days (West Coast)",
  },
  {
    id: "uk",
    name: "United Kingdom",
    code: "UK",
    flag: "🇬🇧",
    x: 471.2,
    y: 118.0,
    // Custom offset: above, shifted left
    labelX: 456,
    labelY: 104,
    textAnchor: "end",
    pillX: 428,
    pillY: 92,
    pillW: 34,
    pillH: 18,
    // Arcs through Levant into English Channel
    routeD: "M 681.6 233.8 C 600 135, 520 102, 471.2 118.0",
    ports: "Port of Felixstowe, London Gateway, Southampton",
    products: "Basmati Rice, Spices, Mangoes, Table Grapes",
    transit: "22–26 Days (Direct Sea Transit)",
  },
  {
    id: "europe",
    name: "Western Europe",
    code: "EUROPE",
    flag: "🇪🇺",
    x: 505.0,
    y: 122.0,
    // Custom offset: below-right
    labelX: 520,
    labelY: 140,
    textAnchor: "start",
    pillX: 512,
    pillY: 128,
    pillW: 66,
    pillH: 18,
    // Arcs under UK route into North Sea / Rhine ports
    routeD: "M 681.6 233.8 C 615 158, 555 130, 505.0 122.0",
    ports: "Port of Rotterdam, Port of Hamburg, Port of Antwerp",
    products: "Organic Spices, Green Cardamom, Natural Stone & Tiles",
    transit: "24–28 Days (North Sea & Med Ports)",
  },
  {
    id: "uae",
    name: "Middle East",
    code: "UAE",
    flag: "🇦🇪",
    x: 628.1,
    y: 212.8,
    // Custom offset: below-left
    labelX: 618,
    labelY: 232,
    textAnchor: "end",
    pillX: 580,
    pillY: 220,
    pillW: 42,
    pillH: 18,
    // Short direct arc across Arabian Sea
    routeD: "M 681.6 233.8 Q 652 210, 628.1 212.8",
    ports: "Jebel Ali Port (Dubai), Khalifa Port (Abu Dhabi)",
    products: "Fresh Fruits & Vegetables, Red Onions, Rice",
    transit: "4–6 Days (Express Gulf Sea Corridor)",
  },
  {
    id: "africa",
    name: "East & West Africa",
    code: "AFRICA",
    flag: "🌍",
    x: 585.1,
    y: 313.8,
    // Custom offset: below
    labelX: 585.1,
    labelY: 335,
    textAnchor: "middle",
    pillX: 556,
    pillY: 323,
    pillW: 58,
    pillH: 18,
    // Sweeps southwest across Indian Ocean to Mombasa / Durban
    routeD: "M 681.6 233.8 Q 638 290, 585.1 313.8",
    ports: "Port of Mombasa, Port of Dar es Salaam, Port of Durban, Lagos",
    products: "Non-Basmati Rice, Yellow Maize, Spices, Pulses",
    transit: "14–20 Days (East & West African Berths)",
  },
  {
    id: "se-asia",
    name: "Southeast Asia",
    code: "SE ASIA",
    flag: "🌏",
    x: 777.5,
    y: 295.3,
    // Custom offset: below-right
    labelX: 792,
    labelY: 314,
    textAnchor: "start",
    pillX: 784,
    pillY: 302,
    pillW: 68,
    pillH: 18,
    // Sweeps southeast into Singapore / Malacca Strait
    routeD: "M 681.6 233.8 Q 722 280, 777.5 295.3",
    ports: "Port of Singapore, Port Klang, Cat Lai (Ho Chi Minh)",
    products: "Teja Dry Red Chilies, Turmeric, Cumin, Pulses",
    transit: "8–12 Days (Straits & East Asian Ports)",
  },
];

const allHubs = [indiaOrigin, ...destinationHubs];

export function WorldMap() {
  const [activeHub, setActiveHub] = useState<Hub | null>(null);

  return (
    <div className="relative w-full">
      {/* Interactive Tooltip Card Floating in Corner */}
      <AnimatePresence>
        {activeHub && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 left-4 md:bottom-24 md:left-6 z-30 w-72 md:w-84 rounded-2xl border border-gold/40 bg-[#071A33]/95 p-4 shadow-2xl backdrop-blur-xl text-left pointer-events-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">{activeHub.flag}</span>
                <div>
                  <h4 className="font-display text-base font-semibold text-white leading-tight">
                    {activeHub.name}
                  </h4>
                  <p className="text-[10px] uppercase tracking-wider text-gold-light">
                    {activeHub.isOrigin ? "Origin Dispatch Center" : "Destination Corridor"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveHub(null)}
                aria-label="Close details"
                className="rounded-full p-1 text-[#D9DDE3] hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2 text-xs text-[#D9DDE3]">
              <div className="flex items-start gap-2">
                <Ship className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Ports: </strong>
                  {activeHub.ports}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <PackageCheck className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Top Cargo: </strong>
                  {activeHub.products}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-gold shrink-0" />
                <span>
                  <strong className="text-white">Transit: </strong>
                  {activeHub.transit}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Horizontally scrollable container on small mobile screens */}
      <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-none rounded-2xl">
        <div className="min-w-[680px] md:min-w-0 w-full relative">
          <svg
            viewBox="0 0 1000 520"
            className="h-auto w-full select-none block"
            role="img"
            aria-label="Accurate World Map showing export shipping lanes from India to UK, USA, UAE, Europe, Southeast Asia and Africa"
          >
            <defs>
              {/* Deep Navy Ocean Gradient */}
              <linearGradient id="mapOceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#071A33" />
                <stop offset="50%" stopColor="#0B2447" />
                <stop offset="100%" stopColor="#040E1F" />
              </linearGradient>

              {/* Soft Radial Depth Glow Behind Indian Ocean & Core Routes */}
              <radialGradient id="mapRadialDepth" cx="66%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#1F4A72" stopOpacity="0.32" />
                <stop offset="45%" stopColor="#0B2447" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#040E1F" stopOpacity="0" />
              </radialGradient>

              {/* Gold to Silver Brand Gradient for Maritime Route Lines */}
              <linearGradient id="routeLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F2C86E" />
                <stop offset="40%" stopColor="#C9973F" />
                <stop offset="75%" stopColor="#E7EAEE" />
                <stop offset="100%" stopColor="#BFC5CE" />
              </linearGradient>

              {/* Glowing Filter for India Hub */}
              <filter id="indiaGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#F2C86E" floodOpacity="0.55" />
              </filter>

              {/* Glow for Destination Countries */}
              <filter id="servedCountryGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#C9973F" floodOpacity="0.3" />
              </filter>

              {/* Cargo Ship Glow */}
              <filter id="shipGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#F2C86E" floodOpacity="0.9" />
              </filter>

              {/* Node Drop Shadow */}
              <filter id="nodeShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#040E1F" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* 1. Map Ocean Background */}
            <rect width="1000" height="520" rx="16" fill="url(#mapOceanGrad)" />
            <rect width="1000" height="520" rx="16" fill="url(#mapRadialDepth)" />

            {/* 2. Lat/Long Graticule (Subtle 3% Opacity Nautical Grid) */}
            <path
              d={worldMapConfig.graticule}
              fill="none"
              stroke="rgba(217, 221, 227, 0.04)"
              strokeWidth="0.5"
              strokeDasharray="4 4"
            />

            {/* 3. Real Continents & Countries (Accurate Natural Earth Shapes) */}
            <g id="world-countries">
              {worldMapConfig.countries.map((country, idx) => {
                const uniqueKey = `country-${country.id || "un"}-${idx}`;
                if (country.isIndia) {
                  return (
                    <path
                      key={uniqueKey}
                      d={country.d}
                      fill="rgba(242, 200, 110, 0.65)"
                      stroke="#F2C86E"
                      strokeWidth="1.2"
                      filter="url(#indiaGlow)"
                      className="transition-all duration-300 hover:fill-opacity-90 cursor-pointer"
                      onClick={() => setActiveHub(indiaOrigin)}
                    />
                  );
                }

                if (country.isServed) {
                  return (
                    <path
                      key={uniqueKey}
                      d={country.d}
                      fill="rgba(201, 151, 63, 0.38)"
                      stroke="rgba(242, 200, 110, 0.75)"
                      strokeWidth="0.75"
                      filter="url(#servedCountryGlow)"
                      className="transition-all duration-300 hover:fill-opacity-60 cursor-pointer"
                      onClick={() => {
                        const target = destinationHubs.find((h) =>
                          country.name ? h.name.toLowerCase().includes(country.name.toLowerCase()) : false
                        );
                        if (target) setActiveHub(target);
                      }}
                    />
                  );
                }

                return (
                  <path
                    key={uniqueKey}
                    d={country.d}
                    fill="rgba(31, 74, 114, 0.55)"
                    stroke="rgba(217, 221, 227, 0.22)"
                    strokeWidth="0.5"
                    className="transition-colors duration-200"
                  />
                );
              })}
            </g>

            {/* 4. Shipping Route Lines (Drawn Under Markers) */}
            <g id="shipping-routes">
              {destinationHubs.map((dest, i) => {
                if (!dest.routeD) return null;
                const pathId = `maritime-lane-${dest.id}`;
                return (
                  <g key={dest.id}>
                    {/* Background subtle glow path */}
                    <path
                      d={dest.routeD}
                      fill="none"
                      stroke="#C9973F"
                      strokeWidth={3}
                      strokeOpacity={0.12}
                    />

                    {/* Animated Dashed Maritime Route Path */}
                    <motion.path
                      id={pathId}
                      d={dest.routeD}
                      fill="none"
                      stroke="url(#routeLineGrad)"
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.95 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.8,
                        delay: 0.2 + i * 0.15,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Traveling Cargo Vessel Gold Dot (Native GPU 60fps Loop) */}
                    <circle r="3.2" fill="#F2C86E" filter="url(#shipGlow)">
                      <animateMotion
                        dur={`${5 + i * 0.9}s`}
                        repeatCount="indefinite"
                        path={dest.routeD}
                        keyPoints="0;1"
                        keyTimes="0;1"
                      />
                    </circle>
                  </g>
                );
              })}
            </g>

            {/* 5. Destination Nodes & Pulse Halos */}
            <g id="destination-markers">
              {destinationHubs.map((dest, i) => (
                <g
                  key={dest.id}
                  className="cursor-pointer group"
                  onClick={() => setActiveHub(dest)}
                  onMouseEnter={() => setActiveHub(dest)}
                >
                  {/* Outer Pulsing Radar Ring */}
                  <circle cx={dest.x} cy={dest.y} r={12} className="fill-[#C9973F]/25 pointer-events-none">
                    <animate
                      attributeName="r"
                      values="6;16;6"
                      dur="3s"
                      repeatCount="indefinite"
                      begin={`${i * 0.4}s`}
                    />
                  </circle>

                  {/* Middle Soft Gold Halo */}
                  <circle cx={dest.x} cy={dest.y} r={6} className="fill-[#C9973F] opacity-75" />

                  {/* Solid Center Node with Navy Rim */}
                  <circle
                    cx={dest.x}
                    cy={dest.y}
                    r={4}
                    fill="#F2C86E"
                    stroke="#071A33"
                    strokeWidth={1.5}
                    filter="url(#nodeShadow)"
                    className="transition-transform duration-200 group-hover:scale-125"
                  />
                </g>
              ))}
            </g>

            {/* 6. India Origin Hub (Prominently Larger with Golden Solar Wave) */}
            <g
              id="india-origin"
              className="cursor-pointer"
              onClick={() => setActiveHub(indiaOrigin)}
              onMouseEnter={() => setActiveHub(indiaOrigin)}
            >
              {/* Grand Outer Ripple */}
              <circle cx={indiaOrigin.x} cy={indiaOrigin.y} r={22} className="fill-[#F2C86E]/20 pointer-events-none">
                <animate
                  attributeName="r"
                  values="10;26;10"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Core Middle Ambient Wave */}
              <circle cx={indiaOrigin.x} cy={indiaOrigin.y} r={12} className="fill-[#F2C86E]/40" />

              {/* Origin Golden Sun Node */}
              <circle
                cx={indiaOrigin.x}
                cy={indiaOrigin.y}
                r={6.5}
                fill="#F2C86E"
                stroke="#040E1F"
                strokeWidth={2}
                filter="url(#indiaGlow)"
              />
            </g>

            {/* 7. Collision-Free Dedicated Label Pills */}
            <g id="market-labels" className="pointer-events-none select-none">
              {destinationHubs.map((dest) => (
                <g key={`label-${dest.id}`}>
                  {/* Contrast Pill Background */}
                  <rect
                    x={dest.pillX}
                    y={dest.pillY}
                    width={dest.pillW}
                    height={dest.pillH}
                    rx="4"
                    fill="rgba(4, 14, 31, 0.78)"
                    stroke="rgba(201, 151, 63, 0.35)"
                    strokeWidth="0.6"
                  />
                  {/* Label Text */}
                  <text
                    x={dest.labelX}
                    y={dest.labelY}
                    textAnchor={dest.textAnchor}
                    className="fill-white text-[11px] font-sans font-medium tracking-[0.2em] uppercase"
                    style={{ textShadow: "0 1px 8px #040E1F" }}
                  >
                    {dest.code}
                  </text>
                </g>
              ))}

              {/* India Origin Label */}
              <g id="label-india">
                <rect
                  x={indiaOrigin.pillX}
                  y={indiaOrigin.pillY}
                  width={indiaOrigin.pillW}
                  height={indiaOrigin.pillH}
                  rx="4"
                  fill="rgba(4, 14, 31, 0.85)"
                  stroke="#F2C86E"
                  strokeWidth="0.8"
                />
                <text
                  x={indiaOrigin.labelX}
                  y={indiaOrigin.labelY}
                  textAnchor="middle"
                  className="fill-[#F2C86E] text-[12px] font-display font-semibold tracking-[0.28em] uppercase"
                  style={{ textShadow: "0 1px 8px #040E1F" }}
                >
                  {indiaOrigin.code}
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* Legend Row Below Map */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-5 text-xs text-[#D9DDE3]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F2C86E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F2C86E] border border-[#040E1F]"></span>
          </span>
          <span className="font-semibold text-white">India (Origin Gateways)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#F2C86E] border border-[#071A33] shadow-sm"></span>
          <span>Destination Markets (25+ Countries)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block w-6 border-t-2 border-dashed border-[#F2C86E]"></span>
          <span>Active Maritime Corridors</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-4 rounded-sm bg-[#C9973F]/40 border border-[#F2C86E]/70"></span>
          <span>Accredited Trading Territories</span>
        </div>
      </div>

      {/* Mobile Swipe Guidance Note */}
      <p className="mt-2 text-center text-[11px] text-[#D9DDE3]/60 md:hidden">
        Scroll or swipe horizontally to view all continents & shipping lanes
      </p>
    </div>
  );
}
