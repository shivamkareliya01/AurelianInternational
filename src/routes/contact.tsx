import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PageHeader } from "@/components/site/PageHeader";
import { btn } from "@/components/site/primitives";
import { site } from "@/data/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact & Request a Quote — ${site.name}` },
      { name: "description", content: `Request export pricing for Indian rice, spices, produce, stone and more. Reply within one business day.` },
      { property: "og:title", content: `Request a Quote — ${site.name}` },
      { property: "og:description", content: "Tell us what you need and where it's going. We'll handle the rest." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const mapUrl = "https://maps.google.com/maps?q=Maker%20Chambers%20IV%2C%20Nariman%20Point%2C%20Mumbai%20400021&t=&z=16&ie=UTF8&iwloc=&output=embed";

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
              <h2 className="mt-2 font-display text-3xl text-[#071A33]">Mumbai, India</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Operating out of Mumbai's premier commercial hub, minutes from JNPT port terminal coordination centers.
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
                      <p className="mt-1 text-sm font-medium text-ink">{v as string}</p>
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

            {/* Working Google Map with rounded corners and subtle navy tint */}
            <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-gold/30 shadow-soft group">
              <iframe
                title="Office Location: Maker Chambers IV, Nariman Point, Mumbai"
                src={mapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0 transition-opacity duration-300"
              />
              {/* Soft navy overlay tint with blend mode */}
              <div className="pointer-events-none absolute inset-0 bg-[#071A33]/15 mix-blend-color" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/20 rounded-2xl" />
            </div>
          </div>

          <div className="lg:col-span-3">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
