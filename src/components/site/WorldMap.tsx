// src/components/site/WorldMap.tsx
// High-Performance Floating Route Animation Engine
// Strict UAE Architecture: India (Gujarat) -> UAE (Jebel Ali) -> 6 Destination Markets

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Compass,
  PackageCheck,
  X,
} from "lucide-react";
import {
  exportCountries,
  originGateway,
  uaeCentralHub,
  legOneArc,
  legOneDays,
  regionsList,
  totalDestinationCount,
  type ExportCountry,
  type RegionKey,
} from "@/data/exportCountries";
import { worldMapConfig } from "@/data/worldMap";
import { cn } from "@/lib/utils";

// ==========================================
// TUNABLE ANIMATION CONFIGURATION
// ==========================================
export const DOT_TRAVEL_SECONDS = 12;

// Route durations (10-14s depending on length, linear easing)
export const LEG1_DURATION = 10.0;
export const SPOKE_DURATIONS: Record<string, number> = {
  US: 13.5,
  NL: 11.5,
  DE: 12.0,
  KE: 10.0,
  ZA: 12.5,
  AU: 13.0,
};

// UAE departure fan-out staggers for continuous journey
export const SPOKE_STAGGERS: Record<string, number> = {
  US: 0.25,
  NL: 0.50,
  DE: 0.75,
  KE: 1.00,
  ZA: 1.25,
  AU: 1.50,
};

// Route draw-in delays on page load (2.4s cubic-bezier(0.5, 0.1, 0.2, 1))
export const ROUTE_DRAW_DELAYS: Record<string, number> = {
  IN_TO_AE: 0.0,
  US: 0.25,
  NL: 0.50,
  DE: 0.75,
  KE: 1.00,
  ZA: 1.25,
  AU: 1.50,
};

// Destination port halo pulse delays (4s loop, staggered ~0.5s)
export const PORT_HALO_DELAYS: Record<string, number> = {
  AE: 0.0,
  NL: 0.5,
  DE: 1.0,
  US: 1.5,
  KE: 2.0,
  ZA: 2.5,
  AU: 3.0,
};

// Floating label delays (5s loop, staggered)
export const LABEL_FLOAT_DELAYS: Record<string, number> = {
  IN: 0.0,
  AE: 0.6,
  US: 1.2,
  NL: 1.8,
  DE: 2.4,
  KE: 3.0,
  ZA: 3.6,
  AU: 4.2,
};

// Strict gold-filled country set (exact 8 countries)
const GOLD_FILLED_COUNTRY_NAMES = new Set([
  "India",
  "United Arab Emirates",
  "United States",
  "Netherlands",
  "Germany",
  "South Africa",
  "Kenya",
  "Australia",
]);

interface WorldMapProps {
  compact?: boolean;
  isMarketsLive?: boolean;
}

type ActiveSelection =
  | { type: "origin" }
  | { type: "hub" }
  | { type: "country"; country: ExportCountry }
  | { type: "region"; regionKey: RegionKey };

