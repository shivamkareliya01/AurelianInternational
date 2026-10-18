// src/routes/markets.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { Anchor, ArrowRight, Clock, FileCheck, Globe2, ShieldCheck, Ship } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal, btn } from "@/components/site/primitives";
import { TradeRouteMap } from "@/components/site/TradeRouteMap";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/markets")({
  head: () => ({
    meta: [
      { title: `Global Markets We Serve — ${site.name}` },
      {
        name: "description",
        content:
          "All shipments move from India to UAE at Jebel Ali, then onward to 6 key destination markets across 5 global regions.",
      },
      { property: "og:title", content: `Global Markets — ${site.name}` },
      {
        property: "og:description",
        content:
          "All shipments move from India to UAE at Jebel Ali, then onward to 6 key destination markets across 5 global regions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Markets,
});

interface MarketCorridorCard {
  region: string;
  flag: string;
  countriesCount: string;
  ports: string;
  products: string;
  transitViaHub: string;
}

const marketCorridors: MarketCorridorCard[] = [
  {
    region: "Gulf",
    flag: "🇦🇪",
    countriesCount: "Central Re-Export",
    ports: "Jebel Ali Port (Dubai)",
    products: "Consolidated bonded re-export, container redistribution, temperature-controlled logistics",
    transitViaHub: "4–6 Days direct feeder from Gujarat Gateway to UAE",
  },
  {
    region: "Europe",
    flag: "🇪🇺",
    countriesCount: "2 Markets via UAE",
    ports: "Rotterdam (Netherlands), Hamburg (Germany)",
    products: "Spices, dehydrated botanical powders, pulses, natural stones & tiles",
    transitViaHub: "20–27 Days via UAE (4–6d feeder + 16–21d onward liner)",
  },
  {
    region: "Americas",
    flag: "🇺🇸",
    countriesCount: "1 Market via UAE",
    ports: "Port of New York / New Jersey (United States)",
    products: "Grains & pulses, fresh produce, spices, granite slabs, dehydrated powders",
    transitViaHub: "24–30 Days via UAE (4–6d feeder + 20–24d transatlantic corridor)",
  },
  {
    region: "Africa",
    flag: "🌍",
    countriesCount: "2 Markets via UAE",
    ports: "Durban (South Africa), Mombasa (Kenya)",
    products: "Grains, pulses, culinary spices, dehydrated powders, porcelain tiles",
    transitViaHub: "11–22 Days via UAE (4–6d feeder + 7–16d coastal loop)",
  },
  {
    region: "Asia-Pacific",
    flag: "🌏",
    countriesCount: "1 Market via UAE",
    ports: "Sydney / Port Botany (Australia)",
    products: "Basmati rice, culinary spices, polished porcelain tiles, granite",
    transitViaHub: "20–28 Days via UAE (4–6d feeder + 16–22d eastbound liner)",
  },
];

function Markets() {
  return (
    <>
      <PageHeader
        eyebrow="Global Trade Corridors"
        title="Global Markets via UAE"
        text="Shipments move from Gujarat, India to UAE at Jebel Ali, then onward to 6 key destination markets across 5 global regions."
        image="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80"
        crumbs={[{ label: "Markets" }]}
      />

      {/* Interactive Global Sea Routes Map */}
      <section className="py-16 md:py-24 bg-[#040E1F] text-[#F4F1EA] relative overflow-hidden">
        <div className="container-x">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="eyebrow !text-gold-soft">Central UAE Architecture</span>
            <h2 className="mt-2 font-display text-4xl text-white md:text-5xl">
              Connecting Through UAE. Every Market.
            </h2>
            <p className="mt-3 text-sm text-[#D9DDE3]">
              All shipments move from India to UAE at Jebel Ali, then onward to each destination country with scheduled liner departures.
            </p>
          </div>

          <TradeRouteMap />

          {/* Key Port Hubs Strip */}
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              [
                "Gujarat Gateway",
                "Mundra / Kandla",
                "Direct rail access from Morbi and northern agricultural belts feeding our UAE re-export facility.",
              ],
              [
                "JNPT, Mumbai",
                "Feeder Gateway",
                "Automated container terminals handling scheduled container feeders into Jebel Ali.",
              ],
              [
                "Chennai Port",
                "Coromandel Coast",
                "Specialized stone and granite block crating and maritime loading for UAE redistribution.",
              ],
              [
                "Cochin Port",
                "Spice Terminal",
                "Direct cold-chain and dry container feeder sailings into our UAE transshipment facility.",
              ],
            ].map(([port, tag, desc]) => (
              <div
                key={port}
                className="rounded-2xl border border-white/10 bg-[#071A33]/70 p-5 backdrop-blur-md"
              >
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
            <span className="eyebrow">Corridor Profiles</span>
            <h2 className="mt-2 font-display text-4xl text-[#071A33] md:text-5xl">
              Regions & Transit Schedules
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Every shipment is routed via UAE with pre-cleared bills of lading, continuous cold-chain monitoring, and scheduled onward connections.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {marketCorridors.map((m, i) => (
              <Reveal
                key={m.region}
                delay={i * 0.05}
                className="flex flex-col justify-between rounded-3xl border border-gold/25 bg-card p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl" aria-hidden>
                      {m.flag}
                    </span>
                    <span className="rounded-full bg-sand px-3 py-1 text-[0.65rem] font-semibold text-[#071A33] uppercase tracking-wider">
                      {m.countriesCount}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl text-[#071A33]">{m.region}</h3>

                  <div className="mt-6 space-y-4 border-t hairline pt-4 text-xs">
                    <div>
                      <dt className="flex items-center gap-1.5 font-medium text-muted-foreground uppercase tracking-wider text-[0.65rem]">
                        <Ship className="h-3.5 w-3.5 text-gold" /> Key Ports of Discharge
                      </dt>
                      <dd className="mt-1 font-semibold text-ink text-xs leading-relaxed">{m.ports}</dd>
                    </div>

                    <div>
                      <dt className="flex items-center gap-1.5 font-medium text-muted-foreground uppercase tracking-wider text-[0.65rem]">
                        <Globe2 className="h-3.5 w-3.5 text-gold" /> Primary Products Exported
                      </dt>
                      <dd className="mt-1 text-ink leading-relaxed">{m.products}</dd>
                    </div>

                    <div>
                      <dt className="flex items-center gap-1.5 font-medium text-muted-foreground uppercase tracking-wider text-[0.65rem]">
                        <Clock className="h-3.5 w-3.5 text-gold" /> Transit Schedule via UAE
                      </dt>
                      <dd className="mt-1 font-medium text-[#071A33] leading-relaxed">
                        {m.transitViaHub}
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
            <h3 className="font-display text-3xl text-[#071A33]">
              Need Sea Freight Rates to Another Port?
            </h3>
            <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
              Through UAE at Jebel Ali, we service 36 sovereign destination markets. If your target discharge port is specialized, our logistics desk can arrange dedicated feeder bookings within 24 hours.
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
