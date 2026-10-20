import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PhoneCall, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal, SectionHead } from "@/components/site/primitives";
import { allProducts, categories, getCategory } from "@/data/products";
import { site } from "@/data/site";
import { useBasket } from "@/lib/basket";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$category/")({
  loader: ({ params }) => {
    const category = getCategory(params.category);
    if (!category) throw notFound();
    return { slug: category.slug };
  },
  head: ({ loaderData }) => {
    const c = loaderData ? getCategory(loaderData.slug) : undefined;
    const title = c ? `${c.name} Exporter from India — ${site.name}` : "Category unavailable";
    return {
      meta: [
        { title },
        { name: "description", content: c?.blurb ?? "" },
        { property: "og:title", content: title },
        { property: "og:description", content: c?.blurb ?? "" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(c ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  component: CategoryPage,
});



const buyerPillars = [
  {
    title: "Direct Producer Sourcing",
    desc: "Direct farm, mill, and quarry partnerships across India eliminating middlemen and ensuring true origin traceability.",
  },
  {
    title: "Rigorous Export QC & Lab COA",
    desc: "Batch-wise third-party SGS / Bureau Veritas testing, phytosanitary clearance, and full compliance documentation.",
  },
  {
    title: "Customized Export Packaging",
    desc: "Private label pouches, vacuum barrier bags, bulk poly-lined sacks, and ISPM-15 export-fumigated wooden crates.",
  },
  {
    title: "Multi-Port Global Logistics",
    desc: "Scheduled ocean container sailings and air cargo allocations from Mundra, Nhava Sheva (JNPT), Cochin, and Chennai.",
  },
];

function CategoryPage() {
  const { slug } = Route.useLoaderData();
  const c = getCategory(slug)!;
  const { openBasket } = useBasket();

  return (
    <>
      {/* 1. Category Hero Banner */}
      <PageHeader
        eyebrow={`${c.products.length} Export-Grade Products Available`}
        title={c.name}
        text={c.blurb}
        image={c.image}
        crumbs={[{ label: "Products", to: "/products" }, { label: c.name }]}
      />

      {/* 2. Sticky Category Pill Bar with Smooth Gold Active Indicator */}
      <nav
        aria-label="Category Navigation Bar"
        className="sticky top-20 z-30 border-y border-[#C9973F]/25 bg-[#071A33]/95 backdrop-blur-xl shadow-lg"
      >
        <div className="container-x flex items-center gap-2 overflow-x-auto py-3.5 scrollbar-none">
          {/* Link to All Products */}
          <Link
            to="/products"
            className="relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-[#D9DDE3] hover:text-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>All Categories</span>
            <span className="rounded-full bg-white/10 text-gold-soft px-2 py-0.5 text-[10px] font-bold">
              {allProducts.length}
            </span>
          </Link>

          {/* Individual Category Pills */}
          {categories.map((cat) => {
            const active = cat.slug === c.slug;
            const displayName = cat.slug === "dehydrated-powders" ? "Dehydrated Powders" : cat.name;

            return (
              <Link
                key={cat.slug}
                to="/products/$category"
                params={{ category: cat.slug }}
                className={cn(
                  "relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap",
                  active ? "text-[#040E1F]" : "text-[#D9DDE3] hover:text-white hover:bg-white/10",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="activeCategoryPillCat"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#9A6B1F] via-[#C9973F] to-[#F2C86E] shadow-md"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{displayName}</span>
                <span
                  className={cn(
                    "relative z-10 rounded-full px-2 py-0.5 text-[10px] font-bold",
                    active ? "bg-[#040E1F]/20 text-[#040E1F]" : "bg-white/10 text-gold-soft",
                  )}
                >
                  {cat.products.length}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 3. Product Cards Catalog Grid */}
      <section className="py-16 md:py-24 bg-[#FAF8F3]">
        <div className="container-x">
          <div className="flex items-center justify-between pb-6 mb-10 border-b border-[#E3E7EE]">
            <p className="text-sm font-medium text-[#071A33]">
              Showing all <strong className="text-gold font-bold">{c.products.length}</strong>{" "}
              export products in {c.name}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {c.products.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.03} className="h-full">
                <ProductCard product={p} category={c} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Buyers Choose Us Strip */}
      <section className="py-16 md:py-20 bg-[#071A33] text-white border-y border-[#C9973F]/25 relative overflow-hidden">
        <div className="container-x">
          <SectionHead
            eyebrow="Global Trade Advantage"
            title="Why International Importers Choose Aurelian"
            text="Decades of agricultural and mineral export expertise ensuring consistent specification delivery across international borders."
            align="center"
            className="text-white"
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {buyerPillars.map((pillar, idx) => (
              <Reveal
                key={pillar.title}
                delay={idx * 0.07}
                className="rounded-2xl border border-[#C9973F]/30 bg-[#0E2A4F]/60 p-6 shadow-md backdrop-blur-sm"
              >
                <div className="h-1 w-10 bg-gradient-to-r from-[#C9973F] to-[#F2C86E] rounded-full mb-4" />
                <h4 className="font-display text-lg font-semibold text-[#F2C86E]">
                  {pillar.title}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[#D9DDE3]/85">{pillar.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Request a Quote Banner */}
      <section className="py-16 md:py-20 bg-[#FAF8F3]">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071A33] via-[#0E2A4F] to-[#071A33] p-8 md:p-12 border border-[#C9973F]/40 shadow-2xl text-white">
            <div className="relative z-10 max-w-3xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F2C86E]">
                Direct Commercial Desk
              </span>
              <h2 className="mt-2 font-display text-3xl md:text-5xl font-semibold leading-tight text-white">
                Looking for Bulk Export Quotation or Custom Specifications?
              </h2>
              <p className="mt-4 text-sm md:text-base leading-relaxed text-[#D9DDE3]/90">
                Connect directly with our export desk for FOB / CIF quotes, custom mesh sizing, private label packaging, and international compliance dossiers.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  hash="enquiry-form"
                  className="rounded-full bg-gradient-to-r from-[#C9973F] via-[#F2C86E] to-[#C9973F] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#071A33] shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
                >
                  Review Commercial Quotation
                </Link>
                <Link
                  to="/contact"
                  className="rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-[#071A33] transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Contact Export Desk</span>
                </Link>
              </div>
            </div>

            {/* Subtle background decorative emblem */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 opacity-10 pointer-events-none">
              <ShieldCheck className="h-96 w-96 text-[#F2C86E]" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

