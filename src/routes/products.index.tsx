import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Filter,
  Package,
  PhoneCall,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { btn, Reveal, SectionHead } from "@/components/site/primitives";
import { allProducts, categories } from "@/data/products";
import { site } from "@/data/site";
import { useBasket } from "@/lib/basket";
import { cn } from "@/lib/utils";

const activeCategories = categories.filter(
  (c) => c.slug !== "natural-stones",
);
const activeCategorySlugs = new Set(activeCategories.map((c) => c.slug));
const activeProducts = allProducts.filter((p) => activeCategorySlugs.has(p.category.slug));

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: `Export Products Catalogue (${activeProducts.length} Items) — ${site.name}` },
      {
        name: "description",
        content: `Browse ${activeProducts.length} export-grade Indian products across approved categories: Agriculture, Fresh Vegetables, Fresh Fruits, Spices, Dehydrated Powders, and Ceramic Tiles.`,
      },
      {
        name: "keywords",
        content:
          "import export products India, ceramic tiles exporter Morbi, Indian spices supplier, fresh vegetables exporter, dehydrated powders India, basmati rice wholesale, export catalogue India",
      },
      { property: "og:title", content: `Export Products Catalogue — ${site.name}` },
      {
        property: "og:description",
        content: "Every export product from India, with grades, origins, MOQs, specifications, and certifications.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${site.url}/products` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `Export Products Catalogue — ${site.name}` },
      {
        name: "twitter:description",
        content: `Export catalogue of ${activeProducts.length} Indian commodities and vitrified tiles.`,
      },
    ],
    links: [
      { rel: "canonical", href: `${site.url}/products` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Aurelian International Export Catalogue",
          itemListElement: activeProducts.slice(0, 30).map((p, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: p.name,
            url: `${site.url}/products/${p.category.slug}/${p.slug}`,
          })),
        }),
      },
    ],
  }),
  component: Products,
});

const productTypes = [
  "Rice & Basmati",
  "Grains, Pulses & Seeds",
  "Fresh Vegetables & Roots",
  "Fresh Tropical Fruits",
  "Whole & Ground Spices",
  "Dehydrated Powders",
  "Ceramic Tiles (GVT)",
];

function getProductType(product: { category: { slug: string }; name: string }): string {
  if (product.category.slug === "ceramic-tiles") return "Ceramic Tiles (GVT)";
  if (product.category.slug === "dehydrated-powders") return "Dehydrated Powders";
  if (product.category.slug === "spices") return "Whole & Ground Spices";
  if (product.category.slug === "fresh-fruits") return "Fresh Tropical Fruits";
  if (product.category.slug === "fresh-vegetables") return "Fresh Vegetables & Roots";
  if (/rice/i.test(product.name)) return "Rice & Basmati";
  return "Grains, Pulses & Seeds";
}

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

const ITEMS_PER_PAGE = 12;

