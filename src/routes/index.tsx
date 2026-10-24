import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Globe,
  Headset,
  Layers,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import shipmentWebp from "@/assets/hero-shipment.webp";
import spicesWebp from "@/assets/hero-spices.webp";
import tilesWebp from "@/assets/hero-tiles.webp";
import agriWebp from "@/assets/hero-agriculture.webp";
import farm from "@/assets/farm.jpg";
import spices from "@/assets/spices.jpg";
import port from "@/assets/port.jpg";
import storyShip from "@/assets/our-story-ship.jpg";
import storyHarvest from "@/assets/our-story-harvest.jpg";
import warehouse from "@/assets/warehouse.jpg";
import produce from "@/assets/produce.jpg";
import { categories, allProducts } from "@/data/products";
import { testimonials, whyUs } from "@/data/content";
import { site } from "@/data/site";
import { Counter, InfinityWatermark, Reveal, SectionHead, btn } from "@/components/site/primitives";
import { WorldMap } from "@/components/site/WorldMap";
import { TradeRouteMap } from "@/components/site/TradeRouteMap";
import { CertGrid, FaqList } from "@/components/site/Blocks";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { cn } from "@/lib/utils";

const heroSlides = [
  {
    src: shipmentWebp,
    placeholder:
      "data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAADQBACdASogABIAPxFyr1AsJqQisAgBgCIJQBUegsaGJGzL+Uxec9izPIWOkLvsAAD+ud1oQhxWQlvbjW/scmJBZyCP7O0UC5Tfqsx3hfGCLlr0tZPj0Td8pgx0jzInDB/BlDkMJiYgjgGUBQZlV/AAAAA=",
    alt: "Container ship at sea at twilight blue hour with deep blue water",
    label: "Port & Vessel Dispatch",
    tagline: "Direct Port Logistics (Mundra & Kandla)",
    filter: "brightness(0.70) contrast(1.15) saturate(1.1)",
  },
  {
    src: spicesWebp,
    placeholder:
      "data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAADQBACdASogABIAPxFwrVAsJiQisAgBgCIJYwDA3CHfCQeWgDBd8tuWiu3GpYuuAAD+8MheC7jwSJYXvV+SziTMBMkPqRxnxotdCcg8+Ga7hMqj5UaTkrbYHIWrwvr354Eg9S2RMUpEhT/rQQQt75OkIr0zieVcHnVtkC+gAAA=",
    alt: "Vibrant Indian spices in brass bowls on dark textured stone and wood",
    label: "Spices & Botanicals",
    tagline: "Unjha Cumin, Guntur Chilli & Alleppey Turmeric",
    filter: "brightness(0.70) contrast(1.15) saturate(1.1)",
  },
  {
    src: tilesWebp,
    placeholder: "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAwCdASogABIAPxF6rVIsJ6QisAgBgCIJZACdMoAA/uhxr/V2qSQmOXQ4eKjbOjBGx0pQBvPv3+CxiTCIGIj1QAAA",
    alt: "Luxury Glazed Vitrified Tiles in a premium architectural interior showroom",
    label: "Luxury Vitrified Tiles",
    tagline: "Morbi GVT / PGVT & High-Gloss Tiles",
    filter: "brightness(0.66) contrast(1.18) saturate(1.05)",
  },
  {
    src: agriWebp,
    placeholder:
      "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAADQAwCdASogABIAPxFyr1AsJqQisAgBgCIJQBbZA+lr6Ao/j3SSbYwA3f4A3WFQr04jseSEIG8fD+McswqNb/NQro8YXOqPN67RxdrXindNzCwnCCG8nuAfBvZRU0QnlzkardZWUVkAXJ9QAAA=",
    alt: "Scenic agricultural fields in deep emerald green under warm morning sunlight",
    label: "Agro Staples & Basmati",
    tagline: "1121 & 1509 Steam / Sella Basmati Rice",
    filter: "brightness(0.70) contrast(1.15) saturate(1.1)",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${site.name} — India's Finest, Delivered Worldwide` },
      {
        name: "description",
        content:
          "Premium Indian agricultural produce, spices, and botanical powders — sourced, certified and shipped to your port.",
      },
      { property: "og:title", content: `${site.name} — India's Finest, Delivered Worldwide` },
      {
        property: "og:description",
        content:
          "Premium agricultural produce, spices, and botanical powders from India — certified and shipped worldwide.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preload", href: shipmentWebp, as: "image" },
      { rel: "preload", href: spicesWebp, as: "image" },
      { rel: "preload", href: tilesWebp, as: "image" },
      { rel: "preload", href: agriWebp, as: "image" },
    ],
  }),
  component: Home,
});

