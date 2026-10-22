import { AnimatePresence, motion } from "framer-motion";
import { Clock, PackageCheck, Ship, X } from "lucide-react";
import { useState } from "react";
import { worldMapConfig } from "@/data/worldMap";
import { cn } from "@/lib/utils";

export interface Hub {
  id: string;
  name: string;
  code: string;
  iso2: string;
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

export const indiaOrigin: Hub = {
  id: "india",
  name: "India (Export Origin Gateway)",
  code: "INDIA",
  iso2: "IN",
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
  products: "Full Export Portfolio (Agricultural Grains, Spices, Fresh Produce, Powders)",
  transit: "Domestic Consolidation, Quality Assay & Customs Clearance",
  isOrigin: true,
};

// Exactly the 7 export destination countries requested:
// USA, EUROPE, UAE, SOUTH AFRICA, GERMANY, AUSTRALIA, KENYA
export const destinationHubs: Hub[] = [
  {
    id: "usa",
    name: "United States",
    code: "USA",
    iso2: "US",
    flag: "🇺🇸",
    x: 265.6,
    y: 158.5,
    labelX: 237,
    labelY: 144,
    textAnchor: "middle",
    pillX: 214,
    pillY: 132,
    pillW: 46,
    pillH: 18,
    // Great Circle transatlantic route from India
    routeD: "M 681.6 233.8 C 550 90, 380 90, 265.6 158.5",
    ports: "Port of New York / New Jersey, Houston, Los Angeles",
    products: "Spices, Basmati Rice, Organic Pulses, Dehydrated Powders",
    transit: "28–34 Days (East Coast) / 38–42 Days (West Coast)",
  },
  {
    id: "europe",
    name: "Western Europe",
    code: "EUROPE",
    iso2: "EU",
    flag: "🇪🇺",
    x: 484.6,
    y: 119.6,
    labelX: 454,
    labelY: 108,
    textAnchor: "middle",
    pillX: 422,
    pillY: 96,
    pillW: 64,
    pillH: 18,
    // Direct maritime arc to North Sea / Rotterdam gateway
    routeD: "M 681.6 233.8 C 605 155, 530 115, 484.6 119.6",
    ports: "Port of Rotterdam, Port of Antwerp",
    products: "Organic Spices, Green Cardamom, Fresh Produce, Pulses",
    transit: "22–26 Days (Direct Sea Transit)",
  },
  {
    id: "germany",
    name: "Germany",
    code: "GERMANY",
    iso2: "DE",
    flag: "🇩🇪",
    x: 504.0,
    y: 115.0,
    labelX: 548,
    labelY: 108,
    textAnchor: "middle",
    pillX: 512,
    pillY: 96,
    pillW: 72,
    pillH: 18,
    // Maritime arc to Hamburg / Bremerhaven
    routeD: "M 681.6 233.8 C 620 150, 560 110, 504.0 115.0",
    ports: "Port of Hamburg, Port of Bremerhaven",
    products: "Dehydrated Onion & Garlic, Spices, Grains, Ceramic Tiles",
    transit: "24–28 Days (North Sea Container Berths)",
  },
  {
    id: "uae",
    name: "Middle East (UAE)",
    code: "UAE",
    iso2: "AE",
    flag: "🇦🇪",
    x: 628.1,
    y: 212.8,
    labelX: 601,
    labelY: 232,
    textAnchor: "middle",
    pillX: 580,
    pillY: 220,
    pillW: 42,
    pillH: 18,
    // Direct express arc across Arabian Sea
    routeD: "M 681.6 233.8 Q 652 210, 628.1 212.8",
    ports: "Jebel Ali Port (Dubai), Khalifa Port (Abu Dhabi)",
    products: "Fresh Fruits & Vegetables, Red Onions, Rice, Spices",
    transit: "4–6 Days (Express Gulf Sea Corridor)",
  },
  {
    id: "kenya",
    name: "Kenya (East Africa)",
    code: "KENYA",
    iso2: "KE",
    flag: "🇰🇪",
    x: 580.0,
    y: 298.5,
    labelX: 620,
    labelY: 302,
    textAnchor: "middle",
    pillX: 592,
    pillY: 290,
    pillW: 56,
    pillH: 18,
    // Direct arc across Western Indian Ocean to Mombasa
    routeD: "M 681.6 233.8 Q 635 270, 580.0 298.5",
    ports: "Port of Mombasa",
    products: "Non-Basmati Rice, Yellow Maize, Spices, Pulses",
    transit: "10–14 Days (East African Corridor)",
  },
  {
    id: "south-africa",
    name: "South Africa",
    code: "SOUTH AFRICA",
    iso2: "ZA",
    flag: "🇿🇦",
    x: 538.8,
    y: 398.8,
    labelX: 539,
    labelY: 434,
    textAnchor: "middle",
    pillX: 486,
    pillY: 422,
    pillW: 106,
    pillH: 18,
    // Sweeps southwest across Indian Ocean to Durban / Cape Town
    routeD: "M 681.6 233.8 C 610 320, 565 365, 538.8 398.8",
    ports: "Port of Durban, Port of Cape Town",
    products: "Basmati & Non-Basmati Rice, Spices, Natural Granite, Tiles",
    transit: "16–22 Days (Southern Ocean Route)",
  },
  {
    id: "australia",
    name: "Australia",
    code: "AUSTRALIA",
    iso2: "AU",
    flag: "🇦🇺",
    x: 852.5,
    y: 394.2,
    labelX: 852,
    labelY: 430,
    textAnchor: "middle",
    pillX: 808,
    pillY: 418,
    pillW: 88,
    pillH: 18,
    // Sweeps southeast into Oceania / Sydney / Melbourne
    routeD: "M 681.6 233.8 C 740 280, 810 340, 852.5 394.2",
    ports: "Port Botany (Sydney), Port of Melbourne, Fremantle",
    products: "Spices, Basmati Rice, Dehydrated Garlic & Onion, Wheat",
    transit: "18–24 Days (Indian Ocean Eastbound Corridor)",
  },
];

export const allHubs = [indiaOrigin, ...destinationHubs];

export interface WorldMapProps {
  compact?: boolean;
  className?: string;
}

export function WorldMap({ compact = false, className }: WorldMapProps) {
  // Default to UAE active so the popup card matches reference design on load
  const [activeHub, setActiveHub] = useState<Hub | null>(destinationHubs[3]);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Interactive Tooltip Card Floating in Bottom-Left Corner (Desktop) */}
      <AnimatePresence>
        {activeHub && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="hidden md:block absolute bottom-6 left-4 md:bottom-8 md:left-6 z-30 w-72 md:w-84 rounded-2xl border border-gold/40 bg-[#071A33]/95 p-4 shadow-2xl backdrop-blur-xl text-left pointer-events-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm font-bold text-gold tracking-wider bg-gold/15 px-2 py-0.5 rounded border border-gold/30">
                  {activeHub.iso2}
                </span>
                <div>
                  <h4 className="font-display text-sm md:text-base font-semibold text-white leading-tight">
                    {activeHub.name}
                  </h4>
                  <p className="text-[10px] uppercase tracking-wider text-gold-light font-medium">
                    {activeHub.isOrigin ? "Origin Gateway" : "DESTINATION CORRIDOR"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveHub(null)}
                aria-label="Close details"
                className="rounded-full p-1 text-[#D9DDE3] hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
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

      {/* Fluid Map Container that scales cleanly without horizontal overflow */}
      <div className="w-full relative overflow-hidden rounded-2xl border border-gold/20 shadow-2xl bg-[#071A33]">
        <div className="w-full relative">
          <svg
            viewBox="0 0 1000 520"
            className="h-auto w-full select-none block"
            role="img"
            aria-label="World Map showing export shipping lanes from India to USA, Europe, Germany, UAE, Kenya, South Africa, and Australia"
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

              {/* Gold to Silver Brand Gradient for Maritime Route Full Lines */}
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

              {/* Luminous Golden Ship/Cargo Dot Glow */}
              <filter id="shipGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#F2C86E" floodOpacity="1" />
                <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#C9973F" floodOpacity="0.85" />
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
                          country.name ? h.name.toLowerCase().includes(country.name.toLowerCase()) || country.name.toLowerCase().includes(h.code.toLowerCase()) : false
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

            {/* 4. Full Shipping Route Lines & Continuous Traveling Golden Dots */}
            <g id="shipping-routes">
              {destinationHubs.map((dest, i) => {
                if (!dest.routeD) return null;
                const pathId = `maritime-lane-${dest.id}`;
                return (
                  <g key={dest.id}>
                    {/* Background subtle golden glow stroke */}
                    <path
                      d={dest.routeD}
                      fill="none"
                      stroke="#C9973F"
                      strokeWidth={3.5}
                      strokeOpacity={0.22}
                    />

                    {/* FULL SOLID MARITIME ROUTE LINE */}
                    <motion.path
                      id={pathId}
                      d={dest.routeD}
                      fill="none"
                      stroke="url(#routeLineGrad)"
                      strokeWidth={1.8}
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.95 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.6,
                        delay: 0.12 + i * 0.08,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Traveling Golden Dot (Luminous Gold Particle Traveling from India Outward) */}
                    {/* Soft glowing outer halo */}
                    <circle r="5" fill="#F2C86E" opacity="0.45" filter="url(#shipGlow)">
                      <animateMotion
                        dur={`${5.0 + i * 0.7}s`}
                        repeatCount="indefinite"
                        path={dest.routeD}
                        keyPoints="0;1"
                        keyTimes="0;1"
                      />
                    </circle>

                    {/* Sharp brilliant gold/white center core */}
                    <circle r="3.2" fill="#FFFFFF" stroke="#F2C86E" strokeWidth="1.6" filter="url(#shipGlow)">
                      <animateMotion
                        dur={`${5.0 + i * 0.7}s`}
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
                      begin={`${i * 0.35}s`}
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

            {/* 6. India Origin Hub (Grand Golden Solar Wave) */}
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
                    fill="rgba(4, 14, 31, 0.82)"
                    stroke="rgba(201, 151, 63, 0.4)"
                    strokeWidth="0.6"
                  />
                  {/* Label Text */}
                  <text
                    x={dest.labelX}
                    y={dest.labelY}
                    textAnchor={dest.textAnchor}
                    className="fill-white text-[11px] font-sans font-medium tracking-[0.18em] uppercase"
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
                  fill="rgba(4, 14, 31, 0.88)"
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
          <span>7 Primary Export Destinations</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block w-6 border-t-2 border-[#F2C86E]"></span>
          <span>Full Active Maritime Routes</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-4 rounded-sm bg-[#C9973F]/40 border border-[#F2C86E]/70"></span>
          <span>Accredited Trading Territories</span>
        </div>
      </div>

      {/* Mobile-only info card rendered cleanly below the map */}
      <AnimatePresence>
        {activeHub && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="md:hidden mt-4 w-full rounded-2xl border border-gold/40 bg-[#071A33]/95 p-4 shadow-xl text-left"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-gold tracking-wider bg-gold/15 px-2 py-0.5 rounded border border-gold/30">
                  {activeHub.iso2}
                </span>
                <div>
                  <h4 className="font-display text-sm font-semibold text-white leading-tight">
                    {activeHub.name}
                  </h4>
                  <p className="text-[10px] uppercase tracking-wider text-gold-light font-medium">
                    {activeHub.isOrigin ? "Origin Gateway" : "Destination Corridor"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveHub(null)}
                aria-label="Close details"
                className="rounded-full p-1 text-[#D9DDE3] hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-2.5 space-y-1.5 text-xs text-[#D9DDE3]">
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
    </div>
  );
}

export default WorldMap;
