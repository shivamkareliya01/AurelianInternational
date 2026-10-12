import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const btn = {
  gold: "inline-flex items-center justify-center gap-2 rounded-full bg-gold-gradient px-7 py-3.5 text-sm font-medium tracking-wide text-forest-deep shadow-soft transition-all duration-300 hover:shadow-lift hover:-translate-y-0.5",
  outlineLight: "inline-flex items-center justify-center gap-2 rounded-full border border-on-forest/40 px-7 py-3.5 text-sm font-medium tracking-wide text-on-forest transition-all duration-300 hover:border-gold hover:text-gold-soft",
  outline: "inline-flex items-center justify-center gap-2 rounded-full border border-forest/25 px-7 py-3.5 text-sm font-medium tracking-wide text-forest transition-all duration-300 hover:border-gold hover:bg-forest hover:text-on-forest",
  forest: "inline-flex items-center justify-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-medium tracking-wide text-on-forest transition-all duration-300 hover:bg-forest-deep",
};

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ eyebrow, title, text, align = "left", dark }: { eyebrow: string; title: ReactNode; text?: string; align?: "left" | "center"; dark?: boolean }) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className={cn("mt-4 text-4xl leading-[1.05] md:text-6xl", dark ? "text-on-forest" : "text-forest")}>{title}</h2>
      {text && <p className={cn("mt-5 text-base leading-relaxed md:text-lg", dark ? "text-on-forest-muted" : "text-muted-foreground")}>{text}</p>}
    </Reveal>
  );
}

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: "easeOut", onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

export function GoldRule({ className }: { className?: string }) {
  return <div className={cn("h-px w-16 bg-gold", className)} />;
}
