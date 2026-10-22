import { CertLogo } from "@/components/site/CertLogos";
import { createFileRoute } from "@tanstack/react-router";
import farm from "@/assets/farm.jpg";
import warehouse from "@/assets/warehouse.jpg";
import spices from "@/assets/spices.jpg";
import port from "@/assets/port.jpg";
import { PageHeader } from "@/components/site/PageHeader";
import { InfinityWatermark, Reveal, SectionHead } from "@/components/site/primitives";
import { site } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About Us — ${site.name}` },
      {
        name: "description",
        content: `The story, mission and people behind ${site.name}, a ${site.city}-based exporter of Indian produce, spices and stone.`,
      },
      { property: "og:title", content: `About ${site.name}` },
      {
        property: "og:description",
        content: "A trading house built on trust, quality and long-term partnerships.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const values = [
  ["Integrity", "What we sample is what we ship. No exceptions."],
  ["Precision", "Grades, documents and timelines handled with care."],
  ["Partnership", "We measure success in decades, not single orders."],
  ["Responsibility", "Fair prices for farmers and traceable supply chains."],
];
const team = [
  ["Arjun Mehta", "Founder & Managing Director"],
  ["Meera Iyer", "Head of Quality"],
  ["Rohan Shah", "Director, Logistics"],
  ["Ananya Rao", "Key Accounts, Europe"],
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="Our Heritage & Vision"
        title={
          <>
            India's harvest, <em className="text-gold-soft">honoured</em>.
          </>
        }
        text={site.tagline}
        image="/images/green-paddy.jpg"
        crumbs={[{ label: "About" }]}
      />
      <section className="py-16 md:py-24 bg-ivory relative overflow-hidden">
        {/* Subtle large gold infinity watermark */}
        <InfinityWatermark className="hidden sm:block absolute -right-20 top-1/2 -translate-y-1/2 w-[40rem] h-[20rem] text-[#C9973F] opacity-[0.04]" />
        <div className="container-x grid gap-10 lg:gap-16 lg:grid-cols-2 relative z-10 min-w-0">
          <SectionHead eyebrow="Our Story" title="Founded on a simple promise." />
          <Reveal className="space-y-5 text-base sm:text-lg leading-relaxed text-muted-foreground">
            <p>
              {site.name} began in {site.established} with one container of basmati rice and a
              belief that Indian produce deserved to be presented to the world with the same care as
              any luxury good.
            </p>
            <p>
              Today we work with hundreds of farms, spice cooperatives and stone quarries,
              delivering to importers across our 7 key destination markets worldwide — still with the same obsession over
              grade, paperwork and punctuality.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="section-y bg-[#071A33] text-[#F4F1EA]">
        <div className="container-x grid gap-px overflow-hidden rounded-2xl border hairline bg-gold/20 grid-cols-1 md:grid-cols-2">
          {[
            [
              "Mission",
              "To be the most trusted bridge between India's producers and the world's buyers.",
            ],
            [
              "Vision",
              "A world where every Indian product travels with full traceability and fair value.",
            ],
          ].map(([t, d]) => (
            <div key={t} className="bg-[#0E2A4F]/80 p-6 sm:p-12 min-w-0">
              <p className="eyebrow">{t}</p>
              <p className="mt-4 font-display text-2xl leading-snug sm:text-3xl md:text-4xl">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section-y bg-sand">
        <div className="container-x grid items-center gap-16 lg:grid-cols-2">
          <img
            src={warehouse}
            alt="Our export warehouse"
            loading="lazy"
            className="aspect-[4/5] w-full rounded-2xl object-cover shadow-lift"
          />
          <Reveal>
            <p className="eyebrow">Founder's Message</p>
            <blockquote className="mt-6 font-display text-3xl italic leading-snug text-[#071A33] md:text-4xl">
              “Every bag that leaves our warehouse carries our name. That's why we inspect it as if
              it were going to our own family.”
            </blockquote>
            <p className="mt-8 text-sm">
              <span className="font-medium">Arjun Mehta</span>{" "}
              <span className="text-muted-foreground">· Founder & MD</span>
            </p>
          </Reveal>
        </div>
      </section>
      <section className="section-y bg-ivory">
        <div className="container-x">
          <SectionHead eyebrow="Values" title="What guides us." />
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {values.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.08} className="border-t-2 border-gold pt-6">
                <h3 className="text-2xl text-[#071A33]">{t}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section-y bg-sand">
        <div className="container-x">
          <SectionHead eyebrow="Team" title="The people behind every shipment." />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map(([n, r], i) => (
              <Reveal
                key={n}
                delay={i * 0.08}
                className="rounded-2xl border hairline bg-card p-8 shadow-soft"
              >
                <div className="grid h-20 w-20 place-items-center rounded-full bg-[#071A33] font-display text-3xl text-gold-soft">
                  {(n ?? "")
                    .split(" ")
                    .map((x) => x.charAt(0))
                    .join("")}
                </div>
                <h3 className="mt-6 text-2xl text-[#071A33]">{n}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section-y bg-ivory">
        <div className="container-x">
          <SectionHead eyebrow="Infrastructure" title="Warehouses, labs and logistics." />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[
              [warehouse, "Bonded warehouse, Navi Mumbai"],
              [spices, "Spices & botanical processing unit, Gujarat"],
              [port, "Loading at JNPT, Mumbai"],
            ].map(([src, l]) => (
              <figure key={l} className="group overflow-hidden rounded-2xl">
                <img
                  src={src}
                  alt={l}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <figcaption className="mt-3 text-sm text-muted-foreground">{l}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Official Export Certifications & Licenses Section */}
      <section id="certifications" className="section-y bg-[#071A33] text-[#F4F1EA] scroll-mt-24">
        <div className="container-x">
          <SectionHead
            dark
            eyebrow="Government & Global Compliance"
            title="Export Certifications & Licenses."
            text="Every commodity shipped by Aurelian International is accompanied by mandatory government registrations, phytosanitary clearance, and independent pre-shipment quality inspection."
            align="center"
          />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              {
                code: "INDIA ORGANIC",
                title: "Jaivik Bharat / India Organic",
                desc: "National Programme for Organic Production (NPOP) certification ensuring authentic chemical-free organic Indian agricultural produce.",
                tag: "NPOP Certified",
              },
              {
                code: "SPICES BOARD",
                title: "Spices Board of India",
                desc: "Certified Registration cum Enrolment Certificate (CRES) holder for direct export of premium whole and powdered Indian spices.",
                tag: "CRES Certified",
              },
              {
                code: "ISO 22000",
                title: "Food Safety Management System",
                desc: "Audited manufacturing and packaging processes aligned with global FSMS standards and HACCP principles.",
                tag: "ISO Audited",
              },
              {
                code: "SGS / GEO-CHEM",
                title: "Third-Party Inspection",
                desc: "Container stuffing and port inspection reports with lot-wise laboratory assay certificates for export compliance.",
                tag: "Port Inspected",
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
