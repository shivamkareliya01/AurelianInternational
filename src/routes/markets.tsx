// src/routes/markets.tsx
import { createFileRoute } from "@tanstack/react-router";
import { Anchor } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { TradeRouteMap } from "@/components/site/TradeRouteMap";
import { site } from "@/data/site";

export const Route = createFileRoute("/markets")({
  head: () => ({
    meta: [
      { title: `Global Export Markets & Trade Corridors — ${site.name}` },
      {
        name: "description",
        content:
          "Direct export maritime corridors from India to key global markets across USA, Europe, Germany, UAE, Saudi Arabia, South Africa, Kenya, and Australia.",
      },
      { property: "og:title", content: `Global Export Markets & Trade Corridors — ${site.name}` },
      {
        property: "og:description",
        content:
          "Direct export maritime corridors from India to key global markets across USA, Europe, Germany, UAE, South Africa, Kenya, and Australia.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${site.url}/markets` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `Global Export Markets — ${site.name}` },
      {
        name: "twitter:description",
        content: "Worldwide maritime logistics and shipping corridors from Indian ports.",
      },
    ],
    links: [
      { rel: "canonical", href: `${site.url}/markets` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `${site.url}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Markets",
              item: `${site.url}/markets`,
            },
          ],
        }),
      },
    ],
  }),
  component: Markets,
});

function Markets() {
  return (
    <>
      <PageHeader
        eyebrow="Global Trade Corridors"
        title="We Serve to Global Market"
        text="Direct container shipments move from India's premier deepwater ports to our key international markets across the USA, Europe, Germany, UAE, South Africa, Kenya, and Australia."
        image="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80"
        crumbs={[{ label: "Markets" }]}
      />

      {/* Interactive Global Sea Routes Map */}
      <section className="py-16 md:py-24 bg-[#040E1F] text-[#F4F1EA] relative overflow-hidden">
        <div className="container-x">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="eyebrow !text-gold-soft">Direct Global Logistics</span>
            <h2 className="mt-2 font-display text-4xl text-white md:text-5xl">
              Connecting India to Global Markets.
            </h2>
            <p className="mt-3 text-sm text-[#D9DDE3]">
              Direct container departures from India's gateway ports to all major destination markets with scheduled liner sailings.
            </p>
          </div>

          <TradeRouteMap />

          {/* Key Port Hubs Strip */}
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              [
                "Gujarat Gateway",
                "Mundra / Kandla",
                "Direct rail access from Morbi and northern agricultural belts powering containerized exports.",
              ],
              [
                "JNPT, Mumbai",
                "Container Terminal",
                "India's premier container port handling scheduled sailings to the Americas, Europe, and Africa.",
              ],
              [
                "Chennai Port",
                "Coromandel Coast",
                "Specialized stone, granite block crating, and maritime loading for global markets.",
              ],
              [
                "Cochin Port",
                "Spice Terminal",
                "Direct cold-chain and dry container sailings for spices and fresh agricultural produce.",
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
    </>
  );
}

