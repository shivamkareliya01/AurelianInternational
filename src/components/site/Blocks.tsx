import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { certifications, faqs } from "@/data/content";
import { cn } from "@/lib/utils";
import { CertLogo } from "@/components/site/CertLogos";

export function FaqList({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className={`divide-y ${dark ? "divide-white/10 border-white/10" : "divide-[#E3E7EE] border-[#E3E7EE]"} border-y`}>
      {faqs.map((f, i) => (
        <div key={f.q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-6 py-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg"
          >
            <span className={`font-display text-xl md:text-2xl ${dark ? "text-white" : "text-[#071A33]"}`}>{f.q}</span>
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border ${dark ? "border-white/20" : "border-[#C9973F]/40"} text-[#C9973F]`}>
              {open === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </span>
          </button>
          <motion.div
            initial={false}
            animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
            className="overflow-hidden"
          >
            <p className={`max-w-3xl pb-6 leading-relaxed ${dark ? "text-[#9aaec4]" : "text-muted-foreground"}`}>{f.a}</p>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

export function CertGrid() {
  const threeCerts = [...certifications, ...certifications];
  const logoTrack = threeCerts.map((c, i) => {
    const isRound = c.code === "SPICES BOARD" || c.code === "ISO 9001" || c.code === "SPICES" || c.code === "ISO";
    return (
      <div
        key={i}
        title={`${c.name} — ${c.issuer}`}
        className="flex-shrink-0 flex items-center justify-center mx-6 sm:mx-10 h-28 w-44 sm:h-36 sm:w-56 bg-transparent transition-all duration-300 group"
      >
        <div className="flex items-center justify-center w-full h-full">
          <CertLogo
            code={c.code}
            className={cn(
              "object-contain transition-transform duration-300 group-hover:scale-110",
              isRound
                ? "h-24 w-24 sm:h-32 sm:w-32 max-h-full"
                : "h-20 sm:h-28 w-full max-h-full max-w-full"
            )}
          />
        </div>
      </div>
    );
  });

  return (
    <div className="relative overflow-hidden py-4">
      {/* Left fade */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
        style={{ background: "linear-gradient(to right, #FAF8F3 0%, transparent 100%)" }}
      />
      {/* Right fade */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
        style={{ background: "linear-gradient(to left, #FAF8F3 0%, transparent 100%)" }}
      />

      {/*
        FOUR identical copies — total = 4× one set.
        At any translateX between -50% and 0%, two copies (= 2× set width)
        are always on screen, guaranteeing zero blank gaps.
      */}
      <div className="cert-marquee-track">
        <div className="flex items-center flex-shrink-0">{logoTrack}</div>
        <div className="flex items-center flex-shrink-0" aria-hidden="true">{logoTrack}</div>
        <div className="flex items-center flex-shrink-0" aria-hidden="true">{logoTrack}</div>
        <div className="flex items-center flex-shrink-0" aria-hidden="true">{logoTrack}</div>
      </div>
    </div>
  );
}


