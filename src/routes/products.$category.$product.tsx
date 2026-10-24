import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { ArrowLeft, Check, Download, Eye, FileText, Plus, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { PdfViewerModal } from "@/components/site/PdfViewerModal";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal, btn } from "@/components/site/primitives";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { getCatalogueForProduct } from "@/data/catalogues";
import { POWDER_COLORS } from "@/data/powderColors";
import { getCategory, getProduct } from "@/data/products";
import { site } from "@/data/site";
import { useBasket } from "@/lib/basket";
import { buildSingleProductWaUrl } from "@/lib/whatsapp";
import { cn, downloadFileFromUrl } from "@/lib/utils";
import { prefetchPdf } from "@/lib/pdfPreloader";

const DELETED_POWDER_SLUGS = new Set([
  "dehydrated-white-onion-flakes",
  "dehydrated-red-onion-flakes",
  "dehydrated-garlic-flakes",
  "garlic-granules",
  "dehydrated-ginger-flakes",
  "potato-flakes",
  "butterfly-pea-flower-powder",
  "rose-petal-powder",
  "purple-sweet-potato-powder",
  "lemongrass-powder",
]);

const DELETED_VEGETABLE_SLUGS = new Set([
  "brinjal-eggplant",
  "okra-lady-finger",
  "cabbage",
  "green-peas",
  "cauliflower",
]);

const DELETED_FRUIT_SLUGS = new Set([
  "kesar-mango",
  "thompson-seedless-grapes",
  "nagpur-orange",
  "lemon",
  "papaya",
  "pineapple",
]);