function Products() {
  const { openBasket } = useBasket();
  const [q, setQ] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sort, setSort] = useState<"featured" | "az" | "za" | "category">("featured");
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => {
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCat(slug);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const clearAllFilters = () => {
    setQ("");
    setSelectedCat("all");
    setSelectedTypes([]);
    setSort("featured");
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const hasActiveFilters =
    q || selectedCat !== "all" || selectedTypes.length > 0 || sort !== "featured";

  // Filtered & Sorted Product List
  const list = useMemo(() => {
    let filtered = activeProducts.filter((p) => {
      const originVal = p.specs?.origin || p.origin || "";
      const gradeVal = p.specs?.gradeVariety || p.grade || "";
      const descVal = p.shortDescription || p.description || "";
      const matchSearch =
        !q ||
        `${p.name} ${originVal} ${p.category.name} ${gradeVal} ${descVal}`
          .toLowerCase()
          .includes(q.toLowerCase());
      const matchCat = selectedCat === "all" || p.category.slug === selectedCat;
      const matchType = !selectedTypes.length || selectedTypes.includes(getProductType(p));
      return matchSearch && matchCat && matchType;
    });

    if (sort === "az") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "za") {
      filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === "category") {
      filtered = [...filtered].sort((a, b) => a.category.name.localeCompare(b.category.name));
    }

    return filtered;
  }, [q, selectedCat, selectedTypes, sort]);

  const pagedList = list.slice(0, visibleCount);
  const hasMore = visibleCount < list.length;

  const selectedCatObj = activeCategories.find((c) => c.slug === selectedCat);

  return (
    <>
      {/* 1. Header Banner */}
      <PageHeader
        eyebrow="Certified Export Catalog"
        title="Six Core Categories. One Global Standard."
        text={`${activeProducts.length} certified export commodities and architectural surfaces sourced from India's prime agricultural, spice, and ceramic manufacturing hubs — graded, inspected and shipped worldwide.`}
        crumbs={[{ label: "Products" }]}
        image="/products/1121-basmati-rice.webp"
      />

      {/* 2. Sticky Category Pill Bar with Item Counts and Animated Gold Indicator */}
      <nav
        aria-label="Category Filter Bar"
        className="sticky top-20 z-30 w-full max-w-full overflow-hidden border-y border-[#C9973F]/25 bg-[#071A33]/95 backdrop-blur-xl shadow-lg"
      >
        <div className="container-x flex items-center justify-between gap-3 py-3 min-w-0">
          <div className="flex-1 overflow-x-auto overscroll-x-contain touch-pan-x no-scrollbar py-0.5 min-w-0">
            <div className="flex items-center gap-2 min-w-max">
              {/* All Products Pill */}
              <button
                type="button"
                onClick={() => handleCategorySelect("all")}
                className={cn(
                  "relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap",
                  selectedCat === "all"
                    ? "text-[#040E1F]"
                    : "text-[#D9DDE3] hover:text-white hover:bg-white/10",
                )}
              >
                {selectedCat === "all" && (
                  <motion.span
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#9A6B1F] via-[#C9973F] to-[#F2C86E] shadow-md"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">All Categories</span>
                <span
                  className={cn(
                    "relative z-10 rounded-full px-2 py-0.5 text-[10px] font-bold",
                    selectedCat === "all"
                      ? "bg-[#040E1F]/20 text-[#040E1F]"
                      : "bg-white/10 text-gold-soft",
                  )}
                >
                  {activeProducts.length}
                </span>
              </button>

              {/* Approved Category Pills */}
              {activeCategories.map((c) => {
                const active = selectedCat === c.slug;
                const displayName = c.slug === "dehydrated-powders" ? "Dehydrated Powders" : c.name;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => handleCategorySelect(c.slug)}
                    className={cn(
                      "relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap",
                      active
                        ? "text-[#040E1F]"
                        : "text-[#D9DDE3] hover:text-white hover:bg-white/10",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="activeCategoryPill"
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
                      {c.products.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex lg:hidden items-center gap-2 rounded-full border border-gold/40 bg-[#0E2A4F] px-4 py-2 text-xs font-semibold text-gold-soft shadow-sm whitespace-nowrap cursor-pointer shrink-0"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
            {selectedTypes.length > 0 && (
              <span className="grid h-4 w-4 place-items-center rounded-full bg-gold text-[10px] text-[#040E1F] font-bold">
                {selectedTypes.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* 3. Main Catalog Section */}
      <section className="py-14 md:py-20 bg-[#FAF8F3]">
        <div className="container-x grid gap-10 lg:grid-cols-[17rem_1fr]">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block lg:sticky lg:top-36 lg:self-start space-y-6 bg-white p-6 rounded-3xl border border-[#E3E7EE] shadow-soft">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#C9973F]/25">
              <span className="flex items-center gap-2 font-serif text-xl text-[#071A33] font-semibold">
                <Filter className="h-4 w-4 text-[#C9973F]" /> Filter Products
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1 text-xs text-destructive hover:underline font-medium cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" /> Clear
                </button>
              )}
            </div>

            {/* 1. Category Filter */}
            <fieldset>
              <legend className="eyebrow !text-[0.68rem] text-[#9A6B1F] font-semibold tracking-wider">
                Product Categories
              </legend>
              <div className="mt-3 space-y-2">
                <label className="flex cursor-pointer items-center justify-between text-xs text-[#0B1B33]/85 hover:text-[#071A33] transition-colors py-1">
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sidebarCategory"
                      checked={selectedCat === "all"}
                      onChange={() => handleCategorySelect("all")}
                      className="h-4 w-4 accent-[#C9973F] cursor-pointer"
                    />
                    <span className={cn(selectedCat === "all" && "font-semibold text-[#071A33]")}>
                      All Categories
                    </span>
                  </span>
                  <span className="text-[11px] text-[#A8B2C1] font-medium">{activeProducts.length}</span>
                </label>
                {activeCategories.map((c) => (
                  <label
                    key={c.slug}
                    className="flex cursor-pointer items-center justify-between text-xs text-[#0B1B33]/85 hover:text-[#071A33] transition-colors py-1"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="sidebarCategory"
                        checked={selectedCat === c.slug}
                        onChange={() => handleCategorySelect(c.slug)}
                        className="h-4 w-4 accent-[#C9973F] cursor-pointer"
                      />
                      <span className={cn(selectedCat === c.slug && "font-semibold text-[#071A33]")}>
                        {c.name}
                      </span>
                    </span>
                    <span className="text-[11px] text-[#A8B2C1] font-medium">{c.products.length}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* 2. Product Types Filter */}
            <fieldset className="border-t border-[#C9973F]/25 pt-5">
              <legend className="eyebrow !text-[0.68rem] text-[#9A6B1F] font-semibold tracking-wider">
                Product Types
              </legend>
              <div className="mt-3 space-y-2">
                {productTypes.map((t) => {
                  const count = activeProducts.filter((p) => getProductType(p) === t).length;
                  return (
                    <label
                      key={t}
                      className="flex cursor-pointer items-center justify-between text-xs text-[#0B1B33]/85 hover:text-[#071A33] transition-colors py-0.5"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(t)}
                          onChange={() => toggle(selectedTypes, setSelectedTypes, t)}
                          className="h-4 w-4 rounded accent-[#C9973F] cursor-pointer shrink-0"
                        />
                        <span className="leading-tight">{t}</span>
                      </span>
                      <span className="text-[11px] text-[#A8B2C1] font-medium">{count}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>



            {/* Catalog Info Box */}
            <div className="rounded-2xl border border-[#C9973F]/25 bg-[#FAF8F3] p-4 text-xs text-[#071A33]/80">
              <p className="font-semibold text-[#071A33]">Direct Maritime Exports</p>
              <p className="mt-1 text-muted-foreground leading-relaxed">
                All {allProducts.length} export products certified to international trade compliance standards.
              </p>
            </div>
          </aside>

          {/* Product Listing Main Area */}
          <div>
            {/* Category / Catalog Section Intro Banner with Thematic Background Image */}
            {selectedCatObj ? (
              <div className="mb-8 rounded-3xl border border-[#C9973F]/35 bg-[#040E1F] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden min-h-[190px] flex items-center">
                {/* Background Image with Cinematic Scrim */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={selectedCatObj.image}
                    alt={selectedCatObj.name}
                    className="h-full w-full object-cover object-right md:object-center transform scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#040E1F] via-[#071A33]/92 via-60% to-[#071A33]/45" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040E1F]/80 via-transparent to-black/30" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-[#C9973F]/25 rounded-3xl" />
                </div>

                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="eyebrow !text-[#F2C86E] drop-shadow-sm">{selectedCatObj.headline}</span>
                    <span className="rounded-full bg-[#040E1F]/80 px-3 py-0.5 text-xs font-semibold text-[#F2C86E] border border-[#C9973F]/50 backdrop-blur-md shadow-sm">
                      {selectedCatObj.products.length} {selectedCatObj.products.length === 1 ? "Product" : "Products"}
                    </span>
                  </div>
                  <h2 className="mt-2.5 font-serif text-3xl sm:text-4xl font-semibold text-white tracking-wide drop-shadow-md">
                    {selectedCatObj.name}
                  </h2>
                  <p className="mt-2 text-sm text-[#F4F1EA]/90 leading-relaxed drop-shadow-sm">
                    {selectedCatObj.blurb}
                  </p>
                </div>
                <div className="absolute -right-8 -bottom-8 h-44 w-44 rounded-full bg-[#C9973F]/20 blur-3xl pointer-events-none" />
              </div>
            ) : (
              <div className="mb-8 rounded-3xl border border-[#C9973F]/35 bg-[#040E1F] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden min-h-[190px] flex items-center">
                {/* Background Image with Cinematic Scrim */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src="/products/category-agriculture.webp"
                    alt="All Products"
                    className="h-full w-full object-cover object-right md:object-center transform scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#040E1F] via-[#071A33]/92 via-60% to-[#071A33]/45" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040E1F]/80 via-transparent to-black/30" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-[#C9973F]/25 rounded-3xl" />
                </div>

                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="eyebrow !text-[#F2C86E] drop-shadow-sm">Direct Maritime & Global Trade</span>
                    <span className="rounded-full bg-[#040E1F]/80 px-3 py-0.5 text-xs font-semibold text-[#F2C86E] border border-[#C9973F]/50 backdrop-blur-md shadow-sm">
                      {activeProducts.length} Export Commodities
                    </span>
                  </div>
                  <h2 className="mt-2.5 font-serif text-3xl sm:text-4xl font-semibold text-white tracking-wide drop-shadow-md">
                    All Export Categories
                  </h2>
                  <p className="mt-2 text-sm text-[#F4F1EA]/90 leading-relaxed drop-shadow-sm">
                    Browse India&apos;s finest export commodities across 6 core sectors — machine-sorted, lab-tested, and certified for international port deliveries.
                  </p>
                </div>
                <div className="absolute -right-8 -bottom-8 h-44 w-44 rounded-full bg-[#C9973F]/20 blur-3xl pointer-events-none" />
              </div>
            )}

            {/* Search, Sort & Results Counter Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#E3E7EE]">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  aria-label="Search products"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setVisibleCount(ITEMS_PER_PAGE);
                  }}
                  placeholder={`Search ${activeProducts.length} products, varieties, origins, specs…`}
                  className="w-full rounded-full border border-[#C9973F]/35 bg-white py-2.5 pl-11 pr-4 text-sm text-[#0B1B33] placeholder:text-muted-foreground focus:border-[#C9973F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/20 shadow-sm transition-all"
                />
              </div>

              <div className="flex items-center gap-4 text-sm justify-between sm:justify-end">
                <span className="font-medium text-[#071A33]">
                  Showing <strong className="text-[#C9973F] font-bold">{pagedList.length}</strong>{" "}
                  of <strong>{list.length}</strong>
                </span>

                <select
                  aria-label="Sort products"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as "featured" | "az" | "za" | "category")}
                  className="rounded-full border border-[#C9973F]/35 bg-white px-4 py-2 text-xs font-semibold text-[#071A33] focus:border-[#C9973F] focus:outline-none shadow-sm cursor-pointer"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="az">Name: A to Z</option>
                  <option value="za">Name: Z to A</option>
                  <option value="category">Category</option>
                </select>
              </div>
            </div>

            {/* 3 Columns Desktop / 2 Tablet / 1 Mobile Grid with 28px Gap (gap-7) */}
            {pagedList.length > 0 ? (
              <>
                <div
                  className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7 items-stretch"
                >
                  <AnimatePresence mode="popLayout">
                    {pagedList.map((p, idx) => (
                      <motion.div
                        key={p.slug}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
                        className="h-full"
                      >
                        <ProductCard product={p} category={p.category} priority={idx < 3} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination / Outlined Gold Load More with Progress Bar */}
                {hasMore && (
                  <div className="mt-14 flex flex-col items-center justify-center gap-4">
                    {/* Thin Progress Bar */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-1.5 w-64 rounded-full bg-[#E3E7EE] overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#9A6B1F] via-[#C9973F] to-[#F2C86E]"
                          initial={{ width: 0 }}
                          animate={{ width: `${(pagedList.length / list.length) * 100}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Showing{" "}
                        <strong className="text-[#071A33] font-semibold">{pagedList.length}</strong>{" "}
                        of <strong className="text-[#071A33] font-semibold">{list.length}</strong>{" "}
                        products
                      </p>
                    </div>

                    {/* Outlined Gold Button */}
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, list.length))
                      }
                      className="inline-flex items-center gap-2 rounded-full border-2 border-[#C9973F] bg-white px-8 py-3 text-sm font-semibold text-[#071A33] shadow-sm hover:bg-[#C9973F] hover:text-[#040E1F] hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <span>Load More Products</span>
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="mt-16 flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#C9973F]/40 p-12 text-center bg-white shadow-soft">
                <Search className="h-12 w-12 text-[#C9973F]/60" />
                <h3 className="mt-4 font-display text-2xl text-[#071A33]">
                  No products match your criteria
                </h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">
                  Try adjusting your search query, selecting "All Categories", or clearing region
                  filters to view our approved {allProducts.length} export commodities.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className={cn(btn.gold, "mt-6 cursor-pointer")}
                >
                  <RotateCcw className="h-4 w-4" /> Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Why Buyers Choose Us Strip */}
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

      {/* 5. Request a Quote Banner */}
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

      {/* Mobile Filter Drawer Modal */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="absolute inset-0 bg-[#040E1F]/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full max-w-xs bg-white h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b hairline">
                  <span className="font-display text-xl text-[#071A33] font-semibold flex items-center gap-2">
                    <Filter className="h-4 w-4 text-[#C9973F]" /> Filter Catalog
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 text-muted-foreground hover:text-[#071A33]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Product Categories */}
                <div className="mt-6 space-y-3">
                  <p className="eyebrow !text-xs text-[#9A6B1F]">Product Categories</p>
                  <label className="flex items-center justify-between text-xs text-[#0B1B33]">
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mobileCategory"
                        checked={selectedCat === "all"}
                        onChange={() => handleCategorySelect("all")}
                        className="h-3.5 w-3.5 accent-[#C9973F]"
                      />
                      <span className={cn(selectedCat === "all" && "font-semibold")}>All Categories</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground">{activeProducts.length}</span>
                  </label>
                  {activeCategories.map((c) => (
                    <label key={c.slug} className="flex items-center justify-between text-xs text-[#0B1B33]">
                      <span className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="mobileCategory"
                          checked={selectedCat === c.slug}
                          onChange={() => handleCategorySelect(c.slug)}
                          className="h-3.5 w-3.5 accent-[#C9973F]"
                        />
                        <span className={cn(selectedCat === c.slug && "font-semibold")}>{c.name}</span>
                      </span>
                      <span className="text-[10px] text-muted-foreground">{c.products.length}</span>
                    </label>
                  ))}
                </div>

                {/* Product Types */}
                <div className="mt-6 space-y-3 border-t hairline pt-4">
                  <p className="eyebrow !text-xs text-[#9A6B1F]">Product Types</p>
                  {productTypes.map((t) => (
                    <label key={t} className="flex items-center justify-between text-xs text-[#0B1B33]">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(t)}
                          onChange={() => toggle(selectedTypes, setSelectedTypes, t)}
                          className="h-3.5 w-3.5 accent-[#C9973F]"
                        />
                        <span>{t}</span>
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {activeProducts.filter((p) => getProductType(p) === t).length}
                      </span>
                    </label>
                  ))}
                </div>


              </div>

              <div className="mt-8 pt-4 border-t hairline flex gap-3">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="flex-1 py-2.5 text-xs font-semibold text-muted-foreground border rounded-xl hover:bg-gray-50"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className={cn(btn.gold, "flex-1 justify-center py-2.5 text-xs")}
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
