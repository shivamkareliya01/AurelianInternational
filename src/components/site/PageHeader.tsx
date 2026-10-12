import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type Crumb = { label: string; to?: string; params?: Record<string, string> };

export function PageHeader({ eyebrow, title, text, crumbs, image }: { eyebrow: string; title: ReactNode; text?: string; crumbs: Crumb[]; image?: string }) {
  return (
    <section className="relative overflow-hidden bg-forest-deep pb-20 pt-40 text-on-forest md:pb-28 md:pt-48">
      {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="container-x relative">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-on-forest-muted">
          <Link to="/" className="hover:text-gold-soft">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3" />
              {c.to ? <Link to={c.to} params={c.params as never} className="hover:text-gold-soft">{c.label}</Link> : <span className="text-on-forest">{c.label}</span>}
            </span>
          ))}
        </nav>
        <p className="eyebrow mt-10">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-5xl leading-[1.02] md:text-7xl">{title}</h1>
        {text && <p className="mt-6 max-w-2xl text-lg text-on-forest-muted">{text}</p>}
      </div>
    </section>
  );
}