export const Route = createFileRoute("/products/$category/$product")({
  loader: ({ params }) => {
    if (DELETED_POWDER_SLUGS.has(params.product)) {
      throw redirect({
        to: "/products",
        search: { category: "dehydrated-powders" },
        statusCode: 301,
      });
    }
    if (DELETED_VEGETABLE_SLUGS.has(params.product)) {
      throw redirect({
        to: "/products",
        search: { category: "fresh-vegetables" },
        statusCode: 301,
      });
    }
    if (DELETED_FRUIT_SLUGS.has(params.product)) {
      throw redirect({
        to: "/products",
        search: { category: "fresh-fruits" },
        statusCode: 301,
      });
    }
    const p = getProduct(params.category, params.product);
    if (!p) throw notFound();
    return { cat: params.category, slug: p.slug };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? getProduct(loaderData.cat, loaderData.slug) : undefined;
    const title = p
      ? `${p.name} Exporter — ${p.origin}, India | ${site.name}`
      : "Product unavailable";
    const desc = p ? `${p.description} Grade: ${p.grade}. MOQ: ${p.moq}. Exported worldwide.` : "";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(p ? [] : [{ name: "robots", content: "noindex" }]),
      ],
      scripts: p
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: p.name,
                description: p.description,
                image: p.image,
                brand: { "@type": "Brand", name: site.name },
                countryOfOrigin: "India",
                offers: {
                  "@type": "Offer",
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                },
              }),
            },
          ]
        : [],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { cat, slug } = Route.useLoaderData();
  const c = getCategory(cat)!;
  const p = getProduct(cat, slug)!;
  const { add, has, openBasket } = useBasket();
  const key = `${c.slug}/${p.slug}`;
  const inBasket = has(key);
  const catalogue = getCatalogueForProduct(p.name, p.slug);
  const [pdfOpen, setPdfOpen] = useState(false);

  const isPowder = c.slug === "dehydrated-powders";
  const powderMeta = isPowder ? POWDER_COLORS[p.slug] : undefined;
  const rawGallery = p.gallery && p.gallery.length > 0 ? p.gallery : [p.image];
  const gallery = isPowder ? rawGallery.map((img) => `${img}?v=powder2026`) : rawGallery;
  const ingredientImage = isPowder
    ? `/products/${p.slug}-ingredient.webp?v=powder2026b`
    : "";
  const [activeImg, setActiveImg] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const specs = [
    ["Origin Region", p.origin],
    ["Grade / Variety", p.grade],
    ["Export Packaging", p.packaging],
    [
      "Minimum Order Quantity (MOQ)",
      p.moq.toLowerCase().includes("sample") ? p.moq : `${p.moq} (Samples available upon request)`,
    ],
    ["Shelf Life / Durability", p.shelfLife],
    ["Quality & Export Certifications", p.certifications.join(", ")],
  ];

  const [downloading, setDownloading] = useState(false);

  async function handleDownload(url: string, filename: string) {
    setDownloading(true);
    try {
      await downloadFileFromUrl(url, filename);
    } finally {
      setDownloading(false);
    }
  }

  // Preload PDF in background as soon as product page opens
  useEffect(() => {
    if (catalogue?.webUrl) {
      prefetchPdf(catalogue.webUrl);
    }
  }, [catalogue?.webUrl]);

  const related = c.products.filter((x) => x.slug !== p.slug).slice(0, 3);
  const waUrl = buildSingleProductWaUrl({
    name: p.name,
    category: c.name,
    origin: p.origin,
    grade: p.grade,
    moq: p.moq,
    packaging: p.packaging,
    certifications: p.certifications,
  });

  return (
    <>
      <PageHeader
        eyebrow={`${c.name} · Export Grade`}
        title={p.name}
        text={`Export-grade ${p.name} sourced from ${p.origin}, certified to international specifications.`}
        image={p.image}
        subRow={
          isPowder && powderMeta ? (
            <div className="flex items-center gap-3 py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-[#F2C86E]/40 w-fit shadow-md">
              <img
                src={ingredientImage}
                alt={powderMeta.ingredient}
                className="h-8 w-8 rounded-full object-cover border-2 border-[#F2C86E] shadow-sm"
              />
              <span className="text-sm font-medium text-white">
                Source: <strong className="text-[#F2C86E]">Fresh {powderMeta.ingredient}</strong>, {p.origin}
              </span>
            </div>
          ) : undefined
        }
        crumbs={[
          { label: "Products", to: "/products" },
          { label: c.name, to: "/products/$category", params: { category: c.slug } },
          { label: p.name },
        ]}
      />

      <section className="py-16 md:py-24 bg-ivory">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_26rem]">
          {/* Main Left Column: 4-Image Gallery + Description + Specs */}
          <div>
            {/* Back link */}
            <Link
              to="/products/$category"
              params={{ category: c.slug }}
              className="inline-flex items-center gap-2 text-sm text-[#071A33]/70 hover:text-gold transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" /> Back to {c.name} Catalogue
            </Link>

            {/* 4-Image Interactive Gallery (Order: Main, Ingredient, Close-up, Side) */}
            <div className="space-y-4">
              <div
                onClick={() => setZoomed((z) => !z)}
                title="Click to zoom image"
                className={cn(
                  "relative aspect-[16/10] overflow-hidden rounded-3xl border border-gold/30 bg-sand/30 shadow-soft transition-all duration-300",
                  zoomed ? "cursor-zoom-out" : "cursor-zoom-in",
                )}
              >
                <img
                  src={gallery[activeImg] || p.image}
                  alt={p.alt || `${p.name} — primary view`}
                  className={cn(
                    "h-full w-full object-cover transition-transform duration-500 ease-out",
                    zoomed && "scale-135",
                  )}
                />
                {isPowder && activeImg === 1 && (
                  <span className="absolute bottom-4 left-4 rounded-full bg-[#071A33]/90 px-4 py-1.5 text-xs font-bold tracking-wide text-[#F2C86E] border border-[#C9973F]/40 backdrop-blur-md shadow-md">
                    Fresh Raw Material
                  </span>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {gallery.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      aria-label={`View photo ${i + 1}`}
                      className={cn(
                        "relative aspect-[16/10] overflow-hidden rounded-2xl border transition-all duration-200 cursor-pointer",
                        activeImg === i
                          ? "border-gold ring-2 ring-gold shadow-md"
                          : "border-border/60 opacity-70 hover:opacity-100",
                      )}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      {isPowder && i === 1 && (
                        <span className="absolute inset-x-0 bottom-0 bg-[#071A33]/90 py-1 text-[0.62rem] font-bold text-[#F2C86E] text-center tracking-wide">
                          Fresh Raw Material
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Overview Section */}
            <article className="mt-14 space-y-6">
              <h2 className="font-display text-4xl text-[#071A33]">Product Overview</h2>
              {isPowder && powderMeta && (
                <div className="flex items-center gap-3 py-2 px-4 rounded-full bg-[#FAF6EE] border border-[#C9973F]/40 w-fit shadow-xs">
                  <img
                    src={ingredientImage}
                    alt={powderMeta.ingredient}
                    className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <span className="text-sm font-medium text-[#071A33]">
                    Source: <strong className="text-[#966B24]">Fresh {powderMeta.ingredient}</strong>, {p.origin}
                  </span>
                </div>
              )}
              <p className="text-lg leading-relaxed text-ink/80 max-w-3xl">{p.description}</p>
              <p className="text-base leading-relaxed text-muted-foreground max-w-3xl">
                Sourced directly from verified producer clusters in {p.origin}, our {p.name} is
                machine-cleaned, graded for uniform moisture and purity, and packed into
                export-grade packaging tailored to prevent transit deterioration across long-haul
                marine shipping.
              </p>

              {/* Full Specification Table */}
              <div className="pt-8">
                <div className="flex items-center justify-between pb-4 border-b hairline">
                  <h3 className="font-display text-3xl text-[#071A33]">Export Specifications</h3>
                  <span className="flex items-center gap-1.5 text-xs text-gold font-medium">
                    <ShieldCheck className="h-4 w-4" /> Lab Certified
                  </span>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-gold/25 bg-card shadow-soft">
                  <table className="w-full text-sm">
                    <tbody className="divide-y hairline">
                      {specs.map(([k, v]) => (
                        <tr key={k} className="hover:bg-sand/30 transition-colors">
                          <th
                            scope="row"
                            className="w-2/5 px-6 py-4.5 text-left font-medium text-muted-foreground bg-sand/15"
                          >
                            {k}
                          </th>
                          <td className="px-6 py-4.5 text-ink font-semibold">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Catalogue & PDF Download Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {catalogue && (
                    <button
                      type="button"
                      onClick={() => setPdfOpen(true)}
                      onMouseEnter={() => prefetchPdf(catalogue.webUrl)}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C9973F] px-5 py-3 text-sm font-semibold text-[#071A33] shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <Eye className="h-4 w-4" /> View catalogue
                    </button>
                  )}
                  {catalogue && (
                    <button
                      type="button"
                      onClick={() => handleDownload(catalogue.downloadUrl, `${catalogue.id}.pdf`)}
                      disabled={downloading}
                      className={cn(btn.outline, "inline-flex items-center gap-2 text-sm cursor-pointer disabled:opacity-50")}
                    >
                      <Download className="h-4 w-4" /> {downloading ? "Downloading..." : "Download PDF"}
                    </button>
                  )}
                </div>
              </div>
            </article>
          </div>

          {/* Sticky "Request Quote" Sidebar Panel */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-gold/40 bg-[#071A33] p-8 text-[#F4F1EA] shadow-2xl space-y-6">
              <div>
                <span className="eyebrow !text-gold-soft">Commercial Enquiry</span>
                <h3 className="mt-2 font-display text-3xl text-white">{p.name}</h3>
                <p className="mt-2 text-xs text-[#D9DDE3]">
                  Origin: <strong className="text-white">{p.origin}</strong>
                </p>
              </div>

              <div className="space-y-3 rounded-2xl bg-[#040E1F]/60 p-4 border border-white/10 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#D9DDE3]">Standard Grade</span>
                  <span className="font-medium text-white">{p.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#D9DDE3]">Minimum Order (MOQ)</span>
                  <span className="font-medium text-gold-soft">{p.moq}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#D9DDE3]">Packaging</span>
                  <span className="font-medium text-white">{p.packaging}</span>
                </div>
              </div>

              {/* Catalogue Sidebar Widget */}
              {catalogue && (
                <div className="rounded-2xl bg-white/10 p-4 border border-gold/30 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#F2C86E]">
                    <FileText className="h-4 w-4" /> Official Technical Brochure
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Direct architectural spec sheet & pattern collection.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setPdfOpen(true)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#C9973F] py-2 text-xs font-semibold text-[#071A33] hover:brightness-110 cursor-pointer shadow-sm"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(catalogue.downloadUrl, `${catalogue.id}.pdf`)}
                      disabled={downloading}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 py-2 text-xs font-medium text-white hover:bg-white/15 cursor-pointer disabled:opacity-50"
                    >
                      <Download className="h-3.5 w-3.5" /> {downloading ? "Saving..." : "Download"}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => {
                    add({
                      key,
                      name: p.name,
                      category: c.name,
                      origin: p.origin,
                      image: p.image,
                    });
                    const formEl = document.getElementById("enquiry-form");
                    if (formEl) {
                      formEl.scrollIntoView({ behavior: "smooth", block: "start" });
                    } else {
                      window.location.href = "/contact#enquiry-form";
                    }
                  }}
                  className={cn(btn.gold, "w-full justify-center shadow-md")}
                >
                  {inBasket ? (
                    <>
                      <Check className="h-4 w-4" /> Added to Enquiry Basket
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Add to Enquiry Basket
                    </>
                  )}
                </button>

                {inBasket && (
                  <Link
                    to="/contact"
                    hash="enquiry-form"
                    className={cn(btn.outlineLight, "w-full justify-center text-xs")}
                  >
                    Request Commercial Quote
                  </Link>
                )}

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold/40 bg-transparent py-3 text-xs font-semibold text-gold-soft hover:bg-gold/10 transition-colors"
                >
                  <WhatsAppIcon className="h-4 w-4 text-[#25D366]" /> Inquire via WhatsApp
                </a>
              </div>

              <div className="border-t border-white/10 pt-4 text-center">
                <p className="text-[0.75rem] text-[#D9DDE3]">
                  Guaranteed trade desk response within 24 hours with FOB & CIF sea freight
                  estimates.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related Products Section */}
      {related.length > 0 && (
        <section className="py-16 md:py-24 bg-sand/40 border-t hairline">
          <div className="container-x">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="eyebrow">Explore Category</p>
                <h2 className="mt-2 font-display text-4xl text-[#071A33] md:text-5xl">
                  More in {c.name}
                </h2>
              </div>
              <Link
                to="/products/$category"
                params={{ category: c.slug }}
                className={cn(btn.outline, "hidden sm:inline-flex")}
              >
                View All {c.name}
              </Link>
            </div>

            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {related.map((x, i) => (
                <Reveal key={x.slug} delay={i * 0.08} className="h-full">
                  <ProductCard product={x} category={c} priority={i < 3} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PDF Catalogue Viewer Modal */}
      {catalogue && (
        <PdfViewerModal
          catalogue={catalogue}
          isOpen={pdfOpen}
          onClose={() => setPdfOpen(false)}
          onRequestTile={() => {
            setPdfOpen(false);
            const formEl = document.getElementById("enquiry-form");
            if (formEl) {
              formEl.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
              window.location.href = "/contact#enquiry-form";
            }
          }}
        />
      )}
    </>
  );
}
