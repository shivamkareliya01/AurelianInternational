import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import port from "@/assets/port.jpg";
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
  return (
    <>
      <PageHeader eyebrow="Contact" title="Let's Move Your Cargo." text="Share your requirement — our trade desk replies within one business day." image={port} crumbs={[{ label: "Contact" }]} />
      <section className="section-y bg-sand">
        <div className="container-x grid gap-12 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-2">
            {[[Phone, "Phone", site.phone], [Mail, "Email", site.email], [MapPin, "Head Office", site.address]].map(([Icon, l, v]) => {
              const I = Icon as typeof Phone;
              return (
                <div key={l as string} className="flex gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-forest text-gold-soft"><I className="h-5 w-5" /></span>
                  <div><p className="eyebrow">{l as string}</p><p className="mt-1 text-ink">{v as string}</p></div>
                </div>
              );
            })}
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" className={btn.forest}><MessageCircle className="h-4 w-4" /> Chat on WhatsApp</a>
            <iframe title="Office location map" src="https://www.google.com/maps?q=Nariman+Point+Mumbai&output=embed" loading="lazy" className="h-72 w-full rounded-2xl border hairline grayscale" />
          </div>
          <div className="lg:col-span-3"><EnquiryForm /></div>
        </div>
      </section>
    </>
  );
}