export function WorldMap({ compact = false, isMarketsLive = false }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Path element references for getPointAtLength
  const legOnePathRef = useRef<SVGPathElement>(null);
  const spokePathRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const pathLengthsRef = useRef<Map<string, number>>(new Map());

  // Direct DOM references for particles to avoid React re-renders per frame
  const particlesGroupRef = useRef<SVGGElement>(null);
  const leg1DotRefs = useRef<(SVGGElement | null)[]>([]);
  const spokeDotRefs = useRef<Map<string, SVGGElement>>(new Map());

  const prefersReducedMotion = useReducedMotion();
  const [selectedRegion, setSelectedRegion] = useState<RegionKey | "all">("all");
  const [hoveredCountry, setHoveredCountry] = useState<ExportCountry | null>(null);
  const [activeSelection, setActiveSelection] = useState<ActiveSelection | null>(null);

  // Animation timeline tracking refs
  const isVisibleRef = useRef<boolean>(true);
  const animTimeRef = useRef<number>(0);
  const lastRafTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  const activeRegionMeta = useMemo(() => {
    if (selectedRegion === "all") return null;
    return regionsList.find((r) => r.id === selectedRegion) || null;
  }, [selectedRegion]);

  // Visibility and Intersection Observer to pause animation when offscreen or tab hidden
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        isVisibleRef.current = isIntersecting;
        if (isIntersecting) {
          lastRafTimeRef.current = 0; // reset delta-time so dots do not jump
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);

    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible";
      isVisibleRef.current = isVisible;
      if (isVisible) {
        lastRafTimeRef.current = 0;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Cache SVG path lengths once mounted
  const cachePathLengths = useCallback(() => {
    if (legOnePathRef.current) {
      try {
        const len = legOnePathRef.current.getTotalLength();
        if (len > 0) pathLengthsRef.current.set("IN_TO_AE", len);
      } catch {
        // fallback
      }
    }
    exportCountries.forEach((c) => {
      const el = spokePathRefs.current.get(c.iso2);
      if (el) {
        try {
          const len = el.getTotalLength();
          if (len > 0) pathLengthsRef.current.set(c.iso2, len);
        } catch {
          // fallback
        }
      }
    });
  }, []);

  useEffect(() => {
    cachePathLengths();
    const timer = setTimeout(cachePathLengths, 300);
    return () => clearTimeout(timer);
  }, [cachePathLengths]);

  // Main high-performance requestAnimationFrame Loop (Delta-time calibrated, 60fps)
  useEffect(() => {
    if (prefersReducedMotion || isMarketsLive) return;

    let isRunning = true;

    const animateFrame = (timestamp: number) => {
      if (!lastRafTimeRef.current) lastRafTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastRafTimeRef.current) / 1000, 0.1);
      lastRafTimeRef.current = timestamp;

      if (isVisibleRef.current) {
        animTimeRef.current += dt;
        const totalTime = animTimeRef.current;

        // 1. LEG 1 PARTICLES: India (Gujarat) -> UAE (Jebel Ali)
        const leg1Length =
          pathLengthsRef.current.get("IN_TO_AE") ||
          (legOnePathRef.current ? legOnePathRef.current.getTotalLength() : 70);
        if (leg1Length > 0 && !pathLengthsRef.current.has("IN_TO_AE")) {
          pathLengthsRef.current.set("IN_TO_AE", leg1Length);
        }

        for (let p = 0; p < 2; p++) {
          const dotEl = leg1DotRefs.current[p];
          if (!dotEl || !legOnePathRef.current) continue;

          // 2 dots evenly offset (0 and 0.5 along the path)
          const phase = p * 0.5;
          const cycle = ((totalTime / LEG1_DURATION + phase) % 1.0 + 1.0) % 1.0;
          const progress = cycle;
          const distance = progress * leg1Length;
          const pt = legOnePathRef.current.getPointAtLength(distance);

          // Fade in at the start and out at the end: opacity = sin(PI * t)
          const alpha = Math.sin(Math.PI * progress);
          dotEl.setAttribute(
            "transform",
            `translate(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)})`
          );
          dotEl.style.opacity = Math.max(0, alpha * 0.98).toFixed(3);
        }

        // 2. LEG 2 PARTICLES: UAE -> 6 Destination Markets
        exportCountries.forEach((country) => {
          const pathEl = spokePathRefs.current.get(country.iso2);
          if (!pathEl) return;

          let arcLength = pathLengthsRef.current.get(country.iso2) || 0;
          if (!arcLength) {
            arcLength = pathEl.getTotalLength() || 240;
            pathLengthsRef.current.set(country.iso2, arcLength);
          }

          const duration = SPOKE_DURATIONS[country.iso2] ?? DOT_TRAVEL_SECONDS;
          const stagger = SPOKE_STAGGERS[country.iso2] ?? 0;

          // Continuous journey: dots departing UAE connect smoothly from dots arriving from India
          const elapsed = totalTime - LEG1_DURATION - stagger;
          const isTargetHovered = hoveredCountry?.iso2 === country.iso2;
          const isRegionActive =
            selectedRegion === "all" || selectedRegion === country.region;

          for (let p = 0; p < 2; p++) {
            const dotEl = spokeDotRefs.current.get(`${country.iso2}-${p}`);
            if (!dotEl) continue;

            if (!isRegionActive) {
              dotEl.style.opacity = "0";
              continue;
            }

            const phase = p * 0.5;
            const cycle = ((elapsed / duration + phase) % 1.0 + 1.0) % 1.0;
            const progress = cycle;
            const distance = progress * arcLength;
            const pt = pathEl.getPointAtLength(distance);

            let alpha = Math.sin(Math.PI * progress);
            if (hoveredCountry && !isTargetHovered) {
              alpha *= 0.22; // Dim non-hovered routes
            }

            dotEl.setAttribute(
              "transform",
              `translate(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)})`
            );
            dotEl.style.opacity = Math.max(0, alpha * 0.98).toFixed(3);
          }
        });
      }

      if (isRunning) {
        rafIdRef.current = requestAnimationFrame(animateFrame);
      }
    };

    rafIdRef.current = requestAnimationFrame(animateFrame);

    return () => {
      isRunning = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [prefersReducedMotion, hoveredCountry, selectedRegion]);

  // Is corridor active/highlighted
  const isRouteHighlighted = (c: ExportCountry) => {
    if (hoveredCountry) return hoveredCountry.iso2 === c.iso2;
    if (activeSelection?.type === "country") return activeSelection.country.iso2 === c.iso2;
    if (activeSelection?.type === "region") return activeSelection.regionKey === c.region;
    if (selectedRegion !== "all") return selectedRegion === c.region;
    return true;
  };

  // Transit calculation helper
  const getTransitText = (c: ExportCountry) => {
    const totalMin = legOneDays[0] + c.legTwoDays[0];
    const totalMax = legOneDays[1] + c.legTwoDays[1];
    return `India -> UAE (${legOneDays[0]}–${legOneDays[1]} days) + UAE -> ${c.displayName} (${c.legTwoDays[0]}–${c.legTwoDays[1]} days) = ${totalMin}–${totalMax} days (indicative)`;
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full select-none text-[#F4F1EA]",
        compact ? "py-2" : "py-4"
      )}
    >
      {/* 1. Header Row: Mode & Metrics */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#C9973F]/20 text-[#F2C86E] ring-1 ring-[#C9973F]/40 shadow-inner">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white tracking-wide">
                UAE Corridors
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
                Liner Active
              </span>
            </div>
            <p className="text-xs text-[#D9DDE3]">
              Gujarat Gateway → Jebel Ali (UAE) → 6 Key Destination Markets
            </p>
          </div>
        </div>

        {/* Legend Metrics Pill */}
        <div className="flex items-center text-xs">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3.5 py-1.5 border border-white/10 shadow-sm">
            <span className="flex items-center gap-1.5 font-medium text-[#F2C86E]">
              <span className="h-2 w-2 rounded-full bg-[#F2C86E] ring-2 ring-[#F2C86E]/40 animate-pulse" />
              6 Destination Markets
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="flex items-center gap-1 text-[#D9DDE3]">
              <span className="h-2 w-2 rounded-full bg-[#FFE082]" />
              5 Regions
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="flex items-center gap-1.5 text-white font-semibold">
              <span className="h-2 w-2 rounded-full bg-amber-400 ring-2 ring-amber-400/50" />
              1 UAE
            </span>
          </div>
        </div>
      </div>

      {/* 2. Region Filter Chips */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs">
        <button
          type="button"
          onClick={() => {
            setSelectedRegion("all");
            setActiveSelection(null);
          }}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all duration-200",
            selectedRegion === "all"
              ? "bg-[#C9973F] text-white font-semibold shadow-md ring-1 ring-[#F2C86E]"
              : "bg-white/5 text-[#D9DDE3] hover:bg-white/10 hover:text-white"
          )}
        >
          <span>🌐</span>
          <span>All Markets</span>
          <span className="rounded-full bg-black/25 px-1.5 py-0.2 text-[0.65rem] font-semibold">
            {totalDestinationCount}
          </span>
        </button>

        {regionsList.map((reg) => {
          const isSelected = selectedRegion === reg.id;
          const count =
            reg.id === "gulf"
              ? 1
              : exportCountries.filter((c) => c.region === reg.id).length;

          return (
            <button
              key={reg.id}
              type="button"
              onClick={() => {
                setSelectedRegion(reg.id);
                setActiveSelection({ type: "region", regionKey: reg.id });
              }}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all duration-200",
                isSelected
                  ? "bg-[#C9973F] text-white font-semibold shadow-md ring-1 ring-[#F2C86E]"
                  : "bg-white/5 text-[#D9DDE3] hover:bg-white/10 hover:text-white"
              )}
            >
              <span>{reg.flag}</span>
              <span>{reg.label}</span>
              <span className="rounded-full bg-black/25 px-1.5 py-0.2 text-[0.65rem] font-semibold">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Map Canvas Container with Docked Side Card */}
      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-4 items-start">
        {/* SVG World Map */}
        <div className="relative w-full overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-b from-[#071A33] via-[#051429] to-[#040E1F] p-2 md:p-4 shadow-2xl">
          {/* Subtle Radial Glow behind India & UAE */}
          <div
            className="pointer-events-none absolute left-[62%] top-[40%] -translate-x-1/2 -translate-y-1/2 h-[340px] w-[340px] rounded-full bg-[#C9973F]/10 blur-[90px]"
            aria-hidden="true"
          />

          <svg
            ref={svgRef}
            data-map="world-trade-map"
            viewBox="0 0 1000 520"
            className="w-full h-auto drop-shadow-md select-none"
            aria-label="Interactive world export map showcasing India to UAE export routes"
            role="img"
          >
            <defs>
              {/* Internal SVG Animation Styles as Fail-Safe Encapsulation */}
              <style>{`
                @keyframes routeDrawIn {
                  0% { stroke-dashoffset: 1; }
                  100% { stroke-dashoffset: 0; }
                }
                @keyframes portHaloPulse {
                  0% { transform: scale(0.5); opacity: 0.9; }
                  100% { transform: scale(3.2); opacity: 0; }
                }
                @keyframes floatPill {
                  0%, 100% { transform: translateY(-1.5px); }
                  50% { transform: translateY(1.5px); }
                }
                .route-draw-path {
                  stroke-dasharray: 1 1;
                  stroke-dashoffset: 1;
                  animation: routeDrawIn 2.4s cubic-bezier(0.5, 0.1, 0.2, 1) forwards;
                }
                .port-halo-pulse {
                  transform-box: fill-box;
                  transform-origin: center;
                  pointer-events: none;
                }
                .floating-label-pill {
                  animation: floatPill 5s ease-in-out infinite;
                  will-change: transform;
                }
                @media (prefers-reduced-motion: reduce) {
                  .route-draw-path {
                    stroke-dashoffset: 0 !important;
                    animation: none !important;
                  }
                  .port-halo-pulse {
                    animation: none !important;
                    opacity: 0 !important;
                  }
                  .floating-label-pill {
                    animation: none !important;
                    transform: none !important;
                  }
                  #travelling-particles {
                    display: none !important;
                  }
                }
              `}</style>

              {/* Gradients */}
              <linearGradient id="legOneGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F2C86E" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
              </linearGradient>

              <linearGradient id="legTwoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F2C86E" stopOpacity="0.85" />
                <stop offset="65%" stopColor="#C9973F" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#D9DDE3" stopOpacity="0.7" />
              </linearGradient>

              <linearGradient id="activeRouteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE082" stopOpacity="1" />
                <stop offset="50%" stopColor="#F2C86E" stopOpacity="1" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
              </linearGradient>

              {/* Glow Filters */}
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <filter id="hubGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* A. Graticule / Ocean Grid */}
            <path
              d={worldMapConfig.graticule}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.5"
              strokeDasharray="2 3"
            />

            {/* B. Sovereign Country Landmasses */}
            <g id="landmasses">
              {worldMapConfig.countries.map((c, cIndex) => {
                const isOrigin = c.isIndia || c.name === "India";
                const isHub = c.name === "United Arab Emirates";
                const isDestination =
                  GOLD_FILLED_COUNTRY_NAMES.has(c.name) && !isOrigin && !isHub;

                let fill = "rgba(31, 74, 114, 0.42)"; // Default unserved navy
                let stroke = "rgba(255, 255, 255, 0.12)";
                let strokeWidth = "0.5";

                if (isOrigin) {
                  // India: Origin gold
                  fill = "rgba(201, 151, 63, 0.75)";
                  stroke = "#F2C86E";
                  strokeWidth = "1.0";
                } else if (isHub) {
                  // UAE: Re-Export gold
                  fill = "rgba(242, 200, 110, 0.75)";
                  stroke = "#FFE082";
                  strokeWidth = "1.2";
                } else if (isDestination) {
                  // 6 Destination countries gold
                  fill = "rgba(201, 151, 63, 0.55)";
                  stroke = "#C9973F";
                  strokeWidth = "0.85";
                }

                // Map target country for ref lookup
                const targetCountry = exportCountries.find(
                  (ec) =>
                    ec.name.toLowerCase() === c.name.toLowerCase() ||
                    (c.name === "Netherlands" && ec.iso2 === "NL")
                );

                return (
                  <path
                    key={c.id || `poly-${cIndex}`}
                    d={c.d}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    className="transition-colors duration-300 cursor-pointer"
                    onClick={() => {
                      if (isOrigin) {
                        setActiveSelection({ type: "origin" });
                      } else if (isHub) {
                        setActiveSelection({ type: "hub" });
                      } else if (targetCountry) {
                        setActiveSelection({ type: "country", country: targetCountry });
                      }
                    }}
                    onMouseEnter={() => {
                      if (targetCountry) setHoveredCountry(targetCountry);
                    }}
                    onMouseLeave={() => setHoveredCountry(null)}
                  >
                    <title>{c.name}</title>
                  </path>
                );
              })}
            </g>

            {/* C. Maritime Route Arcs (Draw-in on load, stay permanently visible) */}
            <g id="maritime-routes">
              {/* LEG 1: India (Gujarat) -> UAE (Jebel Ali) */}
              <g id="leg-1-feeder">
                {/* Background glow path */}
                <path
                  d={legOneArc}
                  fill="none"
                  stroke="#F2C86E"
                  strokeWidth="3.2"
                  strokeOpacity="0.4"
                  filter="url(#softGlow)"
                />
                {/* Solid main arc */}
                <path
                  ref={legOnePathRef}
                  data-trade-route="main"
                  data-market="IN"
                  d={legOneArc}
                  fill="none"
                  stroke="url(#legOneGradient)"
                  strokeWidth="2.0"
                  strokeLinecap="round"
                />
              </g>

              {/* LEG 2: UAE -> 6 Destination Markets (Fan out staggered by ~0.25s) */}
              <g id="leg-2-spokes">
                {exportCountries.map((c) => {
                  const isRouteActive = isRouteHighlighted(c);
                  const isHovered = hoveredCountry?.iso2 === c.iso2;
                  const strokeOpacity = isRouteActive
                    ? isHovered
                      ? 1.0
                      : 0.85
                    : 0.15;
                  const strokeWidth = isRouteActive
                    ? isHovered
                      ? 2.6
                      : 1.2
                    : 0.6;

                  return (
                    <g key={`route-${c.iso2}`}>
                      {/* Glow halo when hovered or selected */}
                      {isRouteActive && isHovered && (
                        <path
                          d={c.routeD}
                          fill="none"
                          stroke="#FFE082"
                          strokeWidth="3.8"
                          strokeOpacity="0.6"
                          filter="url(#softGlow)"
                        />
                      )}
                      {/* Main maritime route arc */}
                      <path
                        ref={(el) => {
                          if (el) spokePathRefs.current.set(c.iso2, el);
                        }}
                        data-trade-route="main"
                        data-market={c.iso2}
                        d={c.routeD}
                        fill="none"
                        stroke={isHovered ? "url(#activeRouteGradient)" : "url(#legTwoGradient)"}
                        strokeWidth={strokeWidth}
                        strokeOpacity={strokeOpacity}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />
                    </g>
                  );
                })}
              </g>
            </g>

            {/* D. Pulsing Port Halos (Scale 0.5 to 3.2, fade 0.9 to 0) - active when not live script */}
            {!isMarketsLive && (
              <g id="port-halos" pointerEvents="none">
                {/* Origin Marker Halo: India (repeating every 3s) */}
                <circle
                  cx={originGateway.x}
                  cy={originGateway.y}
                  r="4.5"
                  fill="none"
                  stroke="#F2C86E"
                  strokeWidth="1.2"
                  className="port-halo-pulse"
                  style={{
                    animation: "portHaloPulse 3s cubic-bezier(0.2, 0.7, 0.4, 1) infinite",
                    animationDelay: "0s",
                  }}
                />

                {/* UAE Halo: repeating every 4s, delay 0.0s */}
                <circle
                  cx={uaeCentralHub.x}
                  cy={uaeCentralHub.y}
                  r="5.0"
                  fill="none"
                  stroke="#FFE082"
                  strokeWidth="1.4"
                  className="port-halo-pulse"
                  style={{
                    animation: "portHaloPulse 4s cubic-bezier(0.2, 0.7, 0.4, 1) infinite",
                    animationDelay: `${PORT_HALO_DELAYS.AE}s`,
                  }}
                />

                {/* 6 Destination Port Halos: repeating every 4s, staggered by 0.5s */}
                {exportCountries.map((c) => {
                  const delay = PORT_HALO_DELAYS[c.iso2] ?? 0.5;
                  return (
                    <circle
                      key={`halo-${c.iso2}`}
                      cx={c.x}
                      cy={c.y}
                      r="4.0"
                      fill="none"
                      stroke="#F2C86E"
                      strokeWidth="1.2"
                      className="port-halo-pulse"
                      style={{
                        animation: "portHaloPulse 4s cubic-bezier(0.2, 0.7, 0.4, 1) infinite",
                        animationDelay: `${delay}s`,
                      }}
                    />
                  );
                })}
              </g>
            )}

            {/* E. Travelling Dots (Continuous Endless Loop) - active when not live script */}
            {!isMarketsLive && (
              <g ref={particlesGroupRef} id="travelling-particles" pointerEvents="none">
                {/* Leg 1: India -> UAE (2 dots) */}
                {[0, 1].map((pIdx) => (
                  <g
                    key={`part-leg1-${pIdx}`}
                    data-particle={`IN_TO_AE-${pIdx}`}
                    ref={(el) => {
                      leg1DotRefs.current[pIdx] = el;
                    }}
                    style={{ opacity: 0 }}
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r="3.0"
                      fill="#fff3c9"
                      style={{
                        filter:
                          "drop-shadow(0 0 5px #f1d796) drop-shadow(0 0 10px rgba(241, 215, 150, 0.6))",
                      }}
                    />
                  </g>
                ))}

                {/* Leg 2: UAE -> 6 Destinations (2 dots each) */}
                {exportCountries.map((c) =>
                  [0, 1].map((pIdx) => (
                    <g
                      key={`part-${c.iso2}-${pIdx}`}
                      data-particle={`${c.iso2}-${pIdx}`}
                      ref={(el) => {
                        if (el) spokeDotRefs.current.set(`${c.iso2}-${pIdx}`, el);
                      }}
                      style={{ opacity: 0 }}
                    >
                      <circle
                        cx="0"
                        cy="0"
                        r="3.0"
                        fill="#fff3c9"
                        style={{
                          filter:
                            "drop-shadow(0 0 5px #f1d796) drop-shadow(0 0 10px rgba(241, 215, 150, 0.6))",
                        }}
                      />
                    </g>
                  ))
                )}
              </g>
            )}

            {/* F. Port Nodes & Fixed Anchor Markers */}
            <g id="port-markers">
              {/* 1. Origin Gateway: India (Gujarat Coast) */}
              <g
                id="origin-marker"
                tabIndex={0}
                role="button"
                aria-label="View India origin details"
                className="cursor-pointer focus:outline-none"
                onClick={() => setActiveSelection({ type: "origin" })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveSelection({ type: "origin" });
                  }
                }}
              >
                <circle
                  cx={originGateway.x}
                  cy={originGateway.y}
                  r="7.0"
                  fill="#C9973F"
                  fillOpacity="0.25"
                />
                <circle
                  cx={originGateway.x}
                  cy={originGateway.y}
                  r="4.2"
                  fill="#F2C86E"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  filter="url(#softGlow)"
                />
                <circle cx={originGateway.x} cy={originGateway.y} r="1.8" fill="#071A33" />
              </g>

              {/* 2. Central Re-Export: UAE (Jebel Ali) */}
              <g
                id="hub-marker"
                tabIndex={0}
                role="button"
                aria-label="View UAE central transshipment details"
                className="cursor-pointer focus:outline-none"
                onClick={() => setActiveSelection({ type: "hub" })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveSelection({ type: "hub" });
                  }
                }}
              >
                <circle
                  cx={uaeCentralHub.x}
                  cy={uaeCentralHub.y}
                  r="10"
                  fill="#FFE082"
                  fillOpacity="0.2"
                  filter="url(#hubGlow)"
                />
                <circle
                  cx={uaeCentralHub.x}
                  cy={uaeCentralHub.y}
                  r="5.5"
                  fill="#F2C86E"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <circle cx={uaeCentralHub.x} cy={uaeCentralHub.y} r="2.4" fill="#040E1F" />
              </g>

              {/* 3. Six Destination Port Nodes */}
              {exportCountries.map((c) => {
                const isHovered = hoveredCountry?.iso2 === c.iso2;
                return (
                  <g
                    key={`marker-${c.iso2}`}
                    tabIndex={0}
                    role="button"
                    aria-label={`View ${c.displayName} port details`}
                    className="cursor-pointer focus:outline-none"
                    onClick={() => setActiveSelection({ type: "country", country: c })}
                    onMouseEnter={() => setHoveredCountry(c)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onFocus={() => setHoveredCountry(c)}
                    onBlur={() => setHoveredCountry(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveSelection({ type: "country", country: c });
                      }
                    }}
                  >
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r="6.5"
                      fill="#C9973F"
                      fillOpacity={isHovered ? 0.45 : 0.2}
                    />
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r="2.4"
                      fill="#F2C86E"
                      stroke="#FFFFFF"
                      strokeWidth="0.8"
                    />
                  </g>
                );
              })}
            </g>

            {/* G. Leader Lines & Floating Label Pills */}
            <g id="labels-and-badges">
              {/* 1. Origin Leader Line & Label */}
              {originGateway.leaderLine && (
                <line
                  x1={originGateway.leaderLine.x1}
                  y1={originGateway.leaderLine.y1}
                  x2={originGateway.leaderLine.x2}
                  y2={originGateway.leaderLine.y2}
                  stroke="rgba(242, 200, 110, 0.6)"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                />
              )}
              <g
                tabIndex={0}
                role="button"
                data-market="IN"
                aria-label="View India details"
                className="cursor-pointer focus:outline-none market-label-pill"
                onClick={() => setActiveSelection({ type: "origin" })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveSelection({ type: "origin" });
                  }
                }}
              >
                <g
                  className="floating-label-pill"
                  style={{ animationDelay: `${LABEL_FLOAT_DELAYS.IN}s` }}
                >
                  <rect
                    x={originGateway.labelX - originGateway.pillW / 2}
                    y={originGateway.labelY - 11}
                    width={originGateway.pillW}
                    height={originGateway.pillH}
                    rx="4"
                    fill="rgba(7, 26, 51, 0.92)"
                    stroke="#F2C86E"
                    strokeWidth="1.0"
                  />
                  <rect
                    x={originGateway.labelX - originGateway.pillW / 2 + 3}
                    y={originGateway.labelY - 8.5}
                    width="15"
                    height="13"
                    rx="2.5"
                    fill="#F2C86E"
                  />
                  <text
                    x={originGateway.labelX - originGateway.pillW / 2 + 10.5}
                    y={originGateway.labelY + 1.5}
                    textAnchor="middle"
                    fill="#071A33"
                    fontSize="7.0"
                    fontWeight="800"
                  >
                    IN
                  </text>
                  <text
                    x={originGateway.labelX + 8}
                    y={originGateway.labelY + 2.0}
                    textAnchor="middle"
                    fill="#F2C86E"
                    fontSize="8.5"
                    fontWeight="800"
                    letterSpacing="0.8px"
                  >
                    {originGateway.label}
                  </text>
                </g>
              </g>

              {/* 2. UAE Leader Line & Label */}
              {uaeCentralHub.leaderLine && (
                <line
                  x1={uaeCentralHub.leaderLine.x1}
                  y1={uaeCentralHub.leaderLine.y1}
                  x2={uaeCentralHub.leaderLine.x2}
                  y2={uaeCentralHub.leaderLine.y2}
                  stroke="rgba(255, 224, 130, 0.7)"
                  strokeWidth="0.9"
                  strokeDasharray="2 2"
                />
              )}
              <g
                tabIndex={0}
                role="button"
                data-market="AE"
                aria-label="View UAE details"
                className="cursor-pointer focus:outline-none market-label-pill"
                onClick={() => setActiveSelection({ type: "hub" })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveSelection({ type: "hub" });
                  }
                }}
              >
                <g
                  className="floating-label-pill"
                  style={{ animationDelay: `${LABEL_FLOAT_DELAYS.AE}s` }}
                >
                  <rect
                    x={uaeCentralHub.labelX}
                    y={uaeCentralHub.labelY - 12}
                    width={uaeCentralHub.pillW}
                    height={uaeCentralHub.pillH}
                    rx="4"
                    fill="rgba(201, 151, 63, 0.95)"
                    stroke="#FFE082"
                    strokeWidth="1.2"
                  />
                  <rect
                    x={uaeCentralHub.labelX + 3}
                    y={uaeCentralHub.labelY - 9}
                    width="15"
                    height="14"
                    rx="2.5"
                    fill="#040E1F"
                  />
                  <text
                    x={uaeCentralHub.labelX + 10.5}
                    y={uaeCentralHub.labelY + 1.5}
                    textAnchor="middle"
                    fill="#FFE082"
                    fontSize="7.0"
                    fontWeight="800"
                  >
                    AE
                  </text>
                  <text
                    x={uaeCentralHub.labelX + 20 + (uaeCentralHub.pillW - 22) / 2}
                    y={uaeCentralHub.labelY + 2.0}
                    textAnchor="middle"
                    fill="#040E1F"
                    fontSize="8.5"
                    fontWeight="800"
                    letterSpacing="0.5px"
                  >
                    {uaeCentralHub.label}
                  </text>
                </g>
              </g>

              {/* 3. Six Destination Leader Lines & Floating Labels */}
              {exportCountries.map((c) => {
                const isHovered = hoveredCountry?.iso2 === c.iso2;
                const delay = LABEL_FLOAT_DELAYS[c.iso2] ?? 1.2;
                let rectX = c.labelX;
                if (c.textAnchor === "middle") rectX = c.labelX - c.pillW / 2;
                else if (c.textAnchor === "end") rectX = c.labelX - c.pillW;

                return (
                  <g key={`label-group-${c.iso2}`} data-market={c.iso2} className="market-label-pill">
                    {/* Short Leader Line */}
                    {c.leaderLine && (
                      <line
                        x1={c.leaderLine.x1}
                        y1={c.leaderLine.y1}
                        x2={c.leaderLine.x2}
                        y2={c.leaderLine.y2}
                        stroke={isHovered ? "#FFE082" : "rgba(201, 151, 63, 0.55)"}
                        strokeWidth="0.75"
                        strokeDasharray="2 2"
                      />
                    )}

                    {/* Outer interactive group: handles hover, focus, click */}
                    <g
                      tabIndex={0}
                      role="button"
                      aria-label={`View export details for ${c.displayName}`}
                      className="cursor-pointer focus:outline-none"
                      onClick={() => setActiveSelection({ type: "country", country: c })}
                      onMouseEnter={() => setHoveredCountry(c)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onFocus={() => setHoveredCountry(c)}
                      onBlur={() => setHoveredCountry(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveSelection({ type: "country", country: c });
                        }
                      }}
                    >
                      {/* Inner wrapper with gentle 5s translateY floating animation */}
                      <g
                        className="floating-label-pill"
                        style={{ animationDelay: `${delay}s` }}
                      >
                        <rect
                          x={rectX}
                          y={c.labelY - 10}
                          width={c.pillW}
                          height={c.pillH}
                          rx="4"
                          fill={isHovered ? "rgba(242, 200, 110, 0.98)" : "rgba(7, 26, 51, 0.92)"}
                          stroke={isHovered ? "#FFE082" : "rgba(201, 151, 63, 0.55)"}
                          strokeWidth={isHovered ? "1.4" : "0.75"}
                          className="transition-colors duration-200"
                        />
                        <rect
                          x={rectX + 2.5}
                          y={c.labelY - 7.5}
                          width="15"
                          height="13"
                          rx="2.5"
                          fill={isHovered ? "rgba(4, 14, 31, 0.25)" : "rgba(201, 151, 63, 0.3)"}
                        />
                        <text
                          x={rectX + 10}
                          y={c.labelY + 2.0}
                          textAnchor="middle"
                          fill={isHovered ? "#040E1F" : "#F2C86E"}
                          fontSize="6.5"
                          fontWeight="800"
                        >
                          {c.iso2}
                        </text>
                        <text
                          x={rectX + 19 + (c.pillW - 21) / 2}
                          y={c.labelY + 2.4}
                          textAnchor="middle"
                          fill={isHovered ? "#040E1F" : "#F4F1EA"}
                          fontSize="7.8"
                          fontWeight={isHovered ? "800" : "600"}
                        >
                          {c.displayName}
                        </text>
                      </g>
                    </g>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Docked Info Panel on Desktop / Inline on Mobile */}
        <div className="w-full lg:w-[320px] shrink-0">
          <AnimatePresence mode="wait">
            {activeSelection ? (
              <motion.div
                key="active-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="relative rounded-2xl border border-[#C9973F]/40 bg-gradient-to-b from-[#071A33] to-[#051429] p-5 shadow-2xl backdrop-blur-md"
              >
                <button
                  type="button"
                  onClick={() => setActiveSelection(null)}
                  className="absolute right-3 top-3 rounded-lg p-1 text-[#D9DDE3] hover:bg-white/10 hover:text-white"
                  aria-label="Close detail panel"
                >
                  <X className="h-4 w-4" />
                </button>

                {activeSelection.type === "origin" && (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{originGateway.flag}</span>
                      <div>
                        <h4 className="font-display text-lg text-white font-bold">{originGateway.name}</h4>
                        <span className="text-[0.68rem] uppercase tracking-wider text-[#F2C86E] font-semibold">
                          {originGateway.role}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-[#D9DDE3]">
                      Primary commercial base on the Gujarat coast (Mundra & Kandla deepwater ports), routing Indian agricultural produce, spices, and stone directly into UAE.
                    </p>
                    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Primary Feeder Gateways:</span>
                        <span className="font-medium text-white">{originGateway.portName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Feeder Transit to UAE:</span>
                        <span className="font-medium text-[#F2C86E]">{legOneDays[0]}–{legOneDays[1]} Days</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeSelection.type === "hub" && (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{uaeCentralHub.flag}</span>
                      <div>
                        <h4 className="font-display text-lg text-white font-bold">{uaeCentralHub.name}</h4>
                        <span className="text-[0.68rem] uppercase tracking-wider text-amber-400 font-bold">
                          {uaeCentralHub.role}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-[#D9DDE3]">
                      Jebel Ali Port, Dubai serves as our central bonded transshipment facility. Every export cargo from India consolidates here before scheduled onward container departures to all 6 global markets.
                    </p>
                    <div className="mt-4 rounded-xl border border-gold/30 bg-gold/10 p-3 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[#F4F1EA]">Central Port:</span>
                        <span className="font-semibold text-white">{uaeCentralHub.portName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#F4F1EA]">Outgoing Corridors:</span>
                        <span className="font-semibold text-[#F2C86E]">6 Dedicated Ocean Lanes</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeSelection.type === "country" && (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{activeSelection.country.flag}</span>
                      <div>
                        <h4 className="font-display text-lg text-white font-bold">{activeSelection.country.displayName}</h4>
                        <span className="text-[0.68rem] uppercase tracking-wider text-[#F2C86E] font-semibold">
                          {activeSelection.country.regionLabel} Corridor via UAE
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs space-y-2.5">
                      <div>
                        <span className="text-muted-foreground block text-[0.65rem] uppercase">Port of Discharge:</span>
                        <span className="font-semibold text-white">{activeSelection.country.portName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[0.65rem] uppercase">Total Transit Schedule:</span>
                        <span className="font-semibold text-[#F2C86E] leading-relaxed block">
                          {getTransitText(activeSelection.country)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[0.65rem] uppercase mb-1">Primary Export Cargo:</span>
                        <div className="flex flex-wrap gap-1">
                          {activeSelection.country.topCargo.map((item) => (
                            <span key={item} className="rounded bg-black/40 px-2 py-0.5 text-[0.65rem] text-[#F4F1EA]">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSelection.type === "region" && (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{activeRegionMeta?.flag}</span>
                      <div>
                        <h4 className="font-display text-lg text-white font-bold">{activeRegionMeta?.label}</h4>
                        <span className="text-[0.68rem] uppercase tracking-wider text-[#F2C86E] font-semibold">
                          Maritime Corridor via UAE
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-[#D9DDE3]">
                      {activeRegionMeta?.description}
                    </p>
                    <div className="mt-4">
                      <span className="text-[0.65rem] uppercase text-muted-foreground tracking-wider block mb-2 font-semibold">
                        Served Markets in this Corridor:
                      </span>
                      <div className="space-y-1.5">
                        {activeSelection.regionKey === "gulf" ? (
                          <div className="rounded-lg bg-white/5 p-2 text-xs text-white flex items-center justify-between">
                            <span>🇦🇪 UAE</span>
                            <span className="text-[#F2C86E] text-[0.65rem]">Jebel Ali, Dubai</span>
                          </div>
                        ) : (
                          exportCountries
                            .filter((c) => c.region === activeSelection.regionKey)
                            .map((c) => (
                              <button
                                key={c.iso2}
                                type="button"
                                onClick={() => setActiveSelection({ type: "country", country: c })}
                                className="w-full rounded-lg bg-white/5 p-2 text-xs text-white hover:bg-white/10 flex items-center justify-between text-left transition-colors"
                              >
                                <span>{c.flag} {c.displayName}</span>
                                <span className="text-[#F2C86E] text-[0.65rem]">{c.portName.split("/")[0]}</span>
                              </button>
                            ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              // Default Standby Card
              <motion.div
                key="default-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-white/10 bg-[#071A33]/70 p-5 backdrop-blur-md text-xs space-y-4"
              >
                <div className="flex items-center gap-2 text-gold">
                  <PackageCheck className="h-4 w-4" />
                  <span className="font-semibold text-white tracking-wide">Route Details & Transit</span>
                </div>
                <p className="text-[#D9DDE3] leading-relaxed">
                  Hover or select any port marker, market label, or region filter to inspect vessel transit schedules, ports of discharge, and primary export cargo.
                </p>
                <div className="space-y-2 border-t border-white/10 pt-3 text-[0.72rem]">
                  <div className="flex items-center justify-between text-[#D9DDE3]">
                    <span>Origin Feeder:</span>
                    <span className="font-semibold text-[#F2C86E]">Gujarat Coast (India)</span>
                  </div>
                  <div className="flex items-center justify-between text-[#D9DDE3]">
                    <span>Central Gateway:</span>
                    <span className="font-semibold text-white">Jebel Ali (UAE)</span>
                  </div>
                  <div className="flex items-center justify-between text-[#D9DDE3]">
                    <span>Global Destinations:</span>
                    <span className="font-semibold text-white">6 Key Markets via UAE</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default WorldMap;
