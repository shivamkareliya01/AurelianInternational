import { useState } from "react";
import { POWDER_COLORS } from "@/data/powderColors";
import { categories, type Product } from "@/data/products";
import { cn } from "@/lib/utils";

interface PowderSwatchStripProps {
  className?: string;
  products?: Product[];
}

export function PowderSwatchStrip({ className, products }: PowderSwatchStripProps) {
  const powderCategory = categories.find((c) => c.slug === "dehydrated-powders");
  const powderList = products || powderCategory?.products || [];
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const activeMeta = hoveredSlug ? POWDER_COLORS[hoveredSlug] : null;
  const activeProduct = hoveredSlug ? powderList.find((p) => p.slug === hoveredSlug) : null;

  const scrollToProduct = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-[#C9973F]", "ring-offset-4");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-[#C9973F]", "ring-offset-4");
      }, 2000);
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#C9973F]/30 bg-[#071A33]/90 backdrop-blur-md p-4 sm:p-5 shadow-xl text-white relative overflow-hidden",
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#C9973F]/20">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#F2C86E] block font-sans">
            Botanical Color Spectrum
          </span>
          <h4 className="font-serif text-base sm:text-lg font-medium text-white flex items-center gap-2">
            <span>{powderList.length} Certified Dehydrated Powders</span>
            <span className="text-xs font-sans font-normal text-[#D9DDE3]/70">
              (Click any swatch to view)
            </span>
          </h4>
        </div>

        {/* Dynamic active swatch hover readout */}
        <div className="min-h-[28px] flex items-center gap-2 text-xs">
          {activeMeta && activeProduct ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E2A4F] border border-[#C9973F]/40 shadow-xs animate-in fade-in duration-150">
              <span
                className="h-3 w-3 rounded-full border border-white/50 shrink-0"
                style={{ backgroundColor: activeMeta.hex }}
              />
              <span className="font-semibold text-[#F2C86E] truncate max-w-[200px]">
                {activeProduct.name}
              </span>
              <span className="text-[11px] text-[#A8B2C1]">· {activeMeta.mesh}</span>
            </div>
          ) : (
            <span className="text-xs text-[#A8B2C1] italic">
              Hover over a shade to preview botanical source
            </span>
          )}
        </div>
      </div>

      {/* 40-Swatch Color Grid / Strip */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 sm:gap-2.5">
        {powderList.map((p) => {
          const meta = POWDER_COLORS[p.slug];
          const hex = meta?.hex || "#C9973F";
          const isHovered = hoveredSlug === p.slug;

          return (
            <a
              key={p.slug}
              href={`#${p.slug}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToProduct(p.slug);
              }}
              onMouseEnter={() => setHoveredSlug(p.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              title={`${p.name} (${meta?.mesh || "Mesh 80–100"})`}
              className={cn(
                "group relative h-7 w-7 sm:h-8 sm:w-8 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 shadow-sm",
                isHovered
                  ? "scale-125 z-20 ring-2 ring-[#F2C86E] ring-offset-2 ring-offset-[#071A33] shadow-lg"
                  : "hover:scale-115 hover:z-10 ring-1 ring-black/25",
              )}
              style={{
                backgroundColor: hex,
                boxShadow: isHovered
                  ? `0 0 14px ${hex}cc`
                  : "0 2px 4px rgba(0,0,0,0.25)",
              }}
              aria-label={`Jump to ${p.name}`}
            >
              {/* Very fine border to prevent light colors (White Onion, Coconut Milk) from washing out */}
              <span className="absolute inset-0 rounded-full border border-black/15 pointer-events-none" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
