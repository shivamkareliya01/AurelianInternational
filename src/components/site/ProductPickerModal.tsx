import { ArrowRight, Check, Layers, MessageSquare, Plus, Search, Sparkles, X } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { allProducts, categories, type Category, type Product } from "@/data/products";
import { cn } from "@/lib/utils";

export type CatalogProduct = Product & { category: Category };

export interface SelectedProductItem {
  slug: string;
  name: string;
  category: string;
  image?: string | undefined;
  origin?: string | undefined;
  grade?: string | undefined;
  moq?: string | undefined;
}

// ---------------------------------------------------------------------------
// 1. Memoized Product Row Item (Strictly Re-renders ONLY when isSelected changes)
// ---------------------------------------------------------------------------
interface ProductCardItemProps {
  product: CatalogProduct;
  isSelected: boolean;
  showCategory: boolean;
  onToggle: (p: CatalogProduct) => void;
  onHover: (p: CatalogProduct) => void;
}

const ProductCardItem = React.memo(
  function ProductCardItem({
    product,
    isSelected,
    showCategory,
    onToggle,
    onHover,
  }: ProductCardItemProps) {
    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle(product);
      },
      [onToggle, product]
    );

    const handleMouseEnter = useCallback(() => {
      onHover(product);
    }, [onHover, product]);

    return (
      <div
        role="option"
        aria-selected={isSelected}
        tabIndex={0}
        title={product.name}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle(product);
          }
        }}
        onMouseEnter={handleMouseEnter}
        className={cn(
          "picker-row-contain group relative flex h-[72px] min-h-[72px] max-h-[72px] cursor-pointer items-center gap-3 overflow-hidden rounded-xl border p-2.5 transition-[background-color,border-color,opacity] duration-150 select-none",
          isSelected
            ? "border-[#C9973F] bg-[#C9973F]/12"
            : "border-[#E3E7EE] bg-white hover:border-[#C9973F]/80 hover:bg-[#FAF6EE]/90"
        )}
      >
        {/* Left accent bar for selected state */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1 bg-[#C9973F] transition-opacity duration-150",
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-60"
          )}
        />

        {/* 48px Lightweight WebP Thumbnail (~1.9 KB each) */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#E3E7EE] bg-[#FAF8F3]">
          <img
            src={`/products/thumbs/${product.slug}.webp`}
            alt=""
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fallback to primary image if custom thumbnail missing
              (e.currentTarget as HTMLImageElement).src = product.image || `/products/${product.slug}.webp`;
            }}
          />
        </div>

        {/* Product Details: Name (Line 1) & Origin/Category (Line 2) */}
        <div className="min-w-0 flex-1 flex flex-col justify-center">
          <span className="font-display text-sm font-semibold text-[#071A33] truncate leading-snug">
            {product.name}
          </span>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground truncate">
            <span className="truncate text-[0.72rem]">{product.origin}</span>
            {showCategory && (
              <span className="shrink-0 text-[0.62rem] font-medium text-[#C9973F] bg-[#C9973F]/12 px-1.5 py-0.2 rounded whitespace-nowrap">
                {product.category.name}
              </span>
            )}
          </div>
        </div>

        {/* Action Button: Checkmark or Plus */}
        <div className="shrink-0 pl-1">
          {isSelected ? (
            <div className="grid h-6 w-6 place-items-center rounded-full bg-[#C9973F] text-white">
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
            </div>
          ) : (
            <div className="grid h-6 w-6 place-items-center rounded-full bg-black/5 text-[#071A33]/60 group-hover:bg-[#C9973F] group-hover:text-white transition-colors">
              <Plus className="h-3.5 w-3.5 stroke-[2]" />
            </div>
          )}
        </div>
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.product.slug === next.product.slug &&
      prev.isSelected === next.isSelected &&
      prev.showCategory === next.showCategory &&
      prev.onToggle === next.onToggle &&
      prev.onHover === next.onHover
    );
  }
);

// ---------------------------------------------------------------------------
// 2. Right-Hand Preview Panel with Preloading & Cross-fade (Single <img>)
// ---------------------------------------------------------------------------
interface PreviewPanelProps {
  product: CatalogProduct | null;
  isSelected: boolean;
  onToggle: (p: CatalogProduct) => void;
}

