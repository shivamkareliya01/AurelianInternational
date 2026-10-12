import { createFileRoute } from "@tanstack/react-router";
import farm from "@/assets/farm.jpg";
import warehouse from "@/assets/warehouse.jpg";
import marble from "@/assets/marble.jpg";
import port from "@/assets/port.jpg";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal, SectionHead } from "@/components/site/primitives";
import { site } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About Us — ${site.name}` },
      { name: "description", content: `The story, mission and people behind ${site.name}, a ${site.city}-based exporter of Indian produce, spices and stone.` },
      { property: "og:title", content: `About ${site.name}` },
      { property: "og:description", content: "A trading house built on trust, quality and long-term partnerships." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const values = [["Integrity", "What we sample is what we ship. No exceptions."], ["Precision", "Grades, documents and timelines handled with care."], ["Partnership", "We measure success in decades, not single orders."], ["Responsibility", "Fair prices for farmers and traceable supply chains."]];
const team = [["Arjun Vardhan", "Founder & Managing Director"], ["Meera Iyer", "Head of Quality"], ["Rohan Shah", "Director, Logistics"], ["Ananya Rao", "Key Accounts, Europe"]];

function About() {
  return (
    <>
      <PageHeader eyebrow="About" title={<>India's harvest, <em className="text-gold-soft">honoured</em>.</>} text={site.tagline} image={farm} crumbs={[{ label: "About" }]} />
      <section className="section-y bg-ivory">
        <div className="container-x grid gap-16 lg:grid-cols-2">
          <SectionHead eyebrow="Our Story" title="Founded on a simple promise." />
          <Reveal className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>{site.name} began in {site.established} with one container of basmati rice and a belief that Indian produce deserved to be presented to the world with the same care as any luxury good.</p>
            <p>Today we work with hundreds of farms, spice cooperatives and stone quarries, delivering to importers in more than 25 countries — still with the same obsession over grade, paperwork and punctuality.</p>
          </Reveal>
        </div>
      </section>
      <section className="section-y bg-forest text-on-forest">
        <div className="container-x grid gap-px overflow-hidden rounded-2xl border hairline bg-gold/20 md:grid-cols-2">
          {[["Mission", "To be the most trusted bridge between India's producers and the world's buyers."], ["Vision", "A world where every Indian product travels with full traceability and fair value."]].map(([t, d]) => (
            <div key={t} className="bg-forest p-12"><p className="eyebrow">{t}</p><p className="mt-5 font-display text-3xl leading-snug md:text-4xl">{d}</p></div>
          ))}
        </div>
      </section>
      <section className="section-y bg-sand">
        <div className="container-x grid items-center gap-16 lg:grid-cols-2">
          <img src={warehouse} alt="Our export warehouse" loading="lazy" className="aspect-[4/5] w-full rounded-2xl object-cover shadow-lift" />
          <Reveal>
            <p className="eyebrow">Founder's Message</p>
            <blockquote className="mt-6 font-display text-3xl italic leading-snug text-forest md:text-4xl">“Every bag that leaves our warehouse carries our name. That's why we inspect it as if it were going to our own family.”</blockquote>
            <p className="mt-8 text-sm"><span className="font-medium">Arjun Vardhan</span> <span className="text-muted-foreground">· Founder & MD</span></p>
          </Reveal>
        </div>
      </section>
      <section className="section-y bg-ivory">
        <div className="container-x">
          <SectionHead eyebrow="Values" title="What guides us." />
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {values.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.08} className="border-t-2 border-gold pt-6"><h3 className="text-2xl text-forest">{t}</h3><p className="mt-3 text-sm text-muted-foreground">{d}</p></Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section-y bg-sand">
        <div className="container-x">
          <SectionHead eyebrow="Team" title="The people behind every shipment." />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map(([n, r], i) => (
              <Reveal key={n} delay={i * 0.08} className="rounded-2xl border hairline bg-card p-8 shadow-soft">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-forest font-display text-3xl text-gold-soft">{n.split(" ").map((x) => x[0]).join("")}</div>
                <h3 className="mt-6 text-2xl text-forest">{n}</h3><p className="mt-1 text-sm text-muted-foreground">{r}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section-y bg-ivory">
        <div className="container-x">
          <SectionHead eyebrow="Infrastructure" title="Warehouses, labs and logistics." />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[[warehouse, "Bonded warehouse, Navi Mumbai"], [marble, "Stone processing yard, Rajasthan"], [port, "Loading at JNPT, Mumbai"]].map(([src, l]) => (
              <figure key={l} className="group overflow-hidden rounded-2xl"><img src={src} alt={l} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-1000 group-hover:scale-105" /><figcaption className="mt-3 text-sm text-muted-foreground">{l}</figcaption></figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
