import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Headset,
  PackageCheck,
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
import marble from "@/assets/marble.jpg";
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
import { cn } from "@/lib/utils";

const heroSlides = [
  {
    src: shipmentWebp,
    placeholder:
      "data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAADQBACdASogABIAPxFyr1AsJqQisAgBgCIJQBUegsaGJGzL+Uxec9izPIWOkLvsAAD+ud1oQhxWQlvbjW/scmJBZyCP7O0UC5Tfqsx3hfGCLlr0tZPj0Td8pgx0jzInDB/BlDkMJiYgjgGUBQZlV/AAAAA=",
    alt: "Container ship at sea at twilight blue hour with deep blue water",
    label: "Shipment Port",
    filter: "brightness(0.68) contrast(1.15) saturate(1.1)",
  },
  {
    src: spicesWebp,
    placeholder:
      "data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAADQBACdASogABIAPxFwrVAsJiQisAgBgCIJYwDA3CHfCQeWgDBd8tuWiu3GpYuuAAD+8MheC7jwSJYXvV+SziTMBMkPqRxnxotdCcg8+Ga7hMqj5UaTkrbYHIWrwvr354Eg9S2RMUpEhT/rQQQt75OkIr0zieVcHnVtkC+gAAA=",
    alt: "Vibrant Indian spices in brass bowls on dark textured stone and wood",
    label: "Spices",
    filter: "brightness(0.68) contrast(1.15) saturate(1.1)",
  },
  {
    src: tilesWebp,
    placeholder:
      "data:image/webp;base64,UklGRrAAAABXRUJQVlA4IKQAAADQBACdASogABIAPxF2sVAsJ6SisAgBgCIJZQDIXCBzX53bsLM+urL7b7HTjf65YAD+05vzh7aTEdERR+sdnipTYblCNxF6JKt7wm+215S6RVAq5fcCYkm1z0yhcarJZDzUZd5/2HqgAyGG4zvqfkz6hUmDH8quzTrlNSDvzbfKt4FVvCdigt6etkgCIAnOas+w3TRTHZRxFtTHzbzP8JyOnUQQAA==",
    alt: "Luxury polished marble slabs with dramatic high-contrast veins",
    label: "Tiles & Slabs",
    filter: "brightness(0.68) contrast(1.15) saturate(1.1)",
  },
  {
    src: agriWebp,
    placeholder:
      "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAADQAwCdASogABIAPxFyr1AsJqQisAgBgCIJQBbZA+lr6Ao/j3SSbYwA3f4A3WFQr04jseSEIG8fD+McswqNb/NQro8YXOqPN67RxdrXindNzCwnCCG8nuAfBvZRU0QnlzkardZWUVkAXJ9QAAA=",
    alt: "Scenic agricultural fields in deep emerald green under warm morning sunlight",
    label: "Agriculture",
    filter: "brightness(0.68) contrast(1.15) saturate(1.1)",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${site.name} — India's Finest, Delivered Worldwide` },
      {
        name: "description",
        content:
          "Premium Indian agricultural produce, spices, and natural stone — sourced, certified and shipped to your port.",
      },
      { property: "og:title", content: `${site.name} — India's Finest, Delivered Worldwide` },
      {
        property: "og:description",
        content:
          "Premium agricultural produce, spices, natural stone and more from India — certified and shipped worldwide.",
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
    }, 5000);
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
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#040E1F] text-[#F4F1EA]"
    >
      {/* Background Slideshow */}
      <motion.div style={{ y }} className="absolute inset-0">
        <AnimatePresence>
          <motion.div
            key={i}
            initial={{ opacity: hasMounted ? 0 : 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1.06 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: hasMounted ? 1.2 : 0, ease: "easeInOut" },
              scale: { duration: 5.2, ease: "linear" },
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
                filter: currentSlide.filter ?? "brightness(0.68) contrast(1.15) saturate(1.1)",
              }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* 1. Full-image dark overlay on top of every slide */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: "rgba(4, 14, 31, 0.45)",
        }}
      />

      {/* 2. Left-side text gradient */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to right, rgba(4, 14, 31, 0.8) 0%, rgba(4, 14, 31, 0.5) 45%, rgba(4, 14, 31, 0.15) 80%, transparent 100%)",
        }}
      />

      {/* 3. Bottom gradient */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: "linear-gradient(to top, rgba(4, 14, 31, 0.7) 0%, transparent 35%)",
        }}
      />

      {/* 4. Soft edge vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.4) 100%)",
        }}
      />

      {/* Hero Content with Staggered Reveal */}
      <div className="container-x relative z-10 flex flex-1 flex-col justify-center pb-56 pt-28 md:pb-52 md:pt-32">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="eyebrow"
          style={{ textShadow: "0 2px 14px rgba(0, 0, 0, 0.35)" }}
        >
          IMPORT & EXPORT · MORBI, GUJARAT, INDIA
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.9 }}
          className="mt-6 max-w-5xl text-6xl leading-[0.95] text-white md:text-8xl lg:text-[6.5rem]"
          style={{ textShadow: "0 2px 24px rgba(0, 0, 0, 0.35)" }}
        >
          India's Finest, <em className="text-gold-soft">Delivered</em> Worldwide.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.8 }}
          className="mt-8 max-w-xl text-lg text-[#D9DDE3] leading-relaxed"
          style={{ textShadow: "0 2px 16px rgba(0, 0, 0, 0.4)" }}
        >
          Premium agricultural produce, spices, and natural stone — sourced, certified and shipped
          to your port with end-to-end accountability.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.45, duration: 0.8 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link to="/products" className={btn.gold}>
            Explore {allProducts.length} Products <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/contact" className={btn.outlineLight}>
            Request a Quote
          </Link>
        </motion.div>
      </div>

      {/* Slide Indicators, Progress Line & Stats Bar */}
      <div className="container-x absolute inset-x-0 bottom-6 md:bottom-8 z-20 flex flex-col items-center gap-3 md:gap-4">
        {/* Slide Indicators with Animated Fill Time */}
        <div className="flex items-center justify-between w-full max-w-5xl px-2">
          <div className="flex items-center gap-2.5" role="tablist" aria-label="Hero Slides">
            {heroSlides.map((s, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={i === idx}
                aria-label={`Jump to slide ${idx + 1}: ${s.label}`}
                onClick={() => goToSlide(idx)}
                className="group relative cursor-pointer py-2 focus:outline-none"
              >
                <span className="relative block h-1.5 w-10 sm:w-14 overflow-hidden rounded-full bg-white/20">
                  {i === idx ? (
                    <motion.span
                      key={`progress-${i}`}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="absolute inset-y-0 left-0 bg-gold-soft shadow-[0_0_10px_rgba(230,190,138,0.8)]"
                    />
                  ) : (
                    <span className="block h-full w-0 group-hover:w-full group-hover:bg-white/40 transition-all duration-300" />
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* Subtle Scroll Down Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="hidden sm:flex items-center gap-2 text-white/70"
          >
            <span className="text-[10px] tracking-[0.22em] uppercase font-sans text-gold-soft">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4 text-gold-soft" />
            </motion.div>
          </motion.div>
        </div>

        {/* Glass Stats Bar Panel (6 Destination Markets, 7 Product Categories) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.9 }}
          className="w-full backdrop-blur-xl bg-[#071A33]/40 border border-[#C9973F]/35 shadow-2xl grid grid-cols-2 rounded-2xl md:grid-cols-4 overflow-hidden"
          style={{
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {[
            ["6", "Destination Markets"],
            ["7", "Product Categories"],
            [String(allProducts.length), "Export SKUs"],
            ["100%", "Certified Quality"],
          ].map(([v, l], k) => (
            <div
              key={l}
              className={cn(
                "px-6 py-5 md:py-6",
                k > 0 && "md:border-l border-[#C9973F]/25",
                k % 2 === 1 && "border-l border-[#C9973F]/25",
                k > 1 && "border-t md:border-t-0 border-[#C9973F]/25",
              )}
            >
              <p className="font-display text-3xl text-brand-gradient md:text-4xl">{v}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#D9DDE3]">{l}</p>
            </div>
          ))}
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
      <InfinityWatermark className="absolute -right-24 top-1/2 -translate-y-1/2 w-[38rem] h-[19rem] text-[#C9973F] opacity-[0.04]" />
      <div className="container-x grid items-center gap-16 lg:grid-cols-2 relative z-10">
        <div ref={ref} className="relative h-[30rem] md:h-[38rem]">
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
            className="absolute bottom-0 right-0 h-[56%] w-[56%] rounded-3xl border-8 border-ivory object-cover shadow-lift"
          />
        </div>
        <div>
          <SectionHead
            eyebrow="Our Story"
            title={
              <>
                A trading house built on <em className="text-gold">trust</em>.
              </>
            }
            text={`Since ${site.established}, ${site.name} has connected India's growers, spice farmers and stone quarries with discerning buyers worldwide. We obsess over grade, documentation and timing — so every container lands exactly as promised.`}
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
  const dehydratedCategory =
    categories.find((c) => c.slug === "dehydrated-powders") ?? categories[6]!;

  return (
    <section className="section-y bg-sand luxury-grain relative">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-12">
          <SectionHead
            eyebrow="What We Export"
            title="Six categories. One standard."
            text="Direct sourcing, optical sorting, and customized packaging across India's primary agricultural, spice, mineral, and botanical export belts."
          />
          <Link to="/products" className={btn.outline}>
            All {allProducts.length} Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 6-Card Balanced Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card 0: Agriculture (Tall & expansive hero bento tile) */}
          <div className="md:col-span-7 h-[26rem] md:h-[30rem]">
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

          {/* Row 2: Spices, Natural Stones, Dehydrated Powders (3 balanced columns) */}
          <div className="md:col-span-4 h-[18rem] md:h-[20rem]">
            <CategoryBentoCard category={categories[3]!} isWide />
          </div>

          <div className="md:col-span-4 h-[18rem] md:h-[20rem]">
            <CategoryBentoCard category={categories[4]!} isWide />
          </div>

          <div className="md:col-span-4 h-[18rem] md:h-[20rem]">
            <CategoryBentoCard category={dehydratedCategory} isWide />
          </div>
        </div>
      </div>
    </section>
  );
}


const whyIcons = [Boxes, Tag, FileCheck2, Headset];
function WhyUs() {
  return (
    <section className="section-y bg-[#071A33] text-[#F4F1EA] relative overflow-hidden">
      <div className="container-x">
        <SectionHead
          dark
          eyebrow="Why Choose Us"
          title="The details are the difference."
          text="Everything a serious importer needs, handled by one accountable partner with verified on-the-ground infrastructure."
        />
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border hairline bg-gold/20 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((w, i) => {
            const Icon = whyIcons[i] ?? Boxes;
            return (
              <motion.div
                key={w.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#0E2A4F]/70 p-10 transition-colors hover:bg-[#0E2A4F]"
              >
                <Icon className="h-8 w-8 text-gold" strokeWidth={1.2} />
                <h3 className="mt-6 text-2xl font-display text-white">{w.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#D9DDE3]">{w.text}</p>
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
    desc: "Direct farm-gate and quarry procurement across Maharashtra, Punjab, Gujarat & Rajasthan with complete lot traceability.",
  },
  {
    step: "02",
    title: "Quality Check",
    desc: "Multi-stage NABL lab assays for moisture, grain length, purity, and strict pesticide residue compliance before acceptance.",
  },
  {
    step: "03",
    title: "Packaging",
    desc: "Food-grade poly bags, vacuum tins, customized retail pouches, or fumigated wooden crates tailored to buyer specifications.",
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
    <section className="section-y bg-ivory relative overflow-hidden">
      <div className="container-x">
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
            className="absolute left-6 right-6 top-8 hidden h-0.5 origin-left bg-gradient-to-r from-gold/30 via-gold to-gold-soft lg:block"
          />
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className="absolute bottom-6 left-8 top-6 w-0.5 origin-top bg-gradient-to-b from-gold/30 via-gold to-gold-soft lg:hidden"
          />

          <ol className="grid gap-10 lg:grid-cols-6 lg:gap-6">
            {exportSteps.map((s, i) => (
              <motion.li
                key={s.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                className="relative flex items-start gap-5 lg:flex-col lg:items-start"
              >
                <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-gold/60 bg-[#071A33] font-display text-lg font-semibold text-gold-soft shadow-soft">
                  {s.step}
                </span>
                <div className="lg:mt-6">
                  <h3 className="font-display text-2xl text-[#071A33]">{s.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
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
            <p className="font-display text-5xl text-brand-gradient md:text-6xl lg:text-7xl tracking-tight">
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
  { src: marble, alt: "Marble slabs in a warehouse", h: "" },
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

  return (
    <section className="section-y bg-ivory">
      <div className="container-x max-w-5xl text-center">
        <p className="eyebrow">Verified Importer Reviews</p>
        <div className="relative mt-8 min-h-[16rem] flex flex-col items-center justify-center">
          <span className="font-display text-8xl leading-none text-gold/30">“</span>
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="-mt-8"
            >
              <blockquote className="font-display text-2xl italic leading-snug text-[#071A33] md:text-4xl max-w-4xl mx-auto">
                {t.quote}
              </blockquote>
              <figcaption className="mt-8 text-sm">
                <span className="font-semibold text-ink">{t.name}</span>
                <span className="text-muted-foreground">
                  {" "}
                  · {t.role}, {t.company} · {t.country}
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="grid h-11 w-11 place-items-center rounded-full border hairline text-[#071A33] hover:bg-[#071A33] hover:text-[#F4F1EA] cursor-pointer transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, k) => (
              <span
                key={k}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  k === i ? "w-8 bg-gold" : "w-3 bg-border",
                )}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="grid h-11 w-11 place-items-center rounded-full border hairline text-[#071A33] hover:bg-[#071A33] hover:text-[#F4F1EA] cursor-pointer transition-colors"
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
    <section className="section-y relative overflow-hidden bg-[#040E1F]">
      {/* Subtle large gold infinity watermark */}
      <InfinityWatermark className="absolute -left-20 top-1/2 -translate-y-1/2 w-[42rem] h-[21rem] text-[#C9973F] opacity-[0.04]" />
      <img
        src={port}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="container-x relative z-10 grid gap-14 lg:grid-cols-5">
        <div className="text-[#F4F1EA] lg:col-span-2">
          <p className="eyebrow">Request a Quote</p>
          <h2 className="mt-4 text-5xl leading-[1.02] md:text-7xl">Let's Move Your Cargo.</h2>
          <p className="mt-6 text-[#D9DDE3] leading-relaxed">
            Tell us what you need. Our trade desk replies within one business day with FOB/CIF
            pricing, laboratory spec sheets, and shipping schedules.
          </p>
          <ul className="mt-10 space-y-4 text-sm">
            <li>
              <span className="text-[#D9DDE3]">Phone · </span>
              {site.phone}
            </li>
            <li>
              <span className="text-[#D9DDE3]">Email · </span>
              {site.email}
            </li>
            <li>
              <span className="text-[#D9DDE3]">Office · </span>
              {site.address}
            </li>
          </ul>
          <a
            href={`https://wa.me/${site.whatsapp}?text=Hello%20Aurelian%20International,%20I%20would%20like%20to%20request%20an%20export%20quotation.`}
            target="_blank"
            rel="noreferrer"
            className={cn(btn.outlineLight, "mt-10")}
          >
            <PackageCheck className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </div>
        <div className="lg:col-span-3">
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <div className="gold-hairline-divider" />
      <Categories />
      <div className="gold-hairline-divider" />
      <WhyUs />
      <Process />
      <Reach />
      <StatsBand />
      <Gallery />
      <section className="section-y bg-ivory">
        <div className="container-x">
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
      <div className="gold-hairline-divider" />
      <Testimonials />
      <div className="gold-hairline-divider" />
      <section className="section-y bg-ivory">
        <div className="container-x grid gap-14 lg:grid-cols-3">
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