const PreviewPanel = React.memo(function PreviewPanel({
  product,
  isSelected,
  onToggle,
}: PreviewPanelProps) {
  const [activeProduct, setActiveProduct] = useState<CatalogProduct | null>(product);
  const [activeSrc, setActiveSrc] = useState<string>(
    product ? `/products/previews/${product.slug}.webp` : ""
  );
  const [imgOpacity, setImgOpacity] = useState<number>(1);
  const preloaderRef = useRef<HTMLImageElement | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!product) return;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 60ms hover delay to prevent rapid swapping while passing through rows
    debounceTimerRef.current = setTimeout(() => {
      const nextSrc = `/products/previews/${product.slug}.webp`;
      if (nextSrc === activeSrc && activeProduct?.slug === product.slug) return;

      // Preload next image with new Image()
      const img = new Image();
      preloaderRef.current = img;
      img.src = nextSrc;
      img.onload = () => {
        setImgOpacity(0.4);
        setTimeout(() => {
          setActiveProduct(product);
          setActiveSrc(nextSrc);
          setImgOpacity(1);
        }, 50);
      };
      img.onerror = () => {
        // Fallback to original image
        setActiveProduct(product);
        setActiveSrc(product.image || `/products/${product.slug}.webp`);
        setImgOpacity(1);
      };
    }, 60);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [product, activeSrc, activeProduct]);

  if (!activeProduct) {
    return (
      <div className="hidden md:flex md:w-[38%] flex-col items-center justify-center border-l border-[#C9973F]/20 bg-white/70 p-6 text-center text-xs text-muted-foreground select-none">
        <Layers className="h-8 w-8 text-[#C9973F]/40 mb-2 stroke-1" />
        <p>Hover over any product to inspect grades, specifications, and packaging.</p>
      </div>
    );
  }

  return (
    <div className="hidden md:flex md:w-[38%] flex-col justify-between border-l border-[#C9973F]/20 bg-white/70 p-4 select-none overflow-y-auto">
      <div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#E3E7EE] bg-[#FAF8F3]">
          {/* Single <img> Element with smooth opacity cross-fade */}
          <img
            src={activeSrc}
            alt={activeProduct.name}
            width={480}
            height={360}
            decoding="async"
            style={{ opacity: imgOpacity }}
            className="h-full w-full object-cover transition-opacity duration-150"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=480&q=80";
            }}
          />
          <div className="absolute top-2 left-2 rounded-full bg-[#071A33]/90 px-2.5 py-0.5 text-[0.65rem] font-semibold text-gold-soft">
            {activeProduct.category.name}
          </div>
        </div>

        <h4 className="mt-3 font-display text-base font-semibold text-[#071A33] leading-snug">
          {activeProduct.name}
        </h4>

        <div className="mt-2.5 space-y-1.5 rounded-xl bg-[#FAF8F3] p-2.5 border border-[#E3E7EE] text-[0.72rem]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Origin:</span>
            <span className="font-medium text-[#071A33]">{activeProduct.origin}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Standard Grade:</span>
            <span className="font-medium text-[#071A33] text-right truncate max-w-[170px]">
              {activeProduct.grade}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">MOQ:</span>
            <span className="font-medium text-[#C9973F]">{activeProduct.moq}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Packaging:</span>
            <span className="font-medium text-[#071A33] truncate max-w-[170px]">
              {activeProduct.packaging}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onToggle(activeProduct)}
        className={cn(
          "mt-3 w-full rounded-xl py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer",
          isSelected
            ? "border border-[#C9973F] bg-[#C9973F]/15 text-[#071A33]"
            : "bg-[#071A33] text-gold-soft hover:bg-[#0E2A4F]"
        )}
      >
        {isSelected ? (
          <>
            <Check className="h-3.5 w-3.5 text-[#C9973F]" /> Selected
          </>
        ) : (
          <>
            <Plus className="h-3.5 w-3.5" /> Add to Enquiry
          </>
        )}
      </button>
    </div>
  );
});

// ---------------------------------------------------------------------------
// 3. Virtualized Product Grid (Renders Only ~10 Visible Items at 60fps)
// ---------------------------------------------------------------------------
interface VirtualListProps {
  products: CatalogProduct[];
  isMobile: boolean;
  selectedMap: Set<string>;
  showCategory: boolean;
  onToggle: (p: CatalogProduct) => void;
  onHover: (p: CatalogProduct) => void;
  onCustomRequest?: ((query: string) => void) | undefined;
  searchQuery: string;
}

