import { ChevronDown, Search, X } from "lucide-react";
import React, { Suspense, useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "@/lib/scroll-lock";
import { cn } from "@/lib/utils";
import type { CatalogProduct, SelectedProductItem } from "./ProductPickerModal";

export type { CatalogProduct, SelectedProductItem };

// Lazy-load the heavy modal dialog & virtualizer chunk on demand
const ProductPickerModal = React.lazy(() => import("./ProductPickerModal"));

interface ProductPickerProps {
  id?: string;
  name?: string;
  selectedProducts: SelectedProductItem[];
  onChange: (items: SelectedProductItem[]) => void;
  maxSelected?: number;
  placeholder?: string;
  hasError?: boolean;
  onCustomRequest?: (query: string) => void;
  className?: string;
}

export function ProductPicker({
  id = "product-picker",
  name = "products",
  selectedProducts,
  onChange,
  maxSelected = 8,
  placeholder = "Search or choose a product...",
  hasError = false,
  onCustomRequest,
  className,
}: ProductPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Reference-counted scroll lock automatically synchronized with isOpen state
  useScrollLock(isOpen);

  // Pre-load the modal bundle on hover of the trigger field for instantaneous open
  const handleTriggerHover = useCallback(() => {
    import("./ProductPickerModal");
  }, []);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  const toggleProduct = useCallback(
    (product: CatalogProduct) => {
      const exists = selectedProducts.some((p) => p.slug === product.slug);
      if (exists) {
        onChange(selectedProducts.filter((p) => p.slug !== product.slug));
      } else {
        if (selectedProducts.length >= maxSelected) return;
        onChange([
          ...selectedProducts,
          {
            slug: product.slug,
            name: product.name,
            category: product.category.name,
            image: `/products/thumbs/${product.slug}.webp`,
            origin: product.origin,
            grade: product.grade,
            moq: product.moq,
          },
        ]);
      }
    },
    [selectedProducts, onChange, maxSelected]
  );

  const removeProduct = useCallback(
    (slug: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      onChange(selectedProducts.filter((p) => p.slug !== slug));
    },
    [selectedProducts, onChange]
  );

  return (
    <div className={cn("relative w-full", className)}>
      {/* Hidden inputs for form data submission (array + comma-separated + legacy) */}
      {selectedProducts.map((p, idx) => (
        <input key={p.slug} type="hidden" name={`${name}[${idx}]`} value={p.name} />
      ))}
      <input
        type="hidden"
        name={name}
        value={selectedProducts.map((p) => p.name).join(", ")}
      />
      {name !== "product" && (
        <input
          type="hidden"
          name="product"
          value={selectedProducts.map((p) => p.name).join(", ")}
        />
      )}

      {/* 56px Tall Luxury Trigger Field */}
      <div
        ref={triggerRef}
        id={id}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={openModal}
        onMouseEnter={handleTriggerHover}
        onFocus={handleTriggerHover}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
            e.preventDefault();
            openModal();
          }
        }}
        className={cn(
          "group relative flex min-h-[56px] w-full cursor-pointer items-center justify-between rounded-[14px] border bg-[#FAF8F3]/95 px-3.5 py-2.5 transition-colors select-none",
          isOpen
            ? "border-[#C9973F] ring-2 ring-[#C9973F]/35 shadow-[0_0_20px_rgba(201,151,63,0.18)]"
            : "border-[#E3E7EE] hover:border-[#C9973F]/60 hover:shadow-soft",
          hasError && "border-destructive ring-1 ring-destructive/40"
        )}
      >
        <div className="flex flex-1 flex-wrap items-center gap-2 pr-2">
          <Search className="h-4 w-4 shrink-0 text-[#C9973F]/80 group-hover:text-[#C9973F] transition-colors" />

          {selectedProducts.length === 0 ? (
            <span className="font-serif italic text-sm text-[#0B1B33]/50 select-none">
              {placeholder}
            </span>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5 py-0.5">
              {selectedProducts.map((p) => (
                <span
                  key={p.slug}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#C9973F]/40 bg-white/95 py-1 pl-1 pr-2.5 text-xs font-medium text-[#071A33] shadow-sm hover:border-[#C9973F] transition-colors"
                >
                  <img
                    src={`/products/thumbs/${p.slug}.webp`}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full object-cover border border-[#C9973F]/30"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = p.image || `/products/${p.slug}.webp`;
                    }}
                  />
                  <span className="font-display tracking-tight text-[0.8rem]">{p.name}</span>
                  <button
                    type="button"
                    onClick={(e) => removeProduct(p.slug, e)}
                    aria-label={`Remove ${p.name}`}
                    className="rounded-full p-0.5 text-muted-foreground/70 hover:bg-black/5 hover:text-destructive transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}

              {selectedProducts.length < maxSelected && (
                <span className="text-[0.7rem] text-[#C9973F] font-medium pl-1 select-none">
                  +{maxSelected - selectedProducts.length} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 pl-1 select-none">
          {selectedProducts.length > 0 && (
            <span className="hidden sm:inline-block rounded-full bg-[#C9973F]/15 px-2 py-0.5 text-[0.68rem] font-semibold text-[#071A33]">
              {selectedProducts.length}/{maxSelected}
            </span>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-[#C9973F] transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* PORTAL LAZY MODAL DIALOG */}
      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <Suspense
            fallback={
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                style={{ backgroundColor: "rgba(5, 12, 25, 0.65)" }}
              >
                <div className="w-[min(960px,calc(100vw-32px))] h-[min(720px,calc(100dvh-32px))] rounded-[24px] bg-[#FAF8F3] border border-[#C9973F]/40 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9973F] border-t-transparent" />
                    <span className="text-xs font-medium text-[#071A33]">Loading catalog...</span>
                  </div>
                </div>
              </div>
            }
          >
            <ProductPickerModal
              selectedProducts={selectedProducts}
              maxSelected={maxSelected}
              onToggle={toggleProduct}
              onClear={() => onChange([])}
              onClose={closeModal}
              onCustomRequest={onCustomRequest}
            />
          </Suspense>,
          document.body
        )}
    </div>
  );
}
