import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck2,
  Globe2,
  HeartHandshake,
  Layers,
  Lock,
  PackageCheck,
  Scale,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingUp,
  UserCheck,
  Waves,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CertLogo } from "@/components/site/CertLogos";
import { InfinityWatermark, Reveal, SectionHead } from "@/components/site/primitives";
import { site } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About Us — ${site.name} | Leading Indian Export House` },
      {
        name: "description",
        content: `Built on Principle. Directed Toward Permanence. Learn about ${site.name}, an international trading house connecting Indian growers, mills, and manufacturers with global markets.`,
      },
      {
        name: "keywords",
        content:
          "about Aurelian International, import export company India, Morbi export house, Gujarat exporter, Indian commodities trading company",
      },
      { property: "og:title", content: `About ${site.name} — Built On Principle` },
      {
        property: "og:description",
        content:
          "An international trading house built on precision, discretion, and an uncompromising regard for every commitment we make.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${site.url}/about` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `About ${site.name} — Built On Principle` },
      {
        name: "twitter:description",
        content: "Learn about Aurelian International, premier Indian exporter of agro commodities, spices, and ceramic tiles.",
      },
    ],
    links: [
      { rel: "canonical", href: `${site.url}/about` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: `About ${site.name}`,
          url: `${site.url}/about`,
          description: `Learn about ${site.name}, a premier Indian export merchant house supplying global markets with certified products.`,
          mainEntity: {
            "@type": "Organization",
            name: site.name,
            url: site.url,
          },
        }),
      },
    ],
  }),
  component: About,
});

// The 6 Core Corporate Values
const values = [
  {
    title: "Integrity Without Expectation",
    icon: Scale,
    desc: "Our word is our contract before it is ever written down. We say what we will do & we do what we have said.",
  },
  {
    title: "Discipline In Execution",
    icon: Compass,
    desc: "Excellence is the sum of unremarkable details done correctly. We hold ourselves to exacting standards of quality, documentation & timing.",
  },
  {
    title: "Discretion And Trust",
    icon: Lock,
    desc: "Commerce is built on confidence. The affairs of our partners are handled with the privacy and care they deserve.",
  },
  {
    title: "Long-Term Thinking",
    icon: TrendingUp,
    desc: "We choose enduring partnerships over passing advantage. We would rather earn a relationship for decades than win a transaction for a day.",
  },
  {
    title: "Global Perspective, Local Respect",
    icon: Globe2,
    desc: "We operate across cultures, regulations and markets with humility and attentiveness, honouring the practices of every region we serve.",
  },
  {
    title: "Responsibility",
    icon: HeartHandshake,
    desc: "We trade with accountability to our partner, to the communities we touch, and to the standards of lawful, ethical and sustainable commerce.",
  },
];

// Why Partner With Us: The 7 Core Pillars
const pillars = [
  {
    num: "01",
    title: "One House, Many Origins",
    icon: Layers,
    desc: "From grains, pulses & spices to medicinal botanicals & ceramic tiles to sanitary wares, we bring a wide range of goods under a single relationship. One point of contact, one standard of quality, one accountable partner, however varied the shipment.",
  },
  {
    num: "02",
    title: "Selection At The Source",
    icon: Sprout,
    desc: "We do not simply move goods; we choose them. Every product is sourced with attention to origin, grade & consistency, so that what arrives matches what was agreed.",
  },
  {
    num: "03",
    title: "Clarity in Every Transaction",
    icon: FileCheck2,
    desc: "Pricing, specifications, documentation and timelines are stated plainly and confirmed in writing. There are no surprises at the port, and no ambiguity after the contract.",
  },
  {
    num: "04",
    title: "Compliance Without Compromise",
    icon: ShieldCheck,
    desc: "International trade is governed by regulations that differ in every market. We treat documentation and regulatory requirements as part of the product itself, handled with care and completed before the goods ever leave.",
  },
  {
    num: "05",
    title: "Discretion as Standard",
    icon: Lock,
    desc: "Your pricing, volumes and commercial arrangements remain between us. We treat the affairs of our partners with the privacy that serious business requires.",
  },
  {
    num: "06",
    title: "Attentive, Personal Service",
    icon: UserCheck,
    desc: "As a young house, we give every partner something larger firms often cannot: direct access, prompt responses, and genuine attention, whether the order is a first trial or a standing annual contract.",
  },
  {
    num: "07",
    title: "A Partner for the Long Term",
    icon: Clock,
    desc: "We are not seeking a single transaction. We are building relationships meant to last for decades and we conduct each order with that horizon in mind.",
  },
];

