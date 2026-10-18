import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PageHeader } from "@/components/site/PageHeader";
import { btn } from "@/components/site/primitives";
import { site } from "@/data/site";
import { company } from "@/config/company";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact & Request a Quote — ${site.name}` },
      {
        name: "description",
        content: `Request export pricing for Indian rice, spices, produce, stone and more. Reply within one business day.`,
      },
      { property: "og:title", content: `Request a Quote — ${site.name}` },
      {
        property: "og:description",
        content: "Tell us what you need and where it's going. We'll handle the rest.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [mobileCardOpen, setMobileCardOpen] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Direct Trade Desk"
        title="Let's Move Your Cargo."
        text="Share your requirement — our headquarters trade desk replies within one business day with specs and shipping timelines."
        image="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80"
        crumbs={[{ label: "Contact" }]}
      />

      <section className="py-16 md:py-24 bg-sand/30">
        <div className="container-x grid gap-12 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-2">
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
              <MessageCircle className="h-4 w-4 text-gold-soft" /> Instant WhatsApp Desk
            </a>

            {/* Premium Google Map Block with Floating Glass Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative h-[320px] md:h-[400px] w-full overflow-hidden rounded-[24px] border border-[#C9973F]/35 shadow-[0_12px_40px_rgba(7,26,51,0.14)] group"
            >
              <iframe
                title="Aurelian International office in Morbi"
                src={company.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0 transition-all duration-500"
                style={{ filter: "saturate(0.9) contrast(1.02)" }}
              />

              {/* Floating Glass Info Card over top-left */}
              <div className="absolute top-3 left-3 right-3 md:right-auto md:max-w-xs z-10">
                <div className="rounded-2xl border border-[#C9973F]/40 bg-[#071A33]/92 backdrop-blur-md p-4 text-[#F4F1EA] shadow-xl">
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
          <div className="lg:col-span-3">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
