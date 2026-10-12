import { createFileRoute } from "@tanstack/react-router";
import port from "@/assets/port.jpg";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/primitives";
import { WorldMap } from "@/components/site/WorldMap";
import { markets } from "@/data/content";
import { site } from "@/data/site";

export const Route = createFileRoute("/markets")({
  head: () => ({
    meta: [
      { title: `Markets We Serve — ${site.name}` },
      { name: "description", content: "Exporting from India to the UK, USA, UAE, Europe, Southeast Asia and Africa." },
      { property: "og:title", content: `Global Markets — ${site.name}` },
      { property: "og:description", content: "Regions, ports and products we ship to around the world." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Markets,
});

function Markets() {
  return (
    <>
      <PageHeader eyebrow="Markets" title="Where our cargo lands." text="Regular sailings to six regions and more than 25 countries." image={port} crumbs={[{ label: "Markets" }]} />
      <section className="bg-forest-deep pb-20 text-on-forest"><div className="container-x"><WorldMap /></div></section>
      <section className="section-y bg-ivory">
        <div className="container-x grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {markets.map((m, i) => (
            <Reveal key={m.region} delay={i * 0.06} className="rounded-2xl border hairline bg-card p-8 shadow-soft">
              <span className="text-4xl" aria-hidden>{m.flag}</span>
              <h2 className="mt-5 text-3xl text-forest">{m.region}</h2>
              <dl className="mt-6 space-y-4 text-sm">
                <div><dt className="eyebrow !text-[0.6rem]">Key ports</dt><dd className="mt-1 text-ink">{m.ports}</dd></div>
                <div><dt className="eyebrow !text-[0.6rem]">Top products</dt><dd className="mt-1 text-ink">{m.products}</dd></div>
              </dl>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
