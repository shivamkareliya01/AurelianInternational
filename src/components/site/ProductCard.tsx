import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Download, Eye, FileText, Heart, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getCatalogueForProduct } from "@/data/catalogues";
import { POWDER_COLORS } from "@/data/powderColors";
import type { Category, Product } from "@/data/products";
import { useBasket } from "@/lib/basket";
import { buildSingleProductWaUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { btn } from "./primitives";
import { PdfViewerModal } from "./PdfViewerModal";
import { WhatsAppIcon } from "./WhatsAppIcon";

function formatCardMoq(rawMoq: string): string {
  if (!rawMoq) return "MOQ 1 MT";
  const clean = rawMoq.replace(/^MOQ:?\s*/i, "").trim();
  // Keep primary unit before parenthesis, semicolon, or long explanation
  const primary = (clean.split(/[;(]/)[0] ?? "").trim();
  return primary ? `MOQ ${primary}` : "MOQ 1 MT";
}

export function ProductCard({
  product,
  category,
  priority = false,
}: {
  product: Product;
  category: Category;
  priority?: boolean;
}) {
  const { add, has } = useBasket();
  const [quickOpen, setQuickOpen] = useState(false);
  const [mainLoaded, setMainLoaded] = useState(false);
  const [insetLoaded, setInsetLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image);
  const [retryCount, setRetryCount] = useState(0);
  const [pdfOpen, setPdfOpen] = useState(false);
  const catalogue = getCatalogueForProduct(product.name, product.slug);

  const key = `${category.slug}/${product.slug}`;
  const inBasket = has(key);
  const isPowder = category.slug === "dehydrated-powders";
  const powderMeta = isPowder ? POWDER_COLORS[product.slug] : undefined;

  // Clean raw ingredient label without duplicate "Fresh"
  const rawIngredient = (powderMeta?.ingredient || product.name.replace(/ Powder.*$/i, ""))
    .replace(/^Fresh\s+/i, "")
    .trim();
  const captionLabel = `Fresh ${rawIngredient}`;

  const ingredientImage = isPowder ? `/products/${product.slug}-ingredient.webp?v=20261021b` : "";

  // Preload hover/ingredient image so swap is instant without flicker
  useEffect(() => {
    if (isPowder && ingredientImage) {
      const preloadImg = new Image();
      preloadImg.src = ingredientImage;
    }
  }, [isPowder, ingredientImage]);

  const handleImgError = () => {
    if (retryCount === 0) {
      setRetryCount(1);
      setImgSrc(`${product.image}?retry=1`);
    } else {
      // Graceful fallback to default category asset
      setImgSrc(category.image || "/products/1121-basmati-rice.webp");
    }
  };

  return (
    <>
      <article
        id={product.slug}
        className={cn(
          "group product-card relative flex flex-col h-full overflow-hidden rounded-[24px] bg-white border border-[#E3E7EE] shadow-[0_4px_20px_-4px_rgba(7,26,51,0.08)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-[#C9973F]/75 scroll-mt-28 transform-gpu",
          isPowder
            ? "hover:shadow-[0_20px_45px_-8px_var(--powder-glow,rgba(7,26,51,0.22))]"
            : "hover:shadow-[0_20px_45px_-8px_rgba(7,26,51,0.18)]",
        )}
        style={
          powderMeta
            ? ({
                "--powder-glow": `${powderMeta.hex}77`,
              } as React.CSSProperties)
            : undefined
        }
      >
        {/* Fixed 4:3 Image Container with Rounded Top Corners & Unified Studio Backdrop */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[24px] bg-[#fbf7ee]">
          {/* Unified Studio Backdrop: warm-cream to light-sand gradient with subtle radial highlight */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, #ffffff 0%, #fbf7ee 50%, #efe6d2 100%)",
            }}
          />

          {/* Faint soft ground shadow ellipse under product */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-8 rounded-full pointer-events-none blur-[5px] z-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.03) 45%, transparent 70%)",
            }}
          />

          {/* Shimmer skeleton in exact frame until image loads */}
          <div
            className={cn(
              "absolute inset-0 z-[3] transition-opacity duration-400 ease-out pointer-events-none",
              mainLoaded ? "opacity-0" : "opacity-100",
            )}
          >
            <div className="h-full w-full bg-gradient-to-r from-[#EDEAE2] via-[#FBF7EE] to-[#EDEAE2] animate-pulse" />
          </div>

          {/* Main Photo with 400ms fade-in, 600ms hover zoom, and per-product objectPosition */}
          <img
            ref={(el) => {
              if (el && el.complete && el.naturalWidth > 0 && !mainLoaded) {
                setMainLoaded(true);
              }
            }}
            src={imgSrc}
            alt={product.alt || `${product.name}, ${product.origin}`}
            width={400}
            height={300}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setMainLoaded(true)}
            onError={handleImgError}
            style={{
              objectPosition: "center",
            }}
            className={cn(
              "relative z-[2] h-full w-full object-cover transition-opacity duration-400 ease-out transition-transform duration-600 ease-out transform-gpu",
              mainLoaded ? "opacity-100" : "opacity-0",
              isPowder ? "group-hover-swap-main" : "group-hover:scale-[1.06]",
            )}
          />

          {/* On hover, crossfade to raw ingredient photo for dehydrated powders */}
          {isPowder && ingredientImage && (
            <img
              src={ingredientImage}
              alt={`${captionLabel} raw material`}
              width={400}
              height={300}
              loading="lazy"
              decoding="async"
              style={{
                objectPosition: "center",
              }}
              className="absolute inset-0 z-[2] h-full w-full object-cover group-hover-swap-ingredient pointer-events-none"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          )}

          {/* Bottom-to-top subtle gradient overlay for badge & heart readability */}
          <div
            className="absolute inset-0 z-[5] pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, transparent 65%, rgba(0,0,0,0.06) 100%)",
            }}
          />

          {/* Very light bottom edge gradient overlay for quick view */}
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/[0.08] to-transparent pointer-events-none z-[5]" />

          {/* Floating Navy-Glass Category Tag + Mesh Chip for Powders (Top Left) */}
          <div className="absolute left-3.5 top-3.5 z-10 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#071A33]/85 px-3 py-1 text-[0.68rem] font-semibold tracking-wider text-[#F2C86E] uppercase backdrop-blur-md shadow-sm border border-[#C9973F]/35">
              {category.name}
            </span>
            {isPowder && (
              <span className="inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-[0.65rem] font-bold tracking-wide text-[#071A33] backdrop-blur-md shadow-sm border border-[#C9973F]/40">
                {powderMeta?.mesh ?? "Mesh 60–100"}
              </span>
            )}
          </div>

          {/* Floating Heart Save Icon (Top Right) */}
          <button
            onClick={() =>
              add({
                key,
                name: product.name,
                category: category.name,
                origin: product.origin,
                image: product.image,
              })
            }
            aria-label={
              inBasket
                ? `${product.name} added to enquiry basket`
                : `Save ${product.name} to enquiry`
            }
            className={cn(
              "absolute right-3.5 top-3.5 z-10 grid h-8 w-8 place-items-center rounded-full backdrop-blur-md transition-all duration-200 shadow-sm cursor-pointer",
              inBasket
                ? "bg-[#071A33]/90 text-[#F2C86E] border border-[#C9973F]"
                : "bg-[#071A33]/70 text-white/90 border border-white/20 hover:border-[#C9973F] hover:text-[#F2C86E]",
            )}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-transform group-hover/btn:scale-110",
                inBasket ? "fill-[#F2C86E] text-[#F2C86E]" : "text-white",
              )}
            />
          </button>

          {/* Round Inset Thumbnail with Shimmer Skeleton, Responsive Size & Pill Caption */}
          {isPowder && (
            <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-20 flex flex-col items-end gap-1 pointer-events-none">
              <span className="rounded-full bg-[#FAF8F3] px-2 py-0.5 sm:px-2.5 sm:py-0.5 text-[10px] sm:text-[12px] font-semibold text-[#071A33] border border-[#C9973F]/40 shadow-md backdrop-blur-sm whitespace-nowrap">
                {captionLabel}
              </span>
              <div className="relative aspect-square h-[56px] w-[56px] sm:h-[76px] sm:w-[76px] shrink-0 overflow-hidden rounded-full border-2 sm:border-[3px] border-[#FAF8F3] ring-1 ring-[#071A33]/30 shadow-[0_4px_16px_rgba(7,26,51,0.25)] bg-[#FAF8F3] transition-transform duration-300">
                {/* Circular shimmer placeholder until loaded - zero blank white circles */}
                <div
                  className={cn(
                    "absolute inset-0 z-10 transition-opacity duration-350 ease-out pointer-events-none rounded-full",
                    insetLoaded ? "opacity-0" : "opacity-100",
                  )}
                >
                  <div className="h-full w-full bg-gradient-to-r from-[#EDEAE2] via-[#FBF7EE] to-[#EDEAE2] animate-pulse rounded-full" />
                </div>

                <img
                  ref={(el) => {
                    if (el && el.complete && el.naturalWidth > 0 && !insetLoaded) {
                      setInsetLoaded(true);
                    }
                  }}
                  src={ingredientImage}
                  alt={`${captionLabel} raw export ingredient`}
                  width={76}
                  height={76}
                  loading={priority ? "eager" : "lazy"}
                  decoding="async"
                  onLoad={() => setInsetLoaded(true)}
                  style={{
                    objectPosition: "center",
                  }}
                  className={cn(
                    "h-full w-full object-cover object-center group-hover-swap-badge-ingredient transition-opacity duration-350 ease-out",
                    insetLoaded ? "opacity-100" : "opacity-0",
                  )}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = imgSrc;
                    setInsetLoaded(true);
                  }}
                />
                <img
                  src={imgSrc}
                  alt={`${product.name} powder`}
                  width={76}
                  height={76}
                  loading="lazy"
                  decoding="async"
                  style={{
                    objectPosition: "center",
                  }}
                  className="absolute inset-0 h-full w-full object-cover object-center group-hover-swap-badge-powder"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          )}

          {/* Quick View Pill Positioned Bottom-Left on Hover */}
          <div className="absolute bottom-3 left-3.5 z-10 pointer-events-none">
            <button
              onClick={() => setQuickOpen(true)}
              aria-label={`Quick view ${product.name}`}
              className="pointer-events-auto opacity-0 group-hover:opacity-100 max-md:opacity-100 transition-all duration-200 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[0.7rem] font-semibold text-[#071A33] backdrop-blur-md shadow-lg border border-white/50 hover:bg-[#071A33] hover:text-[#F2C86E] cursor-pointer whitespace-nowrap"
            >
              <Eye className="h-3.5 w-3.5 text-[#C9973F]" />
              <span>Quick View</span>
            </button>
          </div>
        </div>

        {/* Thin colored accent line under the photo that matches the product's powder color */}
        {isPowder && powderMeta && (
          <div
            className="h-[3.5px] w-full shrink-0 transition-all duration-300 group-hover:h-[5px]"
            style={{ backgroundColor: powderMeta.hex }}
          />
        )}

        {/* Card Body */}
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            {/* 22px Serif Title wrapping up to 2 lines */}
            <Link
              to="/products/$category/$product"
              params={{ category: category.slug, product: product.slug }}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  setQuickOpen(true);
                }
              }}
              className="block"
            >
              <h3 className="font-serif text-[22px] font-semibold text-[#071A33] leading-snug line-clamp-2 min-h-[3.3rem] hover:text-[#C9973F] transition-colors">
                {product.name}
              </h3>
            </Link>

            {/* Clean clamped descriptor in 14px #4A5568 */}
            <p className="mt-2 text-[14px] text-[#4A5568] line-clamp-3 leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Product Catalogue Quick Actions */}
            {catalogue && (
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPdfOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#071A33]/5 border border-[#C9973F]/60 px-3 py-1 text-[11px] font-semibold text-[#071A33] hover:bg-[#C9973F] hover:text-[#071A33] transition-colors cursor-pointer"
                >
                  <FileText className="h-3 w-3 text-[#C9973F]" />
                  <span>View catalogue</span>
                </button>
                <a
                  href={catalogue.downloadUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-colors"
                >
                  <Download className="h-3 w-3 text-slate-500" />
                  <span>Download PDF</span>
                </a>
              </div>
            )}
          </div>

          {/* Thin Divider and Footer Row: MOQ Left, View Specs + Gold Enquire Pill Right */}
          <div className="mt-5 pt-3.5 border-t border-[#E3E7EE] flex items-center justify-between gap-2 text-xs">
            <span className="text-muted-foreground font-medium whitespace-nowrap text-[0.75rem] sm:text-xs shrink-0">
              <strong className="text-[#071A33] font-semibold">
                {formatCardMoq(product.specs?.moq || product.moq || "")}
              </strong>
            </span>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setQuickOpen(true)}
                className="text-muted-foreground hover:text-[#071A33] underline underline-offset-4 font-medium transition-colors cursor-pointer py-1 text-[0.75rem] sm:text-xs"
              >
                View Details
              </button>
              <button
                type="button"
                onClick={() => {
                  add({
                    key,
                    name: product.name,
                    category: category.name,
                    origin: product.specs?.origin || product.origin || "",
                    image: product.image,
                  });
                  const formEl = document.getElementById("enquiry-form");
                  if (formEl) {
                    formEl.scrollIntoView({ behavior: "smooth", block: "start" });
                  } else {
                    window.location.href = "/contact#enquiry-form";
                  }
                }}
                className={cn(
                  "min-h-[36px] sm:min-h-[38px] px-3.5 sm:px-4 rounded-full font-semibold text-[0.72rem] sm:text-xs shadow-sm transition-all duration-200 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                  inBasket
                    ? "bg-[#071A33] text-[#F2C86E] border border-[#C9973F]/60"
                    : "bg-gradient-to-r from-[#C9973F] to-[#F2C86E] text-[#071A33] hover:shadow-md hover:from-[#B8862F] hover:to-[#E1B85E]",
                )}
              >
                {inBasket ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#F2C86E]" />
                    <span>Enquired</span>
                  </>
                ) : (
                  <>
                    <span>Enquire</span>
                    <ArrowRight className="h-3 w-3" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Simplified Product Detail Modal View */}
      <AnimatePresence>
        {quickOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickOpen(false)}
              className="absolute inset-0 bg-[#040E1F]/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[24px] border border-[#C9973F]/40 bg-[#FAF8F3] shadow-2xl z-10"
            >
              {/* Close (X) Button */}
              <button
                onClick={() => setQuickOpen(false)}
                aria-label="Close modal"
                className="absolute right-4 top-4 z-20 rounded-full bg-[#071A33]/90 p-2 text-white hover:bg-[#C9973F] hover:text-[#040E1F] transition-colors shadow-md cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Product Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EEF1F5]">
                <img
                  src={product.image}
                  alt={product.alt || product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Product Name & Description */}
              <div className="p-6 sm:p-7">
                <span className="eyebrow !text-[#C9973F]">{category.name}</span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#071A33]">
                  {product.name}
                </h2>
                <p className="mt-3 text-sm text-[#4A5568] leading-relaxed">
                  {product.shortDescription || product.description}
                </p>

                {/* Quick specs row */}
                {(product.origin || product.grade || product.moq) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.origin && (
                      <span className="inline-flex items-center rounded-full bg-[#EEF1F5] px-3 py-1 text-xs font-medium text-[#071A33]">
                        Origin: {product.origin}
                      </span>
                    )}
                    {product.grade && (
                      <span className="inline-flex items-center rounded-full bg-[#EEF1F5] px-3 py-1 text-xs font-medium text-[#071A33]">
                        Grade: {product.grade}
                      </span>
                    )}
                    {product.moq && (
                      <span className="inline-flex items-center rounded-full bg-[#C9973F]/15 px-3 py-1 text-xs font-semibold text-[#7A5A1E]">
                        MOQ: {product.moq}
                      </span>
                    )}
                  </div>
                )}

                {/* Catalogue Actions in Quick View Modal */}
                {catalogue && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-amber-500/10 border border-[#C9973F]/30 p-2.5">
                    <span className="text-xs font-semibold text-[#071A33]">Technical Brochure:</span>
                    <button
                      type="button"
                      onClick={() => setPdfOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#071A33] px-3 py-1.5 text-xs font-semibold text-[#F2C86E] hover:bg-[#0E2A4F] cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" /> View catalogue
                    </button>
                    <a
                      href={catalogue.downloadUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Download className="h-3.5 w-3.5" /> Download PDF
                    </a>
                  </div>
                )}

                {/* CTA buttons row */}
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  {/* WhatsApp Enquiry Button — product name included in message */}
                  <a
                    href={buildSingleProductWaUrl({
                      name: product.name,
                      category: category.name,
                      origin: product.origin,
                      grade: product.grade,
                      moq: product.moq,
                      packaging: product.packaging,
                      certifications: product.certifications,
                    })}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1EBE58] transition-colors"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Enquire on WhatsApp
                  </a>

                  {/* View full detail page */}
                  <Link
                    to="/products/$category/$product"
                    params={{ category: category.slug, product: product.slug }}
                    onClick={() => setQuickOpen(false)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#071A33]/25 bg-[#071A33] px-4 py-2.5 text-xs font-semibold text-[#F2C86E] hover:bg-[#0E2A4F] transition-colors"
                  >
                    View Full Specs <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product PDF Catalogue Viewer Modal */}
      {catalogue && (
        <PdfViewerModal
          catalogue={catalogue}
          isOpen={pdfOpen}
          onClose={() => setPdfOpen(false)}
        />
      )}
    </>
  );
}
