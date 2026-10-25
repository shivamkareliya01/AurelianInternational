import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PageHeader } from "@/components/site/PageHeader";
import { btn } from "@/components/site/primitives";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { site } from "@/data/site";
import { company } from "@/config/company";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact & Request a Quote — ${site.name} | Export Desk` },
      {
        name: "description",
        content: `Connect with Aurelian International trade desk in Morbi, Gujarat, India. Inquire for container shipments of Basmati rice, spices, food powders, produce, and ceramic tiles.`,
      },
      { property: "og:title", content: `Request an Export Quote — ${site.name}` },
      {
        property: "og:description",
        content: "Tell us your required product specifications, volume, and destination discharge port. Fast FOB/CIF quote within 24 hours.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${site.url}/contact` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `Contact Aurelian International — Export Quote` },
      {
        name: "twitter:description",
        content: "Direct export desk for worldwide container cargo from India. Response within 24 hours.",
      },
    ],
    links: [
      { rel: "canonical", href: `${site.url}/contact` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: `Contact ${site.name}`,
          url: `${site.url}/contact`,
          mainEntity: {
            "@type": "Organization",
            name: site.name,
            url: site.url,
            telephone: site.phone,
            email: site.email,
            address: company.schemaAddress,
          },
        }),
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [mobileCardOpen, setMobileCardOpen] = useState(false);
  const [isMapActive, setIsMapActive] = useState(false);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    }
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Direct Trade Desk"
        title="Let's Move Your Cargo."
        text="Share your requirement — our headquarters trade desk replies within one business day with specs and shipping timelines."
        image="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80"
        crumbs={[{ label: "Contact" }]}
      />

      <section className="pt-10 pb-28 sm:py-16 md:py-24 bg-sand/30">
        <div className="container-x grid grid-cols-1 lg:grid-cols-5 gap-12 min-w-0">
          <div className="order-2 lg:order-1 space-y-8 lg:col-span-2 min-w-0">
            <div>
              <p className="eyebrow !text-gold">Global Headquarters</p>
              <h2 className="mt-2 font-display text-3xl text-[#071A33]">{company.locationDisplay}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Operating from Gujarat's prominent manufacturing and commercial export center, with immediate multi-modal connectivity to Kandla and Mundra deepwater ports.
              </p>
            </div>

            <div className="space-y-5">
              {[
                [Phone, "Phone & Direct Line", site.phone],
                [Mail, "Official Trade Email", site.email],
                [MapPin, "Registered Office", site.address],
              ].map(([Icon, l, v]) => {
                const I = Icon as typeof Phone;
                return (
                  <div key={l as string} className="flex gap-4 items-start">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#071A33] text-gold-soft shadow-soft">
                      <I className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="eyebrow !text-[0.65rem]">{l as string}</p>
                      <p className="mt-1 text-sm font-medium text-ink leading-relaxed">{v as string}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <a
              href={`https://wa.me/${site.whatsapp}?text=Hello%20Aurelian%20International,%20I%20have%20an%20import%20enquiry.`}
              target="_blank"
              rel="noreferrer"
              className={btn.navy}
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" /> Instant WhatsApp Desk
            </a>

            {/* Premium Google Map Block with Floating Info Card & Click-to-Activate */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onMouseLeave={() => setIsMapActive(false)}
              className="relative h-[320px] md:h-[400px] w-full overflow-hidden rounded-[24px] border border-[#C9973F]/35 shadow-[0_12px_40px_rgba(7,26,51,0.14)] group"
            >
              <iframe
                title="Aurelian International office in Morbi"
                src={company.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className={cn(
                  "h-full w-full border-0 transition-all duration-500",
                  !isMapActive && "pointer-events-none"
                )}
                style={{ filter: "saturate(0.9) contrast(1.02)" }}
              />

              {/* Click to activate overlay when pointer-events are disabled so scroll is never trapped */}
              {!isMapActive && (
                <button
                  type="button"
                  onClick={() => setIsMapActive(true)}
                  className="absolute inset-0 z-[5] flex items-end justify-center pb-4 bg-transparent cursor-pointer"
                  aria-label="Click to interact with map"
                >
                  <span className="rounded-full bg-[#071A33]/92 border border-[#C9973F]/50 px-3.5 py-1.5 text-xs font-medium text-[#F4F1EA] shadow-lg hover:bg-[#0E2A4F] transition-colors pointer-events-auto">
                    Click to interact with map
                  </span>
                </button>
              )}

              {/* Floating Solid Info Card over top-left */}
              <div className="absolute top-3 left-3 right-3 md:right-auto md:max-w-xs z-10 pointer-events-auto">
                <div className="rounded-2xl border border-[#C9973F]/40 bg-[#071A33] p-4 text-[#F4F1EA] shadow-xl">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#C9973F] animate-pulse" />
                      <h4 className="font-display text-sm tracking-wide text-white">{company.name}</h4>
                    </div>
                    {/* Mobile toggle */}
                    <button
                      type="button"
                      onClick={() => setMobileCardOpen(!mobileCardOpen)}
                      className="md:hidden text-xs text-[#C9973F] underline"
                    >
                      {mobileCardOpen ? "Hide" : "Details"}
                    </button>
                  </div>

                  <div className={mobileCardOpen ? "block mt-2.5" : "hidden md:block mt-2.5"}>
                    <p className="text-[0.72rem] text-[#D9DDE3] leading-relaxed line-clamp-3">
                      {company.addressOneLine}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                      <a
                        href={company.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-[#C9973F] px-2.5 py-1 text-[0.7rem] font-medium text-[#071A33] hover:bg-[#D4A54E] transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" /> Maps
                      </a>
                      <a
                        href={company.directionsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[0.7rem] font-medium text-white hover:bg-white/20 transition-colors"
                      >
                        <Navigation className="h-3 w-3 text-[#C9973F]" /> Directions
                      </a>
                      <a
                        href={`tel:${company.phone}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[0.7rem] font-medium text-white hover:bg-white/20 transition-colors"
                      >
                        <Phone className="h-3 w-3 text-[#C9973F]" /> Call
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-3 min-w-0 w-full max-w-full flex justify-center">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
