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
  const logoTrack = certifications.map((c, i) => (
    <div
      key={i}
      className="flex-shrink-0 flex items-center gap-3.5 mx-3 px-4 py-3 rounded-2xl bg-white border border-[#E3E7EE] shadow-[0_2px_12px_rgba(7,26,51,0.04)] hover:border-[#C9973F]/60 hover:shadow-[0_6px_25px_rgba(201,151,63,0.12)] transition-all duration-300 group"
    >
      <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-[#FAF8F3] border border-[#E8E4DA] p-1.5 group-hover:scale-105 transition-transform duration-300">
        <CertLogo code={c.code} className="h-full w-full object-contain" />
      </div>
      <div className="min-w-0 pr-1">
        <div className="flex items-center gap-1.5">
          <span className="font-display font-bold text-xs text-[#071A33] tracking-wider uppercase">
            {c.code}
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active
          </span>
        </div>
        <p className="text-xs font-medium text-[#2C3E55] truncate max-w-[170px] mt-0.5">
          {c.name}
        </p>
        <p className="text-[10px] text-[#718096] truncate max-w-[170px]">
          {c.issuer.split("(")[0]}
        </p>
      </div>
    </div>
  ));

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


