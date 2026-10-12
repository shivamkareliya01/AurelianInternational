import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { categories } from "@/data/products";
import { site } from "@/data/site";
import { Logo } from "./Logo";

export function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="border-t-2 border-gold bg-forest-deep text-on-forest">
      <div className="container-x grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-on-forest-muted">
            A {site.city}-based trading house exporting India's finest agricultural produce, spices, natural stone and building materials to 25+ countries.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { href: site.socials.instagram, Icon: Instagram, l: "Instagram" },
              { href: site.socials.facebook, Icon: Facebook, l: "Facebook" },
              { href: site.socials.linkedin, Icon: Linkedin, l: "LinkedIn" },
              { href: site.socials.x, Icon: Twitter, l: "X" },
            ].map(({ href, Icon, l }) => (
              <a key={l} href={href} aria-label={l} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border hairline transition-colors hover:bg-gold hover:text-forest-deep">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <h3 className="eyebrow">Products</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {categories.map((c) => (
              <li key={c.slug}><Link to="/products/$category" params={{ category: c.slug }} className="text-on-forest-muted hover:text-gold-soft">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <h3 className="eyebrow">Company</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {([["/about", "About"], ["/markets", "Markets"], ["/certifications", "Certifications"], ["/blog", "Blog"], ["/contact", "Contact"]] as const).map(([to, l]) => (
              <li key={to}><Link to={to} className="text-on-forest-muted hover:text-gold-soft">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-4">
          <h3 className="eyebrow">Contact</h3>
          <ul className="mt-5 space-y-3 text-sm text-on-forest-muted">
            <li className="flex gap-3"><Phone className="h-4 w-4 shrink-0 text-gold" />{site.phone}</li>
            <li className="flex gap-3"><Mail className="h-4 w-4 shrink-0 text-gold" />{site.email}</li>
            <li className="flex gap-3"><MapPin className="h-4 w-4 shrink-0 text-gold" />{site.address}</li>
          </ul>
          <form
            className="mt-8 flex rounded-full border hairline p-1"
            onSubmit={(e) => { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Please enter a valid email"); toast.success("Subscribed — thank you."); setEmail(""); }}
          >
            <label htmlFor="nl" className="sr-only">Email</label>
            <input id="nl" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Trade insights, monthly" className="min-w-0 flex-1 bg-transparent px-4 text-sm text-on-forest placeholder:text-on-forest-muted/70 focus:outline-none" />
            <button className="rounded-full bg-gold px-5 py-2 text-sm font-medium text-forest-deep">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="border-t hairline">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-on-forest-muted md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
