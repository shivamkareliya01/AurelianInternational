import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { categories } from "@/data/products";
import { site } from "@/data/site";
import { Logo } from "./Logo";

export function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="border-t-2 border-[#C9973F] bg-[#040E1F] text-[#F4F1EA]">
      <div className="container-x grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo size="lg" variant="stacked" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#D9DDE3]">
            A {site.city}-based trading house exporting India's finest agricultural produce, spices,
            and ceramic tiles to 7 key destination markets worldwide.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { href: site.socials.instagram, Icon: Instagram, l: "Instagram" },
              { href: site.socials.facebook, Icon: Facebook, l: "Facebook" },
              { href: site.socials.linkedin, Icon: Linkedin, l: "LinkedIn" },
            ].map(({ href, Icon, l }) => (
              <a
                key={l}
                href={href}
                aria-label={l}
                target="_blank"
                rel="noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full border border-[#C9973F]/35 text-[#D9DDE3] transition-colors hover:bg-[#C9973F] hover:text-[#040E1F] hover:border-[#C9973F]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <h3 className="eyebrow">Products</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {categories
              .filter(
                (c) => c.slug !== "natural-stones",
              )
              .map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/products/$category"
                    params={{ category: c.slug }}
                    className="text-[#D9DDE3] hover:text-[#F2C86E] transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <h3 className="eyebrow">Company</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {(
              [
                ["/about", "About"],
                ["/markets", "Markets"],
                ["/contact", "Contact"],
              ] as const
            ).map(([to, l]) => (
              <li key={to}>
                <Link to={to} className="text-[#D9DDE3] hover:text-[#F2C86E] transition-colors">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-4">
          <h3 className="eyebrow">Contact</h3>
          <ul className="mt-5 space-y-3 text-sm text-[#D9DDE3]">
            <li className="flex gap-3">
              <Phone className="h-4 w-4 shrink-0 text-[#C9973F]" />
              {site.phone}
            </li>
            <li className="flex gap-3">
              <Mail className="h-4 w-4 shrink-0 text-[#C9973F]" />
              {site.email}
            </li>
            <li className="flex gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-[#C9973F]" />
              {site.address}
            </li>
          </ul>
          <form
            className="mt-8 flex rounded-full border border-[#C9973F]/40 bg-[#071A33]/80 p-1 focus-within:border-[#C9973F] focus-within:ring-2 focus-within:ring-[#C9973F]/25"
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^\S+@\S+\.\S+$/.test(email)) {
                toast.error("Please enter a valid email");
                return;
              }
              toast.success("Subscribed — thank you.");
              setEmail("");
            }}
          >
            <label htmlFor="nl" className="sr-only">
              Email
            </label>
            <input
              id="nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Trade insights, monthly"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-[#F4F1EA] placeholder:text-[#D9DDE3]/60 focus:outline-none"
            />
            <button className="rounded-full bg-gradient-to-r from-[#9A6B1F] via-[#F2C86E] to-[#C9973F] px-5 py-2 text-sm font-semibold text-[#071A33] hover:shadow-[0_0_15px_rgba(201,151,63,0.4)] transition-all cursor-pointer">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-[#C9973F]/20">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-[#D9DDE3]/80 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
