import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Download,
  FileCheck,
  FlaskConical,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { CertGrid } from "@/components/site/Blocks";
import { PageHeader } from "@/components/site/PageHeader";
import { btn } from "@/components/site/primitives";
import { site } from "@/data/site";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: `Certifications & Regulatory Licences — ${site.name}` },
      {
        name: "description",
        content:
          "DGFT, APEDA, Spices Board, FSSAI, ISO 22000:2018 and MSME registrations. Audited export credentials and lab-tested compliance.",
      },
      { property: "og:title", content: `Certifications & Compliance — ${site.name}` },
      {
        property: "og:description",
        content:
          "Every licence, audit and third-party inspection certificate behind our global exports.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CertificationsPage,
});

function CertificationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Compliance & Accreditation"
        title="Zero-Defect Documentation"
        text="Audited, licensed, and registered with statutory bodies of India. Every container sails with certified laboratory reports and pre-cleared customs paperwork."
        image="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80"
        crumbs={[{ label: "Certifications" }]}
      />

      {/* Main Licences Grid */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="container-x">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="eyebrow">Statutory Registrations</span>
            <h2 className="mt-2 font-display text-4xl text-[#071A33] md:text-5xl">
              Government Recognized Export House
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Official registrations valid across all ports of entry in the United Kingdom, United
              States, European Union, UAE, and APAC.
            </p>
          </div>
          <CertGrid />
        </div>
      </section>

      {/* Quality Testing Protocols */}
      <section className="py-16 md:py-24 bg-sand/30 border-y hairline">
        <div className="container-x">
          <div className="max-w-2xl mb-12">
            <span className="eyebrow">Rigorous Quality Control</span>
            <h2 className="mt-2 font-display text-4xl text-[#071A33] md:text-5xl">
              Multi-Stage Laboratory Assays
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Before sealing any container, independent NABL-accredited laboratories inspect and
              verify batch samples for international purity standards.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: FlaskConical,
                title: "Chemical & Residue Testing",
                points: [
                  "Gas Chromatography (GC-MS/MS) for pesticide levels",
                  "Heavy metals assay (Lead, Arsenic, Cadmium)",
                  "Aflatoxin testing under 2 ppb / 4 ppb EU thresholds",
                  "Moisture and volatile oil content analysis",
                ],
              },
              {
                icon: ShieldCheck,
                title: "Physical Grading & Optical Sorting",
                points: [
                  "Grain elongation ratio check for Basmati",
                  "Optical color sorting to remove discolored units",
                  "Size grading (e.g., W240, W320 cashews; bold peanuts)",
                  "Foreign matter and broken grain threshold compliance",
                ],
              },
              {
                icon: FileCheck,
                title: "Third-Party Pre-Shipment Inspection",
                points: [
                  "Joint pre-loading inspection with SGS or Bureau Veritas",
                  "Container seal verification and stuffing photographs",
                  "Temperature data loggers for reefer produce",
                  "Fumigation certificates (Aluminium Phosphide / Methyl Bromide)",
                ],
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="rounded-3xl border border-gold/30 bg-card p-8 shadow-soft"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#071A33] text-gold-soft shadow-soft">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl text-[#071A33]">{card.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {card.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-gold mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Verification CTA */}
      <section className="py-16 md:py-24 bg-[#040E1F] text-[#F4F1EA] relative overflow-hidden">
        <div className="container-x max-w-4xl text-center">
          <span className="eyebrow !text-gold-soft">Compliance Desk</span>
          <h2 className="mt-4 font-display text-4xl text-white md:text-5xl">
            Need Document Verification or Audit Reports?
          </h2>
          <p className="mt-4 text-base text-[#D9DDE3] leading-relaxed max-w-2xl mx-auto">
            We provide official notarized copies of our IEC, APEDA, FSSAI licence and recent SGS
            test certificates upon buyer registration.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className={btn.gold}>
              Request Compliance Pack
            </Link>
            <a
              href={`https://wa.me/${site.whatsapp}?text=Hello%20Aurelian,%20please%20send%20your%20company%20licences%20and%20compliance%20certificates.`}
              target="_blank"
              rel="noreferrer"
              className={btn.outlineLight}
            >
              Verify on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
