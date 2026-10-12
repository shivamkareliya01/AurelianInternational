import { createFileRoute } from "@tanstack/react-router";
import spices from "@/assets/spices.jpg";
import { CertGrid } from "@/components/site/Blocks";
import { PageHeader } from "@/components/site/PageHeader";
import { site } from "@/data/site";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: `Certifications & Licences — ${site.name}` },
      { name: "description", content: "DGFT, APEDA, Spices Board, FSSAI, ISO 22000 and MSME registrations held by our export business." },
      { property: "og:title", content: `Certifications — ${site.name}` },
      { property: "og:description", content: "Every licence and certification behind our exports." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="Compliance" title="Certifications" text="Registered, licensed and audited — so your customs clearance is never in doubt." image={spices} crumbs={[{ label: "Certifications" }]} />
      <section className="section-y bg-ivory"><div className="container-x"><CertGrid /></div></section>
    </>
  ),
});
