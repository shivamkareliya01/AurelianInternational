import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Boxes, ChevronLeft, ChevronRight, FileCheck2, Headset, PackageCheck, Ship, Tag, Wallet, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import farm from "@/assets/farm.jpg";
import spices from "@/assets/spices.jpg";
import marble from "@/assets/marble.jpg";
import port from "@/assets/port.jpg";
import warehouse from "@/assets/warehouse.jpg";
import produce from "@/assets/produce.jpg";
import dryfruits from "@/assets/dryfruits.jpg";
import pvc from "@/assets/pvc.jpg";
import { categories } from "@/data/products";
import { certifications, processSteps, testimonials, whyUs } from "@/data/content";
import { posts } from "@/data/blog";
import { site, stats } from "@/data/site";
import { Counter, Reveal, SectionHead, btn } from "@/components/site/primitives";
import { ProductCard } from "@/components/site/ProductCard";
import { WorldMap } from "@/components/site/WorldMap";
import { CertGrid, FaqList, PostCard } from "@/components/site/Blocks";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${site.name} — India's Finest, Delivered Worldwide` },
      { name: "description", content: "Premium Indian agricultural produce, spices, natural stone, dry fruits and PVC — sourced, certified and shipped to your port." },
      { property: "og:title", content: `${site.name} — India's Finest, Delivered Worldwide` },
      { property: "og:description", content: "Premium agricultural produce, spices, natural stone and more from India — certified and shipped worldwide." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const slides = [farm, spices, marble, port];

function Hero() {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  useEffect(() => { const t = setInterval(() => setI((n) => (n + 1) % slides.length), 5500); return () => clearInterval(t); }, []);
  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-forest-deep text-on-forest">
      <motion.div style={{ y }} className="absolute inset-0">
        <AnimatePresence>
          <motion.img
            key={i}
            src={slides[i]}
            alt="Indian farms, spices, marble and cargo port"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.6 }, scale: { duration: 7, ease: "linear" } }}
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority={i === 0 ? "high" : "auto"}
          />
        </AnimatePresence>
      </motion.div>
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="container-x relative flex flex-1 flex-col justify-center pb-48 pt-32">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} className="eyebrow">
          Import & Export · {site.city}, India
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: 1 }} className="mt-6 max-w-5xl text-6xl leading-[0.95] md:text-8xl lg:text-[6.5rem]">
          India's Finest, <em className="text-gold-soft">Delivered</em> Worldwide.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35, duration: 0.8 }} className="mt-8 max-w-xl text-lg text-on-forest-muted">
          Premium agricultural produce, spices, natural stone and more — sourced, certified and shipped to your port.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8 }} className="mt-10 flex flex-wrap gap-4">
          <Link to="/products" className={btn.gold}>Explore Products <ArrowRight className="h-4 w-4" /></Link>
          <Link to="/contact" className={btn.outlineLight}>Request a Quote</Link>
        </motion.div>
      </div>
      <div className="container-x absolute inset-x-0 bottom-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: 0.9 }} className="glass grid grid-cols-2 rounded-2xl md:grid-cols-4">
          {[["25+", "Countries Served"], ["6", "Product Categories"], ["100%", "Certified Quality"], ["98%", "On-time Shipments"]].map(([v, l], k) => (
            <div key={l} className={cn("px-6 py-5 md:py-6", k > 0 && "md:border-l hairline", k % 2 === 1 && "border-l hairline", k > 1 && "border-t md:border-t-0 hairline")}>
              <p className="font-display text-3xl text-gold-soft md:text-4xl">{v}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-on-forest-muted">{l}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const logos = [...certifications.map((c) => c.code), "GlobalG.A.P.", "BIS"];
  return (
    <section className="border-b hairline bg-ivory py-10">
      <p className="container-x text-center text-sm text-muted-foreground">Trusted by importers across the UK, USA, UAE, Europe & Southeast Asia</p>
      <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="animate-marquee flex w-max gap-6">
          {[...logos, ...logos, ...logos, ...logos].map((l, i) => (
            <span key={i} className="rounded-full border hairline px-8 py-3 font-display text-xl tracking-wider text-forest/70">{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-30, 60]);
  return (
    <section className="section-y bg-ivory">
      <div className="container-x grid items-center gap-16 lg:grid-cols-2">
        <div ref={ref} className="relative h-[32rem] md:h-[40rem]">
          <motion.img style={{ y: y1 }} src={farm} alt="Indian farmland at sunrise" loading="lazy" className="absolute left-0 top-0 h-[78%] w-[72%] rounded-2xl object-cover shadow-lift" />
          <motion.img style={{ y: y2 }} src={warehouse} alt="Export warehouse loading rice" loading="lazy" className="absolute bottom-0 right-0 h-[55%] w-[55%] rounded-2xl border-8 border-ivory object-cover shadow-lift" />
        </div>
        <div>
          <SectionHead eyebrow="Our Story" title={<>A trading house built on <em className="text-gold">trust</em>.</>} text={`Since ${site.established}, ${site.name} has connected India's growers, spice farmers and stone quarries with discerning buyers worldwide. We obsess over grade, documentation and timing — so every container lands exactly as promised.`} />
          <Reveal delay={0.15} className="mt-10 grid grid-cols-2 border-t hairline">
            {[["Established", site.established], ["Headquarters", `${site.city}, India`], ["Markets", "25+ countries"], ["Products", "50+ SKUs"]].map(([k, v], i) => (
              <div key={k} className={cn("py-6", i % 2 === 1 && "border-l hairline pl-6", i > 1 && "border-t hairline")}>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{k}</p>
                <p className="mt-2 font-display text-2xl text-forest">{v}</p>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.25}><Link to="/about" className="mt-8 inline-flex items-center gap-2 text-forest underline decoration-gold underline-offset-8 hover:text-gold">Our Story <ArrowRight className="h-4 w-4" /></Link></Reveal>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  const spans = ["md:col-span-4 md:row-span-2", "md:col-span-2", "md:col-span-2", "md:col-span-2", "md:col-span-2", "md:col-span-2"];
  return (
    <section className="section-y bg-sand">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHead eyebrow="What We Export" title="Six categories. One standard." />
          <Link to="/products" className={btn.outline}>All Products <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-14 grid auto-rows-[18rem] gap-5 md:grid-cols-8">
          {categories.map((c, i) => (
            <motion.div key={c.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.7 }} className={cn(spans[i], i === 5 && "md:col-span-4")}>
              <Link to="/products/$category" params={{ category: c.slug }} className="group relative block h-full overflow-hidden rounded-2xl">
                <img src={c.image} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-on-forest md:p-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-soft">{c.products.length} products</p>
                  <h3 className={cn("mt-2 leading-tight", i === 0 ? "text-4xl md:text-5xl" : "text-3xl")}>{c.name}</h3>
                  <p className="mt-0 max-h-0 overflow-hidden text-sm text-on-forest-muted opacity-0 transition-all duration-500 group-hover:mt-3 group-hover:max-h-24 group-hover:opacity-100">{c.blurb}</p>
                </div>
                <span className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full bg-ivory/90 text-forest opacity-0 transition-all duration-500 group-hover:opacity-100"><ArrowRight className="h-4 w-4" /></span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Featured() {
  const [tab, setTab] = useState(categories[0].slug);
  const cat = categories.find((c) => c.slug === tab)!;
  return (
    <section className="section-y bg-ivory">
      <div className="container-x">
        <SectionHead eyebrow="Featured" title="Export-ready, season after season." align="center" />
        <div className="mt-12 flex justify-start gap-2 overflow-x-auto pb-2 md:justify-center">
          {categories.map((c) => (
            <button key={c.slug} onClick={() => setTab(c.slug)} className={cn("relative shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors", tab === c.slug ? "text-on-forest" : "text-ink/70 hover:text-forest")}>
              {tab === c.slug && <motion.span layoutId="tab" className="absolute inset-0 rounded-full bg-forest" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
              <span className="relative">{c.name}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cat.products.slice(0, 4).map((p) => <ProductCard key={p.slug} product={p} category={cat} />)}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

const whyIcons = [Boxes, Tag, Ship, Wallet, FileCheck2, Headset];
function WhyUs() {
  return (
    <section className="section-y bg-forest text-on-forest">
      <div className="container-x">
        <SectionHead dark eyebrow="Why Choose Us" title="The details are the difference." text="Everything a serious importer needs, handled by one accountable partner." />
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border hairline bg-gold/20 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((w, i) => {
            const Icon = whyIcons[i];
            return (
              <motion.div key={w.title} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-forest p-10 transition-colors hover:bg-forest-deep">
                <Icon className="h-8 w-8 text-gold" strokeWidth={1.1} />
                <h3 className="mt-6 text-2xl">{w.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-on-forest-muted">{w.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="section-y bg-ivory">
      <div className="container-x">
        <SectionHead eyebrow="How It Works" title="From farm gate to your port." align="center" />
        <div className="relative mt-20">
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: "easeInOut" }} className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-gold lg:block" />
          <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: "easeInOut" }} className="absolute bottom-0 left-6 top-0 w-px origin-top bg-gold lg:hidden" />
          <ol className="grid gap-10 lg:grid-cols-6 lg:gap-6">
            {processSteps.map((s, i) => (
              <motion.li key={s} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.25 }} className="relative flex items-center gap-6 lg:flex-col lg:items-start">
                <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold bg-ivory font-display text-lg text-forest">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-display text-2xl text-forest">{s}</p>
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
    <section className="section-y overflow-hidden bg-forest-deep text-on-forest">
      <div className="container-x">
        <SectionHead dark eyebrow="Global Reach" title="Shipping India to six continents." align="center" />
        <Reveal className="mt-12"><WorldMap /></Reveal>
      </div>
    </section>
  );
}

function StatsBand() {
  return (
    <section className="border-y-2 border-gold/40 bg-forest py-20 text-on-forest">
      <div className="container-x grid grid-cols-2 gap-10 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-6xl text-gold-soft md:text-7xl"><Counter to={s.value} suffix={s.suffix} /></p>
            <p className="mt-3 text-xs uppercase tracking-[0.25em] text-on-forest-muted">{s.label}</p>
          </div>
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
  { src: dryfruits, alt: "Cashews, almonds, raisins and dates", h: "" },
  { src: pvc, alt: "PVC pipes stacked in a warehouse", h: "" },
  { src: spices, alt: "Indian spices in brass bowls", h: "" },
];
function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="section-y bg-sand">
      <div className="container-x">
        <SectionHead eyebrow="On the Ground" title="Inside our operations." />
        <div className="mt-14 grid auto-rows-[14rem] grid-cols-2 gap-4 md:grid-cols-4">
          {gallery.map((g, i) => (
            <button key={i} onClick={() => setOpen(i)} className={cn("group overflow-hidden rounded-2xl", g.h)} aria-label={`Open ${g.alt}`}>
              <img src={g.src} alt={g.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {open !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] grid place-items-center bg-forest-deep/95 p-6" onClick={() => setOpen(null)}>
            <button className="absolute right-6 top-6 text-on-forest" aria-label="Close"><X className="h-7 w-7" /></button>
            <motion.img key={open} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={gallery[open].src} alt={gallery[open].alt} className="max-h-[85vh] max-w-full rounded-2xl object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  const go = (d: number) => setI((n) => (n + d + testimonials.length) % testimonials.length);
  return (
    <section className="section-y bg-ivory">
      <div className="container-x max-w-5xl text-center">
        <p className="eyebrow">Buyers Speak</p>
        <div className="relative mt-10 min-h-[18rem]">
          <span className="font-display text-9xl leading-none text-gold/40">“</span>
          <AnimatePresence mode="wait">
            <motion.figure key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="-mt-12">
              <blockquote className="font-display text-3xl italic leading-snug text-forest md:text-5xl">{t.quote}</blockquote>
              <figcaption className="mt-10 text-sm">
                <span className="font-medium text-ink">{t.name}</span>
                <span className="text-muted-foreground"> · {t.role}, {t.company} · {t.country}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-10 flex items-center justify-center gap-4">
          <button onClick={() => go(-1)} aria-label="Previous testimonial" className="grid h-11 w-11 place-items-center rounded-full border hairline text-forest hover:bg-forest hover:text-on-forest"><ChevronLeft className="h-4 w-4" /></button>
          <div className="flex gap-2">{testimonials.map((_, k) => <span key={k} className={cn("h-1 rounded-full transition-all", k === i ? "w-8 bg-gold" : "w-3 bg-border")} />)}</div>
          <button onClick={() => go(1)} aria-label="Next testimonial" className="grid h-11 w-11 place-items-center rounded-full border hairline text-forest hover:bg-forest hover:text-on-forest"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="section-y relative overflow-hidden bg-forest-deep">
      <img src={port} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="container-x relative grid gap-14 lg:grid-cols-5">
        <div className="text-on-forest lg:col-span-2">
          <p className="eyebrow">Request a Quote</p>
          <h2 className="mt-4 text-5xl leading-[1.02] md:text-7xl">Let's Move Your Cargo.</h2>
          <p className="mt-6 text-on-forest-muted">Tell us what you need. We reply within one business day with pricing, specs and shipping timelines.</p>
          <ul className="mt-10 space-y-4 text-sm">
            <li><span className="text-on-forest-muted">Phone · </span>{site.phone}</li>
            <li><span className="text-on-forest-muted">Email · </span>{site.email}</li>
            <li><span className="text-on-forest-muted">Office · </span>{site.address}</li>
          </ul>
          <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" className={cn(btn.outlineLight, "mt-10")}><PackageCheck className="h-4 w-4" /> Chat on WhatsApp</a>
        </div>
        <div className="lg:col-span-3"><EnquiryForm /></div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <AboutPreview />
      <Categories />
      <Featured />
      <WhyUs />
      <Process />
      <Reach />
      <StatsBand />
      <Gallery />
      <section className="section-y bg-ivory">
        <div className="container-x">
          <SectionHead eyebrow="Certifications" title="Compliance you can verify." />
          <div className="mt-14"><CertGrid /></div>
        </div>
      </section>
      <Testimonials />
      <section className="section-y bg-sand">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHead eyebrow="Journal" title="Insights for importers." />
            <Link to="/blog" className={btn.outline}>All Articles</Link>
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-3">{posts.slice(0, 3).map((p) => <PostCard key={p.slug} post={p} />)}</div>
        </div>
      </section>
      <section className="section-y bg-ivory">
        <div className="container-x grid gap-14 lg:grid-cols-3">
          <SectionHead eyebrow="FAQ" title="Questions, answered." />
          <div className="lg:col-span-2"><FaqList /></div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