function Hero() {
  const [i, setI] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setI((n) => (n + 1) % heroSlides.length);
    }, 5500);
  };

  useEffect(() => {
    setHasMounted(true);
    startTimer();

    // Preload all slides into browser cache
    heroSlides.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goToSlide = (idx: number) => {
    setI(idx);
    startTimer();
  };

  const currentSlide = heroSlides[i] ?? heroSlides[0]!;

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[#040E1F] text-[#F4F1EA]"
    >
      {/* Background Slideshow with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: hasMounted ? 0 : 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: hasMounted ? 1.0 : 0, ease: "easeInOut" },
              scale: { duration: 6.0, ease: "linear" },
            }}
            className="absolute inset-0 overflow-hidden"
          >
            {/* Blur-up placeholder */}
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center filter blur-xl scale-110"
              style={{ backgroundImage: `url(${currentSlide.placeholder})` }}
            />
            <img
              src={currentSlide.src}
              alt={currentSlide.alt}
              fetchPriority={i === 0 ? "high" : "auto"}
              loading={i === 0 ? "eager" : "lazy"}
              decoding={i === 0 ? "sync" : "async"}
              style={{
                filter: currentSlide.filter ?? "brightness(0.70) contrast(1.15) saturate(1.1)",
              }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Ambient Lighting Orbs */}
      <div className="hero-ambient-orb-gold -top-24 -left-24 z-10 opacity-40" />
      <div className="hero-ambient-orb-navy top-1/3 -right-32 z-10 opacity-50" />

      {/* Cinematic Gradient Overlays: Rich Deep Sapphire to Transparent */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to right, rgba(4, 14, 31, 0.92) 0%, rgba(4, 14, 31, 0.72) 40%, rgba(4, 14, 31, 0.3) 80%, rgba(4, 14, 31, 0.15) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: "linear-gradient(to top, rgba(4, 14, 31, 0.95) 0%, rgba(4, 14, 31, 0.4) 25%, transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 20%, rgba(201, 151, 63, 0.14) 0%, transparent 60%)",
        }}
      />

      {/* Hero Main Content */}
      <div className="container-x relative z-20 flex flex-1 flex-col justify-center pt-24 pb-6 sm:pt-36 sm:pb-14 md:pt-40">
        {/* Live Authority Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-fit"
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-[#C9973F]/40 bg-[#071A33]/85 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-semibold tracking-wider text-[#F2C86E] shadow-[0_4px_25px_rgba(0,0,0,0.4)] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#25D366]" />
            </span>
            <span>PREMIER INDIAN EXPORT HOUSE</span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-white/85 hidden xs:inline">MORBI, GUJARAT, INDIA</span>
            <span className="h-3 w-px bg-white/20 hidden md:inline" />
            <span className="text-[#F2C86E] hidden md:inline">APEDA · ISO · SPICES BOARD</span>
          </div>
        </motion.div>

        {/* Grand Headline with Golden Metallic Emphasis */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9 }}
          className="mt-4 sm:mt-6 max-w-5xl text-[clamp(2.1rem,7.2vw,4.5rem)] leading-[1.04] text-white md:text-8xl md:leading-[0.96] lg:text-[6.5rem] tracking-tight font-display font-medium"
        >
          India's Finest,{" "}
          <span className="relative inline-block">
            <em className="italic bg-gradient-to-r from-[#F2C86E] via-[#FFF3D1] to-[#C9973F] bg-clip-text text-transparent drop-shadow-[0_2px_30px_rgba(201,151,63,0.45)]">
              Delivered
            </em>
            <svg
              className="absolute -bottom-1.5 left-0 w-full h-3 text-[#C9973F]/75 pointer-events-none"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
            >
              <path d="M0,9 Q50,0 100,9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>{" "}
          Worldwide.
        </motion.h1>

        {/* Subtitle & Value Proposition */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-lg text-[#D9DDE3] leading-relaxed font-normal"
          style={{ textShadow: "0 2px 14px rgba(0, 0, 0, 0.45)" }}
        >
          Premium agricultural commodities, exotic whole spices, dehydrated botanical powders, and export-grade ceramic tiles — sourced directly, quality-certified, and loaded onto ocean vessels with end-to-end transparency.
        </motion.p>

        {/* Trust Proof Badges Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.8 }}
          className="mt-4 sm:mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] sm:text-xs text-white/90"
        >
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-[#F2C86E]" />
            <span>SGS / Geo-Chem Inspected</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-[#F2C86E]" />
            <span>Direct Mundra & Kandla Loading</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-[#F2C86E]" />
            <span>Confirmed L/C & CAD Accepted</span>
          </div>
        </motion.div>

        {/* High-Impact CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-4 w-full"
        >
          {/* Primary High-Luster Gold Button */}
          <Link
            to="/products"
            className="gold-btn-luxury inline-flex min-h-[44px] sm:min-h-[48px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#9A6B1F] via-[#F2C86E] to-[#C9973F] px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-bold tracking-wide text-[#071A33] shadow-lg cursor-pointer w-full sm:w-auto"
          >
            <span>Explore {allProducts.length} Export Commodities</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* 2-Column Responsive Grid on Mobile for Secondary + WhatsApp */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-4 w-full sm:w-auto">
            <Link
              to="/contact"
              className="inline-flex min-h-[44px] sm:min-h-[48px] items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-md px-3.5 sm:px-7 py-2.5 sm:py-3.5 text-xs sm:text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:border-[#F2C86E] hover:text-[#F2C86E] hover:bg-white/15 cursor-pointer shadow-md text-center"
            >
              <span>Request Quote</span>
            </Link>

            <a
              href={`https://wa.me/${site.whatsapp}?text=Hello%20Aurelian%20International,%20I%20am%20interested%20in%20requesting%20an%20export%20quotation.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[44px] sm:min-h-[48px] items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 px-3.5 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 backdrop-blur-md shadow-sm text-center"
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0" />
              <span>WhatsApp Desk</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Floating Bottom Section: Slide Switcher Tabs + Glass Stats Capsule */}
      <div className="container-x relative z-20 pb-5 sm:pb-8 md:pb-12 pt-2 flex flex-col gap-4">
        {/* Slide Switcher Tabs with Visual Labels */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2.5 sm:pb-3">
          <div
            className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar scrollbar-none py-1 -mx-4 px-4 sm:mx-0 sm:px-0 w-full sm:w-auto flex-nowrap"
            role="tablist"
            aria-label="Hero Slides"
          >
            {heroSlides.map((s, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={i === idx}
                aria-label={`Jump to slide ${idx + 1}: ${s.label}`}
                onClick={() => goToSlide(idx)}
                className={cn(
                  "group relative flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap",
                  i === idx
                    ? "bg-[#071A33]/90 text-[#F2C86E] border border-[#C9973F]/70 shadow-md backdrop-blur-md"
                    : "bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white border border-white/10"
                )}
              >
                <span className="font-mono text-[10px] text-[#C9973F]">0{idx + 1}</span>
                <span className="whitespace-nowrap">{s.label}</span>
                {/* Active Progress Fill Bar */}
                {i === idx && (
                  <span className="relative block h-1 w-6 sm:w-12 overflow-hidden rounded-full bg-white/20 ml-1">
                    <motion.span
                      key={`progress-${i}`}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5.5, ease: "linear" }}
                      className="absolute inset-y-0 left-0 bg-[#F2C86E] shadow-[0_0_8px_rgba(242,200,110,0.8)]"
                    />
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Scroll Down Cue */}
          <div className="hidden lg:flex items-center gap-2 text-white/70">
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans text-[#F2C86E] font-semibold">
              SCROLL DOWN
            </span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4 text-[#F2C86E]" />
            </motion.div>
          </div>
        </div>

        {/* Grand Floating Glass Stats Capsule */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.9 }}
          className="w-full rounded-2xl sm:rounded-3xl border border-[#C9973F]/40 bg-[#071A33]/80 p-4 sm:p-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.55)] grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:divide-x divide-white/10"
        >
          {[
            {
              icon: Globe,
              value: "6",
              label: "Global Trade Hubs",
              desc: "Middle East, Europe, ASEAN & Americas",
            },
            {
              icon: Layers,
              value: "5",
              label: "Certified Divisions",
              desc: "Agro, Spices, Powders, Produce & Tiles",
            },
            {
              icon: Boxes,
              value: String(allProducts.length),
              label: "Export Commodities",
              desc: "SGS / Geo-Chem Assayed Specs",
            },
            {
              icon: ShieldCheck,
              value: "100%",
              label: "Specification Assurance",
              desc: "Port Clearance & Marine Insurance",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={cn(
                  "flex items-start gap-2.5 sm:gap-4",
                  idx > 0 && "lg:pl-6",
                )}
              >
                <div className="mt-1 flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#C9973F]/25 to-transparent border border-[#C9973F]/40 text-[#F2C86E] shadow-sm">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#F2C86E] to-[#C9973F] bg-clip-text text-transparent">
                      {item.value}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-slate-300 hidden sm:block truncate">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}


function AboutPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-25, 45]);
  return (
    <section className="section-y bg-ivory relative overflow-hidden">
      {/* Subtle large gold infinity watermark */}
      <InfinityWatermark className="hidden sm:block absolute -right-24 top-1/2 -translate-y-1/2 w-[38rem] h-[19rem] text-[#C9973F] opacity-[0.04]" />
      <div className="container-x grid items-center gap-10 lg:gap-16 lg:grid-cols-2 relative z-10 min-w-0">
        <div ref={ref} className="relative h-[22rem] sm:h-[28rem] md:h-[38rem] w-full max-w-full overflow-hidden rounded-3xl">
          <motion.img
            style={{ y: y1 }}
            src={farm}
            alt="Lush emerald green Indian farmland and terraced rice paddies"
            loading="lazy"
            className="absolute left-0 top-0 h-[80%] w-[74%] rounded-3xl object-cover shadow-lift"
          />
          <motion.img
            style={{ y: y2 }}
            src={storyShip}
            alt="International container vessel sailing at golden sunset"
            loading="lazy"
            className="absolute bottom-0 right-0 h-[56%] w-[56%] rounded-3xl border-4 sm:border-8 border-ivory object-cover shadow-lift"
          />
        </div>
        <div className="min-w-0">
          <SectionHead
            eyebrow="The Aurelian Standard"
            title={
              <>
                Built on principle. <em className="text-gold">Directed toward permanence.</em>
              </>
            }
            text="We connect the world's finest producers with discerning markets, moving goods across borders with precision, discretion, and an uncompromising regard for every commitment we make. Every shipment is conducted as though our reputation were already a century old."
          />
          <Reveal delay={0.15} className="mt-10 grid grid-cols-2 border-t hairline">
            {[
              ["Established", site.established],
              ["Headquarters", `${site.city}, India`],
              ["Markets", "7 Global Markets"],
              ["Active SKUs", `${allProducts.length} items`],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={cn(
                  "py-6",
                  i % 2 === 1 && "border-l hairline pl-6",
                  i > 1 && "border-t hairline",
                )}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{k}</p>
                <p className="mt-2 font-display text-2xl text-[#071A33]">{v}</p>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.25}>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 text-[#071A33] underline decoration-gold underline-offset-8 hover:text-gold font-medium"
            >
              Explore Our Story & Infrastructure <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* Category Bento Card Component */
function CategoryBentoCard({
  category,
  isLarge,
  isWide,
}: {
  category: (typeof categories)[number];
  isLarge?: boolean;
  isWide?: boolean;
}) {
  return (
    <Link
      to="/products/$category"
      params={{ category: category.slug }}
      className="group relative block h-full w-full overflow-hidden rounded-3xl border border-gold/25 shadow-soft transition-all duration-500 hover:shadow-lift"
    >
      {/* Background image with hover zoom 1.06 */}
      <img
        src={category.image}
        alt={category.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />

      {/* Deep gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#040E1F]/95 via-[#040E1F]/45 to-transparent" />

      {/* Top Tag */}
      <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
        <span className="rounded-full border border-gold/40 bg-[#040E1F]/80 px-3 py-1 font-sans text-[11px] font-medium tracking-wider text-gold-soft uppercase backdrop-blur-md">
          {category.products.length} Products
        </span>
      </div>

      {/* Bottom Content */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8 text-[#F4F1EA] flex flex-col justify-end">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-soft font-sans mb-1">
              {category.headline}
            </p>
            <h3
              className={cn(
                "leading-tight text-white",
                isLarge
                  ? "text-3xl md:text-5xl"
                  : isWide
                    ? "text-2xl md:text-3xl"
                    : "text-2xl md:text-3xl",
              )}
            >
              {category.name}
            </h3>
            <p
              className={cn(
                "mt-2 text-xs md:text-sm text-[#D9DDE3] line-clamp-2 leading-relaxed max-w-xl",
                !isLarge && !isWide && "hidden sm:block",
              )}
            >
              {category.blurb}
            </p>
          </div>

          {/* Gold sliding Explore arrow */}
          <div className="shrink-0 flex items-center gap-1 text-gold-soft font-medium text-sm font-sans transition-all duration-300 group-hover:text-white">
            <span className="hidden sm:inline opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              Explore
            </span>
            <div className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 bg-[#071A33]/80 backdrop-blur-sm transition-all duration-300 group-hover:bg-gold group-hover:text-[#040E1F] group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Categories() {
  const ceramicCategory = categories.find((c) => c.slug === "ceramic-tiles") ?? categories[5];
  const spicesCategory = categories.find((c) => c.slug === "spices") ?? categories[3];
  const dehydratedCategory = categories.find((c) => c.slug === "dehydrated-powders") ?? categories[4];

  return (
    <section className="section-y bg-[#FAF8F3] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9973F]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-x relative z-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-12">
          <SectionHead
            eyebrow="Export Portfolios"
            title="Six specialized divisions. Standardized excellence."
            text="Direct sourcing, optical sorting, and customized export packing across India's premier agricultural, spice, fresh produce, and architectural tile belts."
          />
          <Link to="/products" className={btn.outline}>
            Explore Complete Catalogue <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 6-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card 0: Agriculture (Hero bento tile) */}
          <div className="md:col-span-7 h-[22rem] sm:h-[26rem] md:h-[30rem]">
            <CategoryBentoCard category={categories[0]!} isLarge />
          </div>

          {/* Cards 1 & 2: Vegetables & Fruits (Right column stacked) */}
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-5">
            <div className="h-[14rem] md:h-[14.25rem]">
              <CategoryBentoCard category={categories[1]!} />
            </div>
            <div className="h-[14rem] md:h-[14.25rem]">
              <CategoryBentoCard category={categories[2]!} />
            </div>
          </div>

          {/* Row 2: Spices (4 cols), Dehydrated Powders (4 cols), Ceramic Tiles (4 cols) */}
          {spicesCategory && (
            <div className="md:col-span-4 h-[16rem] sm:h-[19rem] md:h-[22rem]">
              <CategoryBentoCard category={spicesCategory} isWide />
            </div>
          )}

          {dehydratedCategory && (
            <div className="md:col-span-4 h-[16rem] sm:h-[19rem] md:h-[22rem]">
              <CategoryBentoCard category={dehydratedCategory} isWide />
            </div>
          )}

          {ceramicCategory && (
            <div className="md:col-span-4 h-[16rem] sm:h-[19rem] md:h-[22rem]">
              <CategoryBentoCard category={ceramicCategory} isWide />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


const whyIcons = [Boxes, Tag, FileCheck2, Headset];
const whyGradients = [
  "from-[#C9973F]/20 to-[#071A33]/0",
  "from-[#1F4A72]/30 to-[#071A33]/0",
  "from-[#25D366]/10 to-[#071A33]/0",
  "from-[#C9973F]/15 to-[#071A33]/0",
];

function WhyUs() {
  return (
    <section className="section-y bg-[#040E1F] text-[#F4F1EA] relative overflow-hidden">
      {/* Rich multi-layered background */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(14,42,79,0.8) 0%, transparent 65%), radial-gradient(ellipse 60% 80% at 80% 20%, rgba(201,151,63,0.07) 0%, transparent 60%)" }} />
      <div className="pointer-events-none absolute inset-0 luxury-grain opacity-20" />
      <div className="container-x relative z-10">
        <SectionHead
          dark
          eyebrow="Why Choose Us"
          title="The details are the difference."
          text="Everything a serious importer needs, handled by one accountable partner with verified on-the-ground infrastructure."
        />
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((w, i) => {
            const Icon = whyIcons[i] ?? Boxes;
            const grad = whyGradients[i] ?? whyGradients[0];
            return (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0E2A4F]/80 to-[#071A33]/90 p-7 sm:p-8 transition-all duration-500 hover:border-[#C9973F]/50 hover:shadow-[0_8px_40px_rgba(201,151,63,0.15)] min-w-0 backdrop-blur-sm"
              >
                {/* Hover gradient wash */}
                <div className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                {/* Icon with glow container */}
                <div className="relative z-10 mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C9973F]/30 bg-gradient-to-br from-[#C9973F]/20 to-transparent shadow-[0_0_20px_rgba(201,151,63,0.15)] group-hover:shadow-[0_0_30px_rgba(201,151,63,0.3)] transition-shadow duration-500">
                  <Icon className="h-7 w-7 text-[#F2C86E]" strokeWidth={1.3} />
                </div>
                {/* Gold accent line */}
                <div className="relative z-10 h-px w-8 bg-gradient-to-r from-[#C9973F] to-transparent mb-4 group-hover:w-16 transition-all duration-500" />
                <h3 className="relative z-10 text-xl sm:text-2xl font-display text-white mb-3">{w.title}</h3>
                <p className="relative z-10 text-sm leading-relaxed text-[#9aaec4]">{w.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const exportSteps = [
  {
    step: "01",
    title: "Sourcing",
    desc: "Direct farm-gate and cooperative procurement across Maharashtra, Punjab, Gujarat & Rajasthan with complete lot traceability.",
  },
  {
    step: "02",
    title: "Quality Check",
    desc: "Multi-stage NABL lab assays for moisture, grain length, purity, and strict pesticide residue compliance before acceptance.",
  },
  {
    step: "03",
    title: "Packaging",
    desc: "Food-grade poly bags, vacuum tins, customized retail pouches, or multi-wall bulk bags tailored to buyer specifications.",
  },
  {
    step: "04",
    title: "Documentation",
    desc: "Phytosanitary, Certificate of Origin, Bill of Lading, and SGS inspection certificates processed with zero discrepancies.",
  },
  {
    step: "05",
    title: "Logistics",
    desc: "Guaranteed container allocations with Maersk, MSC & CMA CGM shipping from Nhava Sheva (JNPT) and Mundra ports.",
  },
  {
    step: "06",
    title: "Delivery",
    desc: "Scheduled discharge and port clearance support at 25+ global gateway ports across UK, EU, USA, Middle East and Asia.",
  },
];

function Process() {
  return (
    <section className="section-y bg-[#FAF8F3] relative overflow-hidden border-y border-[#C9973F]/20">
      {/* Subtle luxury grain and ambient warm accent */}
      <div className="pointer-events-none absolute inset-0 luxury-grain opacity-10" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(201,151,63,0.08) 0%, transparent 70%)" }}
      />

      <div className="container-x relative z-10">
        <SectionHead
          eyebrow="Export Methodology"
          title="From farm gate to your port."
          text="A six-stage quality-assured workflow engineered to eliminate demurrage, cargo rejection, and transit discrepancies."
          align="center"
        />

        <div className="relative mt-20">
          {/* Animated Connecting Line that draws on scroll */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className="absolute left-6 right-6 top-7 hidden h-0.5 origin-left lg:block"
            style={{ background: "linear-gradient(90deg, transparent, rgba(201,151,63,0.3) 10%, rgba(201,151,63,0.85) 50%, rgba(201,151,63,0.3) 90%, transparent)" }}
          />
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className="absolute bottom-6 left-7 top-6 w-0.5 origin-top lg:hidden"
            style={{ background: "linear-gradient(180deg, transparent, rgba(201,151,63,0.3) 10%, rgba(201,151,63,0.85) 50%, rgba(201,151,63,0.3) 90%, transparent)" }}
          />

          <ol className="grid gap-10 lg:grid-cols-6 lg:gap-5">
            {exportSteps.map((s, i) => (
              <motion.li
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.65 }}
                className="group relative flex items-start gap-5 lg:flex-col lg:items-start"
              >
                {/* Step Node */}
                <div className="relative z-10 shrink-0">
                  <div className="absolute inset-0 rounded-2xl bg-[#C9973F]/20 blur-md group-hover:bg-[#C9973F]/35 transition-all duration-500" />
                  <span className="relative grid h-14 w-14 place-items-center rounded-2xl border border-[#C9973F]/50 bg-gradient-to-br from-[#071A33] to-[#040E1F] font-display text-lg font-semibold text-white shadow-md group-hover:border-[#C9973F] group-hover:shadow-[0_4px_20px_rgba(201,151,63,0.25)] transition-all duration-500">
                    {s.step}
                  </span>
                </div>
                <div className="lg:mt-6">
                  <h3 className="font-display text-2xl text-[#071A33] group-hover:text-[#9A6B1F] transition-colors">{s.title}</h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-[#5A687A]">{s.desc}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Reach() {
  return (
    <section id="global-reach-transport" className="section-y overflow-hidden bg-[#040E1F] text-[#F4F1EA]">
      <div className="container-x">
        <SectionHead
          dark
          eyebrow="Global Reach"
          title="Direct Maritime Corridors to All Key Markets."
          text="Direct export shipments move from India's premier deepwater ports to our key destination markets across the USA, Europe, Germany, UAE, South Africa, Kenya, and Australia."
          align="center"
        />

        {/* Live Operational Status Banner */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold/30 bg-[#071A33]/80 p-4 px-6 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-gold-soft">
                Live Active Maritime Corridors
              </p>
              <p className="text-[11px] text-[#D9DDE3]/80">
                Continuous scheduled liner departures from India directly to all 7 international destination markets
              </p>
            </div>
          </div>
          <Link
            to="/markets"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-light transition-colors"
          >
            <span>Explore Full Port Specifications</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Live Animated Trade Map with Continuous Traveling Dots */}
        <Reveal className="mt-8">
          <TradeRouteMap />
        </Reveal>
      </div>
    </section>
  );
}

function StatsBand() {
  const statsList = [
    { value: 7, suffix: "", label: "Destination Markets", sub: "Global export corridors" },
    { value: 5, suffix: "", label: "Global Regions", sub: "Connected trade zones" },
    { value: allProducts.length, suffix: "", label: "Export Products", sub: "Fully certified SKUs" },
    { value: 500, suffix: "+", label: "Shipments Completed", sub: "98% on-time record" },
  ];

  return (
    <section className="relative border-y border-gold/30 bg-[#040E1F] py-20 text-[#F4F1EA] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 luxury-grain opacity-40" />
      <div className="container-x relative grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
        {statsList.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className={cn("text-center", i > 0 && "md:border-l border-gold/15 pl-4 md:pl-6")}
          >
            <p className="font-display text-4xl sm:text-5xl text-brand-gradient md:text-6xl lg:text-7xl tracking-tight">
              <Counter to={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.22em] font-medium text-white/90">
              {s.label}
            </p>
            <p className="mt-1 text-[11px] text-[#D9DDE3]/70">{s.sub}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const gallery = [
  { src: warehouse, alt: "Rice sacks loaded into a container", h: "row-span-2" },
  { src: port, alt: "Container ship at port", h: "" },
  { src: farm, alt: "Wheat fields at sunrise", h: "" },
  { src: produce, alt: "Fresh produce in crates", h: "row-span-2" },
  { src: storyHarvest, alt: "Agricultural produce sorting and grading", h: "" },
  { src: spices, alt: "Indian spices in brass bowls", h: "" },
];

function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="section-y bg-sand luxury-grain">
      <div className="container-x">
        <SectionHead
          eyebrow="On the Ground"
          title="Inside our operations."
          text="A glimpse into our processing yards, packing stations, cold storages, and container loading berths."
        />
        <div className="mt-14 grid auto-rows-[14rem] grid-cols-2 gap-4 md:grid-cols-4">
          {gallery.map((g, i) => (
            <button
              key={i}
              onClick={() => setOpen(i)}
              className={cn(
                "group overflow-hidden rounded-3xl border border-gold/20 shadow-soft cursor-pointer",
                g.h,
              )}
              aria-label={`Open ${g.alt}`}
            >
              <img
                src={g.src}
                alt={g.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
              />
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-[#040E1F]/95 p-6 backdrop-blur-md"
            onClick={() => setOpen(null)}
          >
            <button
              className="absolute right-6 top-6 text-[#F4F1EA] hover:text-gold"
              aria-label="Close"
            >
              <X className="h-8 w-8" />
            </button>
            <motion.img
              key={open}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={gallery[open]?.src}
              alt={gallery[open]?.alt}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain border border-gold/40 shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonials[i] ?? testimonials[0]!;
  const go = (d: number) => setI((n) => (n + d + testimonials.length) % testimonials.length);

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => go(1), 7000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  return (
    <section className="relative section-y overflow-hidden bg-[#FAF8F3] text-[#071A33] border-t border-[#C9973F]/20">
      {/* Subtle luxury grain and warm ambient glow */}
      <div className="pointer-events-none absolute inset-0 luxury-grain opacity-10" />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(201,151,63,0.08) 0%, transparent 70%)" }}
      />

      <div className="container-x relative z-10 max-w-5xl mx-auto text-center">
        <p className="eyebrow text-[#9A6B1F]">Verified Importer Reviews</p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl text-[#071A33]">Trusted by buyers worldwide.</h2>

        {/* Large decorative quote mark */}
        <div className="relative mt-12 min-h-[18rem] flex flex-col items-center justify-center">
          <span
            className="pointer-events-none select-none absolute -top-2 left-1/2 -translate-x-1/2 font-display text-[12rem] leading-none text-[#C9973F]/20"
            aria-hidden="true"
          >
            “
          </span>

          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="relative"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, k) => (
                  <svg key={k} className="h-5 w-5 text-[#C9973F]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              <blockquote className="font-display text-2xl italic leading-snug text-[#071A33] md:text-[2.2rem] max-w-4xl mx-auto">
                {t.quote}
              </blockquote>

              <figcaption className="mt-8">
                {/* Avatar initials */}
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#C9973F]/50 bg-[#071A33] text-sm font-bold text-[#F2C86E] shadow-md">
                  {t.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                </div>
                <span className="block font-semibold text-[#071A33]">{t.name}</span>
                <span className="text-sm text-[#5A687A]">
                  {t.role}, {t.company} · {t.country}
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="mt-10 flex items-center justify-center gap-5">
          <button
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="grid h-11 w-11 place-items-center rounded-full border border-[#C9973F]/40 bg-white text-[#071A33] hover:border-[#C9973F] hover:bg-[#FAF8F3] hover:text-[#9A6B1F] shadow-sm cursor-pointer transition-all duration-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, k) => (
              <button
                key={k}
                type="button"
                aria-label={`Go to testimonial ${k + 1}`}
                onClick={() => setI(k)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500 cursor-pointer",
                  k === i ? "w-10 bg-[#C9973F]" : "w-3 bg-[#071A33]/20 hover:bg-[#071A33]/40",
                )}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="grid h-11 w-11 place-items-center rounded-full border border-[#C9973F]/40 bg-white text-[#071A33] hover:border-[#C9973F] hover:bg-[#FAF8F3] hover:text-[#9A6B1F] shadow-sm cursor-pointer transition-all duration-300"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section id="quote" className="section-y relative overflow-hidden bg-[#040E1F] text-[#F4F1EA]">
      {/* Rich ambient lighting & background */}
      <div className="pointer-events-none absolute inset-0 luxury-grain opacity-20" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 15% 40%, rgba(201,151,63,0.12) 0%, transparent 65%), radial-gradient(ellipse 60% 70% at 85% 60%, rgba(14,42,79,0.7) 0%, transparent 60%)",
        }}
      />
      {/* Subtle large gold infinity watermark */}
      <InfinityWatermark className="absolute -left-20 top-1/2 -translate-y-1/2 w-[42rem] h-[21rem] text-[#C9973F] opacity-[0.05]" />
      <img
        src={port}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-luminosity"
      />

      <div className="container-x relative z-10 grid gap-12 lg:grid-cols-5 items-start min-w-0 w-full max-w-full">
        <div className="text-[#F4F1EA] lg:col-span-2 min-w-0 w-full">
          {/* Live response badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C9973F]/40 bg-[#071A33]/90 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[#F2C86E] shadow-sm backdrop-blur-md mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#25D366]" />
            </span>
            <span>DIRECT TRADE DESK</span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-white/80">REPLY WITHIN 4 HOURS</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display leading-[1.05] text-white">
            Let's Move{" "}
            <span className="relative inline-block">
              <em className="italic bg-gradient-to-r from-[#F2C86E] via-[#FFF3D1] to-[#C9973F] bg-clip-text text-transparent drop-shadow-[0_2px_25px_rgba(201,151,63,0.4)]">
                Your Cargo.
              </em>
            </span>
          </h2>

          <p className="mt-5 text-[#D9DDE3] leading-relaxed text-sm sm:text-base">
            Tell us your product grade, volume, and destination port. Our export desk delivers complete FOB/CIF pricing, laboratory certificate of analysis, and confirmed liner schedules.
          </p>

          {/* Trust Guarantees */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "SGS / Geo-Chem Pre-Shipment Assay",
              "Confirmed Irrevocable L/C & CAD",
              "100% Export Documentation",
              "Mundra & JNPT Direct Allocations",
            ].map((guarantee) => (
              <div key={guarantee} className="flex items-center gap-2 text-xs text-[#D9DDE3]/90">
                <CheckCircle2 className="h-4 w-4 text-[#F2C86E] shrink-0" />
                <span>{guarantee}</span>
              </div>
            ))}
          </div>

          {/* Quick Contact Box */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#071A33]/70 p-5 backdrop-blur-md space-y-3.5 text-xs sm:text-sm">
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C9973F]/20 text-[#F2C86E] border border-[#C9973F]/30 shrink-0">
                <Headset className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[#9aaec4] text-[11px] block">Direct Phone & WhatsApp</span>
                <span className="font-semibold">{site.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white/90">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C9973F]/20 text-[#F2C86E] border border-[#C9973F]/30 shrink-0">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[#9aaec4] text-[11px] block">Export Desk Email</span>
                <span className="font-semibold">{site.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white/90">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C9973F]/20 text-[#F2C86E] border border-[#C9973F]/30 shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[#9aaec4] text-[11px] block">Corporate Headquarters</span>
                <span className="font-semibold text-xs leading-snug">{site.address}</span>
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/${site.whatsapp}?text=Hello%20Aurelian%20International,%20I%20would%20like%20to%20request%20an%20export%20quotation.`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[#25D366]/40 bg-[#071A33] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:border-[#25D366] hover:bg-[#25D366]/15 hover:shadow-[0_4px_20px_rgba(37,211,102,0.25)]"
          >
            <WhatsAppIcon className="h-5 w-5 fill-[#25D366]" />
            <span>Chat Directly on WhatsApp ({site.phone})</span>
          </a>
        </div>

        <div className="lg:col-span-3 min-w-0 w-full max-w-full flex justify-center">
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}

function CommodityMarquee() {
  const items = allProducts;
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden bg-[#040E1F] border-y border-[#C9973F]/20 py-4">
      <div
        className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, #040E1F, transparent)" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(270deg, #040E1F, transparent)" }}
      />
      <div
        className="animate-marquee flex gap-0 whitespace-nowrap hover:[animation-play-state:paused]"
        style={{ animationDuration: "40s" }}
      >
        {doubled.map((product, idx) => (
          <Link
            key={`${product.slug}-${idx}`}
            to="/products/$category/$product"
            params={{ category: product.category.slug, product: product.slug }}
            className="inline-flex items-center gap-4 px-6 group transition-colors"
          >
            <span className="text-sm font-medium tracking-wide text-[#9aaec4] group-hover:text-[#C9973F] transition-colors">
              {product.name}
            </span>
            <span className="text-[#C9973F]/50 group-hover:text-[#C9973F] transition-colors">◆</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <CommodityMarquee />
      <Categories />
      <WhyUs />
      <Process />
      <Reach />
      <StatsBand />
      <Gallery />
      <section className="section-y bg-[#FAF8F3] relative overflow-hidden">
        {/* Subtle gold ambient glow and grain */}
        <div className="pointer-events-none absolute inset-0 luxury-grain opacity-10" />
        <div
          className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(201,151,63,0.06) 0%, transparent 70%)" }}
        />
        <div className="container-x relative z-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-12">
            <SectionHead
              eyebrow="Compliance & Accreditation"
              title="Statutory licenses you can verify."
              text="Our operations are audited and registered with premier Indian trade and food safety authorities."
            />
            <a
              href={`https://wa.me/${site.whatsapp}?text=Hello%20Aurelian,%20please%20send%20your%20company%20licences%20and%20compliance%20certificates.`}
              target="_blank"
              rel="noreferrer"
              className={btn.outline}
            >
              Request Licences <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <CertGrid />
        </div>
      </section>
      <Testimonials />
      <section className="section-y bg-[#FAF8F3] relative overflow-hidden border-t border-[#C9973F]/20">
        <div className="pointer-events-none absolute inset-0 luxury-grain opacity-10" />
        <div className="container-x grid gap-14 lg:grid-cols-3 relative z-10">
          <SectionHead
            eyebrow="FAQ"
            title="Questions, answered."
            text="Common inquiries regarding payment terms (LC/CAD), minimum order quantities, private labelling, and marine cargo insurance."
          />
          <div className="lg:col-span-2">
            <FaqList />
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
