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
    const pageUrl = loaderData ? `${site.url}/products/${loaderData.slug}` : `${site.url}/products`;

    // High-ranking category-specific keyword profiles
    const categorySeoMap: Record<string, { title: string; desc: string; keywords: string }> = {
      "ceramic-tiles": {
        title: `Ceramic Tiles & GVT Vitrified Tiles Exporter Morbi India | ${site.name}`,
        desc: "Direct exporter of premium Glazed Vitrified Tiles (GVT & PGVT) and ceramic floor & wall tiles from Morbi, Gujarat, India. Nano-polished, marble finishes, ISO/CE certified.",
        keywords: "ceramic tiles, tiles, vitrified tiles, GVT tiles, PGVT tiles, Morbi tiles exporter, ceramic tiles manufacturer India, digital floor tiles, wall tiles exporter",
      },
      "spices": {
        title: `Indian Spices Exporter & Supplier — Whole & Ground Spices | ${site.name}`,
        desc: "Premium Indian whole and ground spices exporter. Turmeric fingers, Guntur stemless red chilli, cumin seeds, and Ceylon cinnamon with high volatile oil and ASTA compliance.",
        keywords: "spices, Indian spices, spices exporter India, whole spices supplier, turmeric exporter India, red chilli exporter, cumin seeds exporter, bulk spices India",
      },
      "fresh-vegetables": {
        title: `Fresh Vegetables Exporter India — Red Onion, Potato, Tomato, Garlic | ${site.name}`,
        desc: "Direct farm exporter of Indian fresh vegetables: Nashik red onions, white onions, table potatoes, tomatoes, garlic, and green chillies in climate-controlled reefer containers.",
        keywords: "vegetables, fresh vegetables, fresh vegetables exporter India, Nashik red onion exporter, Indian onion supplier, fresh potato exporter, garlic exporter India",
      },
      "agriculture": {
        title: `Agriculture & Basmati Rice Exporter India — 1121 & 1509 Rice, Grains | ${site.name}`,
        desc: "Leading exporter of 1121 and 1509 Steam/Sella Basmati rice, non-basmati white rice, milling wheat, yellow maize, pulses, and oilseeds from India to global ports.",
        keywords: "agriculture, agricultural commodities exporter, basmati rice exporter India, 1121 steam rice, non-basmati rice, milling wheat supplier, pulses oilseeds India",
      },
      "dehydrated-powders": {
        title: `Dehydrated Vegetable Powders Exporter India — Onion & Garlic Powder | ${site.name}`,
        desc: "Export-grade dehydrated white/pink onion powder, garlic powder, ginger, tomato, and moringa leaf powder. Free-flowing, intense natural aroma, microbiological compliance.",
        keywords: "dehydrated powders, dehydrated onion powder, garlic powder exporter India, dehydrated vegetables India, onion flakes, spice powders manufacturer",
      },
      "fresh-fruits": {
        title: `Fresh Fruits Exporter India — Cavendish Banana, Mango, Pomegranate | ${site.name}`,
        desc: "Export-grade Indian fresh fruits: G9 Cavendish bananas, GI-tagged Alphonso mangoes, and Bhagwa ruby pomegranates packed to international supermarket shelf standards.",
        keywords: "fresh fruits exporter India, Cavendish banana exporter, Alphonso mango supplier, Bhagwa pomegranate export, Indian fresh fruits",
      },
    };

    const specificSeo = loaderData?.slug ? categorySeoMap[loaderData.slug] : undefined;
    const title = specificSeo?.title ?? (c ? `${c.name} Exporter & Supplier from India — ${site.name}` : "Category unavailable");
    const desc = specificSeo?.desc ?? (c ? `${c.blurb} Direct ocean shipments, international certifications, and bulk export pricing from India.` : "");
    const keywords = specificSeo?.keywords ?? "import export, Indian exporter, commodities supplier";

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "keywords", content: keywords },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: pageUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        ...(c ? [] : [{ name: "robots", content: "noindex" }]),
      ],
      links: [
        { rel: "canonical", href: pageUrl },
      ],
      scripts: c && loaderData
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: `${site.url}/`,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Products",
                    item: `${site.url}/products`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: c.name,
                    item: pageUrl,
                  },
                ],
              }),
            },
          ]
        : [],
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