const VirtualProductList = React.memo(function VirtualProductList({
  products,
  isMobile,
  selectedMap,
  showCategory,
  onToggle,
  onHover,
  onCustomRequest,
  searchQuery,
}: VirtualListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const numCols = isMobile ? 1 : 2;

  // Chunk products into row pairs for 2-column virtualization
  const rowChunks = useMemo(() => {
    const chunks: CatalogProduct[][] = [];
    for (let i = 0; i < products.length; i += numCols) {
      chunks.push(products.slice(i, i + numCols));
    }
    return chunks;
  }, [products, numCols]);

  const rowVirtualizer = useVirtualizer({
    count: rowChunks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 82, // 72px card height + 10px gap
    overscan: 4,
  });

  if (products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center select-none">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#C9973F]/15 text-[#C9973F] mb-3">
          <Layers className="h-6 w-6 stroke-1" />
        </div>
        <p className="font-display text-lg text-[#071A33]">
          No products match &ldquo;{searchQuery}&rdquo;
        </p>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          We export custom agri-produce, spice blends, and cut-to-size stones.
        </p>
        <button
          type="button"
          onClick={() => onCustomRequest?.(searchQuery)}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#071A33] px-4 py-2 text-xs font-semibold text-gold-soft hover:bg-[#0E2A4F] transition-colors cursor-pointer"
        >
          <MessageSquare className="h-3.5 w-3.5" /> Tell us what you need
        </button>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="flex-1 overflow-y-auto p-3 sm:p-4 overscroll-contain"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowItems = rowChunks[virtualRow.index];
          if (!rowItems) return null;
          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size - 10}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className={cn("grid gap-2.5", numCols === 1 ? "grid-cols-1" : "grid-cols-2")}
            >
              {rowItems.map((p) => (
                <ProductCardItem
                  key={p.slug}
                  product={p}
                  isSelected={selectedMap.has(p.slug)}
                  showCategory={showCategory}
                  onToggle={onToggle}
                  onHover={onHover}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// 4. Modal Dialog Component
// ---------------------------------------------------------------------------
interface ProductPickerModalProps {
  selectedProducts: SelectedProductItem[];
  maxSelected: number;
  onToggle: (p: CatalogProduct) => void;
  onClear: () => void;
  onClose: () => void;
  onCustomRequest?: ((query: string) => void) | undefined;
}

export default function ProductPickerModal({
  selectedProducts,
  maxSelected,
  onToggle,
  onClear,
  onClose,
  onCustomRequest,
}: ProductPickerModalProps) {
  const [rawSearch, setRawSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [hoveredProduct, setHoveredProduct] = useState<CatalogProduct | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const scrollYRef = useRef<number>(0);
  const titleId = useId();

  // Mobile state (<700px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-focus search input
  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation & escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const validProducts = useMemo(() => allProducts, []);

  // Category counts and tabs
  const categoryTabs = useMemo(() => {
    return [
      { id: "all", name: "All", count: validProducts.length },
      ...categories.map((c) => ({
        id: c.slug,
        name: c.name,
        count: c.products.length,
      })),
    ];
  }, [validProducts]);

  // Debounced search input (120ms)
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRawSearch(val);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearch(val.trim().toLowerCase());
    }, 120);
  }, []);

  const handleClearSearch = useCallback(() => {
    setRawSearch("");
    setDebouncedSearch("");
    searchInputRef.current?.focus();
  }, []);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return validProducts.filter((p) => {
      const matchesCat = activeCategory === "all" || p.category.slug === activeCategory;
      if (!matchesCat) return false;
      if (!debouncedSearch) return true;
      return (
        p.name.toLowerCase().includes(debouncedSearch) ||
        p.category.name.toLowerCase().includes(debouncedSearch) ||
        p.origin.toLowerCase().includes(debouncedSearch) ||
        p.slug.toLowerCase().includes(debouncedSearch)
      );
    });
  }, [validProducts, activeCategory, debouncedSearch]);

  // Initial preview item on load or filter change
  useEffect(() => {
    if (selectedProducts.length > 0 && selectedProducts[0]) {
      const match = validProducts.find((p) => p.slug === selectedProducts[0]?.slug);
      if (match) {
        setHoveredProduct(match);
        return;
      }
    }
    if (filteredProducts.length > 0 && filteredProducts[0]) {
      setHoveredProduct(filteredProducts[0]);
    } else {
      setHoveredProduct(null);
    }
  }, [selectedProducts, validProducts, filteredProducts]);

  // Hover preview handler (stable callback for memoized items)
  const handleCardHover = useCallback((product: CatalogProduct) => {
    setHoveredProduct(product);
  }, []);

  const selectedMap = useMemo(() => {
    const set = new Set<string>();
    selectedProducts.forEach((p) => set.add(p.slug));
    return set;
  }, [selectedProducts]);

  // Body scroll lock on mount to ensure page behind never scrolls or jumps
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4 animate-in fade-in-0 duration-150"
      style={{
        backgroundColor: "rgba(5, 12, 25, 0.65)", // Solid dark backdrop, NO backdrop-filter
      }}
    >
      {/* Modal Dialog Panel */}
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col overflow-hidden bg-[#FAF8F3] border border-[#C9973F]/40 shadow-[0_20px_50px_rgba(7,26,51,0.2)] select-none zoom-in-95 duration-150"
        style={{
          width: isMobile ? "100%" : "min(960px, calc(100vw - 32px))",
          maxWidth: "100%",
          height: isMobile ? "100dvh" : "min(720px, calc(100dvh - 32px))",
          maxHeight: isMobile ? "100dvh" : "min(720px, calc(100dvh - 32px))",
          borderRadius: isMobile ? "0px" : "24px",
        }}
      >
        {/* Header: Title, Search, Category Tabs (Fixed Height: flex-none) */}
        <div className="flex-none border-b border-[#C9973F]/20 bg-[#FAF8F3] px-4 sm:px-6 pt-3.5 pb-2.5">
          {/* Title Row */}
          <div className="flex items-center justify-between gap-3 mb-3 select-none">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#C9973F]" />
              <h3
                id={titleId}
                className="font-display text-base sm:text-lg font-semibold text-[#071A33]"
              >
                Select Export Products
              </h3>
              <span className="rounded-full bg-[#C9973F]/15 px-2 py-0.5 text-[0.68rem] font-semibold text-[#071A33]">
                {validProducts.length} verified
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-medium">
                {Number.isFinite(maxSelected)
                  ? `${selectedProducts.length}/${maxSelected} selected`
                  : `${selectedProducts.length} selected`}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-full p-1 text-muted-foreground hover:bg-black/5 hover:text-[#071A33] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex items-center mb-3">
            <Search className="absolute left-3.5 h-4 w-4 text-[#C9973F]" />
            <input
              ref={searchInputRef}
              type="text"
              value={rawSearch}
              onChange={handleSearchChange}
              placeholder="Search 78 export products by name, origin, or category..."
              className="w-full rounded-xl border border-[#E3E7EE] bg-white py-2 pl-10 pr-9 text-sm text-[#0B1B33] placeholder:text-muted-foreground/60 transition-colors focus:border-[#C9973F] focus:outline-none focus:ring-1 focus:ring-[#C9973F]"
            />
            {rawSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="absolute right-3 rounded-full p-1 text-muted-foreground hover:bg-black/5 hover:text-[#0B1B33] cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs: Clean horizontal scroll with .no-scrollbar */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-medium border-b border-[#E3E7EE]/80">
            {categoryTabs.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 transition-colors flex items-center gap-1.5 cursor-pointer mb-1",
                    active
                      ? "bg-[#071A33] text-gold-soft font-semibold shadow-sm"
                      : "bg-white text-[#0B1B33]/70 hover:bg-white/90 hover:text-[#071A33] border border-[#E3E7EE]"
                  )}
                >
                  <span>{cat.name}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[0.65rem]",
                      active ? "bg-white/15 text-white" : "bg-black/5 text-muted-foreground"
                    )}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Body: Split View (Virtualized Grid on Left + Desktop Preview on Right) */}
        <div className="flex-1 overflow-hidden flex min-h-0">
          <VirtualProductList
            products={filteredProducts}
            isMobile={isMobile}
            selectedMap={selectedMap}
            showCategory={activeCategory === "all"}
            onToggle={onToggle}
            onHover={handleCardHover}
            onCustomRequest={onCustomRequest}
            searchQuery={rawSearch}
          />

          <PreviewPanel
            product={hoveredProduct}
            isSelected={Boolean(hoveredProduct && selectedMap.has(hoveredProduct.slug))}
            onToggle={onToggle}
          />
        </div>

        {/* Footer Bar: Fixed Height with Always-Visible Done Button */}
        <div className="flex-none flex items-center justify-between border-t border-[#C9973F]/20 bg-[#FAF8F3] px-4 sm:px-6 py-3 select-none">
          <div className="text-xs text-muted-foreground">
            {selectedProducts.length > 0 ? (
              <span>
                <strong className="text-[#071A33] font-semibold">
                  {selectedProducts.length}
                </strong>{" "}
                {Number.isFinite(maxSelected)
                  ? `selected (max ${maxSelected})`
                  : "products selected"}
              </span>
            ) : (
              <span>Select products for export quote</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {selectedProducts.length > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D4A54E] via-[#C9973F] to-[#9B6F28] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-95"
            >
              Done <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
