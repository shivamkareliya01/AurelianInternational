import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type Crumb = { label: string; to?: string; params?: Record<string, string> };

export function PageHeader({
  eyebrow,
  title,
  text,
  crumbs,
  image,
  subRow,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  crumbs: Crumb[];
  image?: string;
  subRow?: ReactNode;
}) {
  const bgImg = image || "/images/green-paddy.jpg";

  return (
    <section className="relative overflow-hidden bg-[#040E1F] pb-20 pt-36 text-[#F4F1EA] md:pb-28 md:pt-44">
      {/* 1. Visible, clear background photograph */}
      <img
        src={bgImg}
        alt=""
        loading="eager"
        decoding="sync"
        style={{ filter: "brightness(0.75) contrast(1.04) saturate(1.06)" }}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* 2. Deep navy gradient overlay at most 45% so picture remains clearly visible */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(4, 14, 31, 0.45) 0%, rgba(4, 14, 31, 0.35) 55%, rgba(4, 14, 31, 0.20) 100%)",
        }}
      />

      {/* 3. Subtle ambient bottom vignette */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{
          background: "linear-gradient(to top, rgba(4, 14, 31, 0.5) 0%, transparent 100%)",
        }}
      />

      <div className="container-x relative z-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#D9DDE3]"
        >
          <Link to="/" className="hover:text-[#F2C86E] transition-colors">
            Home
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3 text-[#C9973F]/70" />
              {c.to ? (
                <Link
                  to={c.to}
                  params={c.params as never}
                  className="hover:text-[#F2C86E] transition-colors"
                >
                  {c.label}
                </Link>
              ) : (
                <span className="text-white font-semibold">{c.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Eyebrow */}
        <p className="eyebrow mt-8 !text-[#F2C86E]">{eyebrow}</p>

        {/* Large Serif Title */}
        <h1 className="mt-3 max-w-4xl font-display text-5xl leading-[1.02] text-white md:text-7xl">
          {title}
        </h1>

        {subRow && <div className="mt-4">{subRow}</div>}

        {/* Subtle Gold Underline */}
        <div className="mt-5 h-0.5 w-16 bg-gradient-to-r from-[#9A6B1F] via-[#F2C86E] to-[#C9973F]" />

        {/* Subtitle / Explanatory Text */}
        {text && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#D9DDE3] md:text-lg">
            {text}
          </p>
        )}
      </div>
    </section>
  );
}