// What We Trade Categories
const tradeCategories = [
  {
    title: "From the Earth & Water",
    subtitle: "Everything the land & water grow",
    icon: Waves,
    items: [
      "Cereals, grains, rice, pulses and lentils",
      "Fresh & dried fruits & vegetables",
      "Spices, dried powders & flowers",
      "Industrial and cash crops",
      "Medicinal & aromatic plants",
      "Cultivated algae and other aquatic botanicals",
    ],
    desc: "Each is selected at the source, graded with care, and handled with discipline that quality and freshness demand.",
  },
  {
    title: "From Tradition",
    subtitle: "Centuries of cultivation & craft",
    icon: Sparkles,
    items: [
      "Ayurvedic herbs & roots",
      "Pure botanical powders",
      "Holistic wellness products",
      "Natural nutraceuticals & extracts",
    ],
    desc: "Drawn from centuries of cultivation and craft, and traded with full respect for the regulations that govern them.",
  },
  {
    title: "For the Built World",
    subtitle: "Architectural surfaces & precision finishes",
    icon: Layers,
    items: [
      "Digital Glazed Vitrified Tiles (GVT)",
      "Polished Glazed Vitrified Tiles (PGVT)",
      "Double Charge Vitrified Tiles",
      "Sanitaryware & ceramic fittings",
    ],
    desc: "Supplied to developers, distributors, and designers who expect finish, consistency and timely delivery.",
  },
];

