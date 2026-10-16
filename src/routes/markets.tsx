import { createFileRoute, Link } from "@tanstack/react-router";
import { Anchor, ArrowRight, Clock, FileCheck, Globe2, ShieldCheck, Ship } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal, btn } from "@/components/site/primitives";
import { WorldMap } from "@/components/site/WorldMap";
import { markets } from "@/data/content";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/markets")({
  head: () => ({
    meta: [
      { title: `Global Markets We Serve — ${site.name}` },
      { name: "description", content: "Regular container and bulk export sailings from India to the UK, USA, UAE, Europe, Southeast Asia and Africa." },
      { property: "og:title", content: `Global Markets — ${site.name}` },
      { property: "og:description", content: "Regions, ports, shipping lines and products we export around the world." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Markets,
});

const transitTimes: Record<string, string> = {
  "United Kingdom": "22–26 Days (Direct Sea Transit)",
  "United States": "28–34 Days (East Coast) / 38–42 Days (West Coast)",
  "United Arab Emirates": "4–6 Days (Express Gulf Transit)",
  "European Union": "24–28 Days (North Sea & Med Ports)",
  "Southeast Asia": "8–12 Days (Straits & East Asia)",
  "Africa": "14–20 Days (East & West African Berths)",
};

function Markets() {
  return (
    <>
      <PageHeader
        eyebrow="Global Trade Corridors"
        title="Where Our Cargo Lands"
        text="Scheduled maritime container sailings and breakbulk vessels connecting Mumbai (JNPT), Mundra, and Chennai to over 25 destination ports across six continents."
        image="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80"
        crumbs={[{ label: "Markets" }]}
      />

      {/* Interactive Global Sea Routes Map */}
      <section className="py-16 md:py-24 bg-[#040E1F] text-[#F4F1EA] relative overflow-hidden">
        <div className="container-x">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="eyebrow !text-gold-soft">Active Sea Lanes</span>
            <h2 className="mt-2 font-display text-4xl text-white md:text-5xl">
              Real-Time Global Route Coverage
            </h2>
            <p className="mt-3 text-sm text-[#D9DDE3]">
              Live tracking, pre-cleared bills of lading, and priority berthing agreements with Maersk, MSC, CMA CGM, and Hapag-Lloyd.
            </p>
          </div>

          <div className="rounded-3xl border border-gold/30 bg-[#071A33]/50 p-6 md:p-10 shadow-2xl backdrop-blur-sm">
            <WorldMap />
          </div>

          {/* Key Port Hubs Strip */}
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["JNPT, Mumbai", "Primary Gateway", "Automated container terminals handling 65% of our western sea freight."],
              ["Mundra Port", "Bulk & Agricultural", "Direct rail connectivity from North Indian grain belts and Gujarat."],
              ["Chennai Port", "Coromandel Coast", "Specialized stone and granite block crating and maritime loading."],
              ["Cochin Port", "Spice Terminal", "Direct cold-chain and dry container sailings for Malabar spices."],
            ].map(([port, tag, desc]) => (
              <div key={port} className="rounded-2xl border border-white/10 bg-[#071A33]/70 p-5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-gold">
                  <Anchor className="h-4 w-4" />
                  <span className="eyebrow !text-[0.62rem] !text-gold">{tag}</span>
                </div>
                <h4 className="mt-2 font-display text-xl text-white">{port}</h4>
                <p className="mt-2 text-xs text-[#D9DDE3] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Destination Profiles */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="eyebrow">Destination Profiles</span>
            <h2 className="mt-2 font-display text-4xl text-[#071A33] md:text-5xl">
              Regions & Transit Schedules
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Port-specific documentation sets, local import compliance handling, and tailored packaging for each regulatory zone.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {markets.map((m, i) => (
              <Reveal
                key={m.region}
                delay={i * 0.06}
                className="flex flex-col justify-between rounded-3xl border border-gold/25 bg-card p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl" aria-hidden>{m.flag}</span>
                    <span className="rounded-full bg-sand px-3 py-1 text-[0.65rem] font-semibold text-[#071A33] uppercase tracking-wider">
                      Scheduled Sailings
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-3xl text-[#071A33]">{m.region}</h3>

                  <div className="mt-6 space-y-4 border-t hairline pt-4 text-xs">
                    <div>
                      <dt className="flex items-center gap-1.5 font-medium text-muted-foreground uppercase tracking-wider text-[0.65rem]">
                        <Ship className="h-3.5 w-3.5 text-gold" /> Key Ports of Discharge
                      </dt>
                      <dd className="mt-1 font-semibold text-ink text-sm">{m.ports}</dd>
                    </div>

                    <div>
                      <dt className="flex items-center gap-1.5 font-medium text-muted-foreground uppercase tracking-wider text-[0.65rem]">
                        <Globe2 className="h-3.5 w-3.5 text-gold" /> Primary Products Exported
                      </dt>
                      <dd className="mt-1 text-ink">{m.products}</dd>
                    </div>

                    <div>
                      <dt className="flex items-center gap-1.5 font-medium text-muted-foreground uppercase tracking-wider text-[0.65rem]">
                        <Clock className="h-3.5 w-3.5 text-gold" /> Typical Transit Duration
                      </dt>
                      <dd className="mt-1 font-medium text-[#071A33]">
                        {transitTimes[m.region] || "14–28 Days Transit"}
                      </dd>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t hairline">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#071A33] hover:text-gold transition-colors"
                  >
                    Request Route Rates for {m.region} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-gold/30 bg-sand/40 p-8 md:p-12 text-center max-w-4xl mx-auto">
            <h3 className="font-display text-3xl text-[#071A33]">Need Sea Freight Rates to Another Port?</h3>
            <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
              We ship to over 40 global commercial ports. If your destination is not listed above, our logistics desk can provide direct liner or charter freight within 24 hours.
            </p>
            <Link to="/contact" className={cn(btn.gold, "mt-6 inline-flex")}>
              Contact Trade Logistics Desk
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
