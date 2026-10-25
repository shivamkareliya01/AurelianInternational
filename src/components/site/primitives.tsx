import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const btn = {
  gold: "inline-flex min-h-[44px] max-w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#9A6B1F] via-[#F2C86E] to-[#C9973F] px-6 py-3 text-sm font-semibold tracking-wide text-[#071A33] shadow-md transition-all duration-300 hover:shadow-[0_0_22px_rgba(201,151,63,0.45)] hover:-translate-y-0.5 btn-shine cursor-pointer active:translate-y-0",
  outlineLight:
    "inline-flex min-h-[44px] max-w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-transparent px-6 py-3 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:border-[#F2C86E] hover:text-[#F2C86E] hover:bg-white/5 btn-shine cursor-pointer",
  outline:
    "inline-flex min-h-[44px] max-w-full items-center justify-center gap-2 rounded-full border border-[#C9973F]/40 bg-transparent px-6 py-3 text-sm font-medium tracking-wide text-[#071A33] transition-all duration-300 hover:border-[#C9973F] hover:bg-[#071A33] hover:text-white btn-shine cursor-pointer",
  navy: "inline-flex min-h-[44px] max-w-full items-center justify-center gap-2 rounded-full bg-[#071A33] px-6 py-3 text-sm font-medium tracking-wide text-[#F4F1EA] shadow-md transition-all duration-300 hover:bg-[#040E1F] hover:shadow-lg btn-shine cursor-pointer",
  forest:
    "inline-flex min-h-[44px] max-w-full items-center justify-center gap-2 rounded-full bg-[#071A33] px-6 py-3 text-sm font-medium tracking-wide text-[#F4F1EA] shadow-md transition-all duration-300 hover:bg-[#040E1F] hover:shadow-lg btn-shine cursor-pointer", // compatibility alias
};

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  text,
  align = "left",
  dark,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: string | undefined;
  align?: "left" | "center" | undefined;
  dark?: boolean | undefined;
  className?: string | undefined;
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2
        className={cn(
          "mt-4 text-[clamp(1.85rem,5.5vw,2.5rem)] leading-[1.1] md:text-6xl md:leading-[1.05]",
          dark ? "text-white" : "text-[#071A33]",
        )}
      >
        {title}
      </h2>
      {text && (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed md:text-lg",
            dark ? "text-[#D9DDE3]" : "text-muted-foreground",
          )}
        >
          {text}
        </p>
      )}
    </Reveal>
  );
}

export function Counter({
  to,
  suffix = "",
  className,
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (n) => setV(Math.round(n)),
    });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className={className}>
      {v}
      {suffix}
    </span>
  );
}

export function GoldRule({ className }: { className?: string }) {
  return <div className={cn("h-px w-16 bg-[#C9973F]", className)} />;
}

export function InfinityWatermark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 100"
      className={cn("pointer-events-none select-none", className)}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="infinityWatermarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9A6B1F" />
          <stop offset="45%" stopColor="#F2C86E" />
          <stop offset="75%" stopColor="#E7EAEE" />
          <stop offset="100%" stopColor="#BFC5CE" />
        </linearGradient>
      </defs>
      <path
        d="M 100 50 C 120 20, 170 20, 170 50 C 170 80, 120 80, 100 50 C 80 20, 30 20, 30 50 C 30 80, 80 80, 100 50 Z"
        stroke="url(#infinityWatermarkGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