function About() {
  return (
    <>
      {/* 1. Page Header */}
      <PageHeader
        eyebrow="About Us"
        title={
          <>
            Built On Principle.{" "}
            <em className="text-gold-soft block sm:inline">Directed Toward Permanence.</em>
          </>
        }
        text="Aurelian International is an international trading house. We connect the world's finest producers with discerning markets, moving goods across borders with precision, discretion, and an uncompromising regard for every commitment we make."
        image="/images/green-paddy.jpg"
        crumbs={[{ label: "About" }]}
      />

      {/* 2. The Aurelian Standard & Origin */}
      <section className="py-16 md:py-24 bg-ivory relative overflow-hidden">
        <InfinityWatermark className="hidden sm:block absolute -right-20 top-1/2 -translate-y-1/2 w-[40rem] h-[20rem] text-[#C9973F] opacity-[0.04]" />
        <div className="container-x grid gap-10 lg:gap-16 lg:grid-cols-2 relative z-10 min-w-0 items-center">
          <SectionHead
            eyebrow="The Standard"
            title="A reputation held as though a century old."
          />
          <Reveal className="space-y-5 text-base sm:text-lg leading-relaxed text-[#2C3E50]">
            <p>
              The name <strong className="text-[#071A33] font-semibold">Aurelian</strong> draws on
              the Latin <em>aureus</em>, &ldquo;golden&rdquo;, and it is the standard we hold
              ourselves to.
            </p>
            <p>
              We are a young company, and we do not borrow a history we have not earned. We began
              with something more durable than a legacy:{" "}
              <strong className="text-[#071A33] font-semibold">a standard</strong>. Every shipment,
              agreement and relationship is conducted as though our reputation were already a
              century old.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3. WHAT WE TRADE */}
      <section className="section-y bg-[#FAF8F3] relative overflow-hidden border-y border-[#C9973F]/20">
        <div className="container-x">
          <SectionHead
            eyebrow="Portfolio"
            title="What We Trade."
            text="Different in nature, our trading categories share one principle: what we send must be worthy of the name on the crate."
            align="center"
          />

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {tradeCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Reveal
                  key={cat.title}
                  delay={i * 0.1}
                  className="rounded-2xl border border-[#C9973F]/25 bg-white p-7 sm:p-8 shadow-[0_10px_30px_rgba(7,26,51,0.04)] flex flex-col justify-between hover:border-[#C9973F]/60 transition-all duration-300 hover:-translate-y-1"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FAF8F3] border border-[#C9973F]/30 text-[#C9973F] mb-6">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#9A6B1F] font-semibold">
                      {cat.subtitle}
                    </span>
                    <h3 className="font-display text-2xl text-[#071A33] mt-1 mb-4 font-semibold">
                      {cat.title}
                    </h3>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#4A5568] mb-6">
                      {cat.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#C9973F] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs italic text-[#6B7280] border-t border-[#E5E7EB] pt-4 leading-relaxed">
                    {cat.desc}
                  </p>
                </Reveal>
              );
            })}
          </div>

          {/* Unified Category Rule Banner */}
          <div className="mt-12 rounded-2xl border border-[#C9973F]/30 bg-gradient-to-r from-[#071A33] via-[#0B2547] to-[#071A33] p-6 sm:p-8 text-center text-white shadow-lg">
            <p className="font-display text-lg sm:text-xl italic text-[#F2C86E] max-w-3xl mx-auto">
              &ldquo;Different in nature, these categories share one principle: what we send must be worthy of the name on the crate.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* 4. MISSION & VISION */}
      <section className="section-y bg-[#071A33] text-[#F4F1EA] relative overflow-hidden">
        <div className="container-x relative z-10">
          <SectionHead
            dark
            eyebrow="Purpose & Trajectory"
            title="Our Mission & Vision."
            align="center"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Mission */}
            <div className="rounded-2xl border border-[#C9973F]/30 bg-[#0E2A4F]/80 p-8 sm:p-12 min-w-0 flex flex-col justify-between shadow-xl">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C9973F]/40 bg-[#C9973F]/15 px-3 py-1 text-[11px] font-semibold text-[#F2C86E] uppercase tracking-wider mb-6">
                  <span>Our Mission</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-4">
                  To make global trade dependable.
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-[#D9DDE3]">
                  We source, supply, and deliver with rigour, transparency, and respect for the people
                  on both sides of every transaction, so that those who work with us do so with
                  complete confidence.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-[#F2C86E]">
                <PackageCheck className="h-4 w-4" />
                <span>Rigour · Transparency · Respect</span>
              </div>
            </div>

            {/* Vision */}
            <div className="rounded-2xl border border-[#C9973F]/30 bg-[#0E2A4F]/80 p-8 sm:p-12 min-w-0 flex flex-col justify-between shadow-xl">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C9973F]/40 bg-[#C9973F]/15 px-3 py-1 text-[11px] font-semibold text-[#F2C86E] uppercase tracking-wider mb-6">
                  <span>Our Vision</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-4">
                  When Aurelian gives its word, the matter is settled.
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-[#D9DDE3]">
                  To stand among the most trusted names in international commerce, a house recognised
                  not by size alone but by the quiet certainty it inspires: that when Aurelian gives
                  its word, the matter is settled.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-[#F2C86E]">
                <ShieldCheck className="h-4 w-4" />
                <span>Quiet Certainty · Enduring Trust</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OUR VALUES (The 6 Pillars) */}
      <section className="section-y bg-ivory relative">
        <div className="container-x">
          <SectionHead
            eyebrow="Foundational Pillars"
            title="Our Values."
            text="Excellence is the sum of unremarkable details done correctly. These principles govern every shipment, contract, and conversation."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal
                  key={v.title}
                  delay={i * 0.08}
                  className="rounded-2xl border border-[#E3E7EE] bg-white p-7 sm:p-8 shadow-soft flex flex-col justify-between hover:border-[#C9973F]/60 transition-colors"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF8F3] border border-[#C9973F]/30 text-[#C9973F] mb-5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[#071A33] mb-3">
                      {v.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. OUR COMMITMENT */}
      <section className="py-20 bg-[#040E1F] text-[#F4F1EA] relative overflow-hidden border-y border-[#C9973F]/30">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201, 151, 63, 0.25) 0%, transparent 70%)",
          }}
        />
        <div className="container-x relative z-10 max-w-4xl mx-auto text-center">
          <span className="eyebrow !text-[#F2C86E]">Our Commitment</span>
          <blockquote className="mt-6 font-display text-2xl sm:text-3xl md:text-4xl italic leading-relaxed text-white">
            &ldquo;We do not measure ourselves by how loudly we announce our arrival, but by how
            steadily we deserve our place. To our partners, we offer reliability, clarity and a
            standard of service that does not waver with the size of the order.&rdquo;
          </blockquote>
          <p className="mt-6 text-sm sm:text-base text-[#D9DDE3] max-w-2xl mx-auto leading-relaxed">
            Trade is as old as civilisation itself. We intend to conduct it as though we were here
            to stay.
          </p>
        </div>
      </section>

      {/* 7. WHY PARTNER WITH US: The Standard You Can Build On */}
      <section className="section-y bg-[#FAF8F3] relative overflow-hidden">
        <div className="container-x">
          <SectionHead
            eyebrow="Why Partner With Us"
            title="The Standard You Can Build On."
            text="Choosing a trading partner is an act of trust. We have shaped Aurelian International around the things that trust depends on, so that working with us feels less like a risk taken and more like a matter settled."
            align="center"
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal
                  key={p.title}
                  delay={i * 0.06}
                  className="rounded-2xl border border-[#C9973F]/20 bg-white p-6 sm:p-7 shadow-soft flex flex-col justify-between hover:border-[#C9973F]/60 transition-all hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FAF8F3] border border-[#C9973F]/30 text-[#C9973F]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-[#C9973F]/60">
                        {p.num}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#071A33] mb-2 leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Our Promise Banner */}
          <div className="mt-12 rounded-2xl border-2 border-[#C9973F] bg-white p-8 sm:p-10 shadow-lift relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 text-center md:text-left">
                <span className="eyebrow !text-[#C9973F]">Our Promise</span>
                <h3 className="font-display text-2xl sm:text-3xl text-[#071A33] font-semibold">
                  Exactly as promised. Without exception.
                </h3>
                <p className="text-sm sm:text-base text-[#4A5568] max-w-2xl leading-relaxed">
                  Every partner deserves to know what will arrive, when it will arrive, and that it
                  will be exactly as promised. That is the only promise we make, and the only one we
                  intend to keep without exception.
                </p>
              </div>

              <Link
                to="/contact"
                className="gold-btn-luxury shrink-0 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#9A6B1F] via-[#F2C86E] to-[#C9973F] px-8 py-3.5 text-xs sm:text-sm font-bold tracking-wide text-[#071A33] shadow-md hover:shadow-lg transition-all"
              >
                <span>Initiate Commercial Enquiry</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Official Export Certifications & Licenses Section */}
      <section id="certifications" className="section-y bg-[#071A33] text-[#F4F1EA] scroll-mt-24">
        <div className="container-x">
          <SectionHead
            dark
            eyebrow="Government & Global Compliance"
            title="Registrations & Documentation."
            text="Every commodity shipped by Aurelian International is accompanied by mandatory government registrations, phytosanitary clearance, and independent pre-shipment quality inspection."
            align="center"
          />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                code: "DGFT",
                title: "Directorate General of Foreign Trade",
                desc: "Active Importer Exporter Code (IEC) issued by the Ministry of Commerce and Industry for unrestricted global trade.",
                tag: "IEC Licensed",
              },
              {
                code: "APEDA",
                title: "Agricultural Produce Export",
                desc: "Registered with the Agricultural & Processed Food Products Export Development Authority (Ministry of Commerce & Industry, Govt. of India).",
                tag: "RCMC Registered",
              },
              {
                code: "FSSAI",
                title: "Food Safety & Standards Authority",
                desc: "Central Licensing compliance ensuring zero contamination, proper food grade handling, and hygienic warehouse storage.",
                tag: "Central License",
              },
            ].map((cert) => (
              <div
                key={cert.code}
                className="rounded-2xl border border-gold/30 bg-[#0E2A4F]/60 p-6 flex flex-col justify-between hover:border-gold/60 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-11 w-11 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md shrink-0">
                        <CertLogo code={cert.code} className="h-8 w-8 object-contain" />
                      </div>
                      <span className="font-mono text-[11px] font-bold text-gold tracking-wider bg-gold/15 px-2 py-0.5 rounded border border-gold/30">
                        {cert.code}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#F2C86E] bg-white/5 px-2 py-0.5 rounded-full">
                      {cert.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-lg text-white font-medium">{cert.title}</h3>
                  <p className="mt-2 text-xs text-[#D9DDE3] leading-relaxed">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
