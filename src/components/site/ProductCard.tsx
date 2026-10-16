import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Award, Check, Eye, Heart, MapPin, Plus, X } from "lucide-react";
import { useState } from "react";
import type { Category, Product } from "@/data/products";
import { useBasket } from "@/lib/basket";
import { cn } from "@/lib/utils";
import { btn } from "./primitives";

export function ProductCard({
  product,
  category,
}: {
  product: Product;
  category: Category;
}) {
  const { add, has } = useBasket();
  const [quickOpen, setQuickOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const key = `${category.slug}/${product.slug}`;
  const inBasket = has(key);

  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  return (
    <>
      <article className="group relative flex flex-col h-full overflow-hidden rounded-[24px] bg-white border border-[#E3E7EE] shadow-[0_4px_20px_-4px_rgba(7,26,51,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9973F]/70 hover:shadow-[0_12px_36px_-6px_rgba(7,26,51,0.16)]">
        {/* Top 4:3 Image Container with Hover Zoom & Bottom Gradient */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EEF1F5]/80">
          <img
            src={product.image}
            alt={product.alt || `${product.name} from ${product.origin}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />

          {/* Bottom Inner Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#040E1F]/50 to-transparent pointer-events-none" />

          {/* Floating Navy-Glass Category Tag (Top Left) */}
          <div className="absolute left-3.5 top-3.5 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#071A33]/85 px-3 py-1 text-[0.68rem] font-semibold tracking-wider text-[#F2C86E] uppercase backdrop-blur-md shadow-sm border border-[#C9973F]/35">
              {category.name}
            </span>
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
                : "bg-[#071A33]/70 text-white/90 border border-white/20 hover:border-[#C9973F] hover:text-[#F2C86E]"
            )}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-transform group-hover/btn:scale-110",
                inBasket ? "fill-[#F2C86E] text-[#F2C86E]" : "text-white"
              )}
            />
          </button>

          {/* Quick View Button Centered on Hover (Always visible on mobile) */}
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <button
              onClick={() => setQuickOpen(true)}
              aria-label={`Quick view ${product.name}`}
              className="pointer-events-auto opacity-0 group-hover:opacity-100 max-md:opacity-100 transition-opacity duration-200 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#071A33] backdrop-blur-md shadow-lg border border-white/40 hover:bg-[#071A33] hover:text-[#F2C86E] cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-[#C9973F]" />
              <span>Quick View</span>
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            {/* 22px Serif Title wrapping up to 2 lines without ellipsis truncation */}
            <Link
              to="/products/$category/$product"
              params={{ category: category.slug, product: product.slug }}
              className="block"
            >
              <h3 className="font-serif text-[22px] font-semibold text-[#071A33] leading-snug line-clamp-2 min-h-[3.3rem] hover:text-[#C9973F] transition-colors">
                {product.name}
              </h3>
            </Link>

            {/* One-line Muted Grey Descriptor */}
            <p className="mt-1 text-xs text-muted-foreground/80 line-clamp-1">
              {product.description}
            </p>

            {/* 2-Column Wrapping Specs with Tiny Gold Icons */}
            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs border-t border-[#E3E7EE] pt-3.5">
              <div className="flex flex-col">
                <dt className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <MapPin className="h-3.5 w-3.5 text-[#C9973F] shrink-0" />
                  <span>Origin</span>
                </dt>
                <dd className="mt-1 font-semibold text-[#0B1B33] line-clamp-1">
                  {product.origin}
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <Award className="h-3.5 w-3.5 text-[#C9973F] shrink-0" />
                  <span>Grade / Variety</span>
                </dt>
                <dd className="mt-1 font-semibold text-[#0B1B33] line-clamp-1">
                  {product.grade}
                </dd>
              </div>
            </dl>
          </div>

          {/* Thin Divider and Footer Row: MOQ Left, View Specs + Gold Enquire Pill Right */}
          <div className="mt-5 pt-3.5 border-t border-[#E3E7EE] flex items-center justify-between gap-3 text-xs">
            <span className="text-muted-foreground font-medium truncate">
              MOQ: <strong className="text-[#071A33] font-semibold">{product.moq}</strong>
            </span>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setQuickOpen(true)}
                className="text-muted-foreground hover:text-[#071A33] underline underline-offset-4 font-medium transition-colors cursor-pointer py-1"
              >
                View Specs
              </button>
              <button
                type="button"
                onClick={() =>
                  add({
                    key,
                    name: product.name,
                    category: category.name,
                    origin: product.origin,
                    image: product.image,
                  })
                }
                className={cn(
                  "min-h-[40px] px-4 rounded-full font-semibold text-xs shadow-sm transition-all duration-200 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                  inBasket
                    ? "bg-[#071A33] text-[#F2C86E] border border-[#C9973F]/60"
                    : "bg-gradient-to-r from-[#C9973F] to-[#F2C86E] text-[#071A33] hover:shadow-md hover:from-[#B8862F] hover:to-[#E1B85E]"
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
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Quick View Modal */}
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
              className="relative w-full max-w-3xl overflow-hidden rounded-[24px] border border-[#C9973F]/40 bg-[#FAF8F3] shadow-2xl z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setQuickOpen(false)}
                aria-label="Close modal"
                className="absolute right-4 top-4 z-20 rounded-full bg-[#071A33]/90 p-2 text-white hover:bg-[#C9973F] hover:text-[#040E1F] transition-colors shadow-md cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid md:grid-cols-2 max-h-[85vh] overflow-y-auto">
                {/* Left Column: Image & Gallery */}
                <div className="bg-[#EEF1F5]/60 p-6 flex flex-col justify-between">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-[#E3E7EE] shadow-sm">
                    <img
                      src={gallery[activeImg] || product.image}
                      alt={product.alt || product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {gallery.length > 1 && (
                    <div className="mt-4 grid grid-cols-3 gap-2.5">
                      {gallery.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveImg(i)}
                          className={cn(
                            "aspect-[4/3] overflow-hidden rounded-xl border transition-all cursor-pointer",
                            activeImg === i
                              ? "border-[#C9973F] ring-2 ring-[#C9973F]"
                              : "border-[#E3E7EE] opacity-70 hover:opacity-100"
                          )}
                        >
                          <img
                            src={img}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Specs Table & CTAs */}
                <div className="p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <span className="eyebrow !text-[#C9973F]">{category.name}</span>
                    <h2 className="mt-2 font-serif text-3xl font-semibold text-[#071A33]">
                      {product.name}
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>

                    <div className="mt-5 space-y-2 border-t border-[#E3E7EE] pt-4 text-xs">
                      {[
                        ["Origin", product.origin],
                        ["Grade / Variety", product.grade],
                        ["Export Packaging", product.packaging],
                        ["Minimum Order (MOQ)", product.moq],
                        ["Shelf Life", product.shelfLife],
                        ["Certifications", product.certifications.join(", ")],
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          className="flex justify-between py-1 border-b border-[#E3E7EE]/60"
                        >
                          <span className="text-muted-foreground">{k}</span>
                          <span className="font-semibold text-[#0B1B33] text-right">
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3">
                    <button
                      onClick={() => {
                        add({
                          key,
                          name: product.name,
                          category: category.name,
                          origin: product.origin,
                          image: product.image,
                        });
                        setQuickOpen(false);
                      }}
                      className={cn(btn.gold, "w-full justify-center min-h-[44px]")}
                    >
                      {inBasket ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {inBasket ? "In Enquiry Basket" : "Add to Enquiry"}
                    </button>
                    <Link
                      to="/products/$category/$product"
                      params={{ category: category.slug, product: product.slug }}
                      className={cn(btn.outline, "w-full justify-center min-h-[44px]")}
                      onClick={() => setQuickOpen(false)}
                    >
                      View Full Details & Specs <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
