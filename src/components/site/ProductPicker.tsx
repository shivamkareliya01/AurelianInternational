import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Layers,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { allProducts, categories, type Product } from "@/data/products";
import { cn } from "@/lib/utils";

// Blacklist strictly forbidding any deleted product from ever rendering
const BLACKLISTED_SLUGS = new Set([
  "brinjal",
  "eggplant",
  "okra-lady-finger",
  "cabbage",
  "green-peas",
  "cauliflower",
  "kesar-mango",
  "thompson-seedless-grapes",
  "nagpur-orange",
  "lemon",
  "papaya",
  "pineapple",
  "butterfly-pea-flower-powder",
  "rose-petal-powder",
  "purple-sweet-potato-powder",
  "lemongrass-powder",
]);

export interface SelectedProductItem {
  slug: string;
  name: string;
  category: string;
  image?: string;
  origin?: string;
  grade?: string;
  moq?: string;
}

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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerId = useId();
  const listboxId = useId();
  const prefersReducedMotion = useReducedMotion();

  // Position state for desktop floating dropdown
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; flip: boolean }>({
    top: 0,
    left: 0,
    width: 720,
    flip: false,
  });

  // Filter out any blacklisted products from data catalog
  const validProducts = useMemo(() => {
    return allProducts.filter((p) => !BLACKLISTED_SLUGS.has(p.slug));
  }, []);

  // Category counts and list
  const categoryTabs = useMemo(() => {
    const list = [
      { id: "all", name: "All", count: validProducts.length },
      ...categories.map((c) => ({
        id: c.slug,
        name: c.name,
        count: c.products.filter((p) => !BLACKLISTED_SLUGS.has(p.slug)).length,
      })),
    ];
    return list;
  }, [validProducts]);

  // Filtered products based on search and category
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return validProducts.filter((p) => {
      const matchesCat = activeCategory === "all" || p.categorySlug === activeCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      );
    });
  }, [validProducts, activeCategory, searchQuery]);

  // Set default preview product to the first item or first selected item
  useEffect(() => {
    if (selectedProducts.length > 0) {
      const match = validProducts.find((p) => p.slug === selectedProducts[0].slug);
      if (match) {
        setPreviewProduct(match);
        return;
      }
    }
    if (filteredProducts.length > 0) {
      setPreviewProduct(filteredProducts[0]);
    }
  }, [isOpen, selectedProducts, validProducts]);

  // Update hover preview with 150ms debounce
  const handleCardHover = useCallback((product: Product | null) => {
    setHoveredProduct(product);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (product) {
      hoverTimeoutRef.current = setTimeout(() => {
        setPreviewProduct(product);
      }, 150);
    }
  }, []);

  // Calculate panel position relative to trigger
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const panelHeight = 560;
    const roomBelow = window.innerHeight - rect.bottom;
    const flip = roomBelow < panelHeight && rect.top > panelHeight;
    const width = Math.min(760, Math.max(rect.width, 680));
    const left = Math.max(16, Math.min(rect.left, window.innerWidth - width - 24));

    setCoords({
      top: flip ? rect.top - panelHeight - 8 : rect.bottom + 8,
      left,
      width,
      flip,
    });
  }, []);

  // Update position on open, scroll, resize
  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
      setHoveredProduct(null);
    }
  }, [isOpen]);

  // Mouse spotlight coordinates inside panel
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !panelRef.current) return;
      const rect = panelRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      panelRef.current.style.setProperty("--mx", `${x}px`);
      panelRef.current.style.setProperty("--my", `${y}px`);
    },
    [prefersReducedMotion]
  );

  // Outside click to close
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Toggle product selection
  const toggleProduct = useCallback(
    (product: Product) => {
      const exists = selectedProducts.some((p) => p.slug === product.slug);
      if (exists) {
        onChange(selectedProducts.filter((p) => p.slug !== product.slug));
      } else {
        if (selectedProducts.length >= maxSelected) {
          return;
        }
        onChange([
          ...selectedProducts,
          {
            slug: product.slug,
            name: product.name,
            category: product.category,
            image: product.image,
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

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, filteredProducts.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && focusedIndex >= 0 && focusedIndex < filteredProducts.length) {
        e.preventDefault();
        toggleProduct(filteredProducts[focusedIndex]);
      }
    },
    [isOpen, focusedIndex, filteredProducts, toggleProduct]
  );

  // Magnetic button hook for "Done" button
  const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0 });
  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) * 0.28;
    const dy = (e.clientY - centerY) * 0.28;
    setMagneticPos({ x: dx, y: dy });
  };
  const handleMagneticLeave = () => {
    setMagneticPos({ x: 0, y: 0 });
  };

  const isSelected = useCallback(
    (slug: string) => selectedProducts.some((p) => p.slug === slug),
    [selectedProducts]
  );

  return (
    <div className={cn("relative w-full", className)} onKeyDown={handleKeyDown}>
      {/* Hidden inputs for form data submission */}
      {selectedProducts.map((p, idx) => (
        <input key={p.slug} type="hidden" name={`${name}[${idx}]`} value={p.name} />
      ))}
      <input
        type="hidden"
        name={name}
        value={selectedProducts.map((p) => p.name).join(", ")}
      />

      {/* 56px Tall Elegant Trigger Field */}
      <div
        ref={triggerRef}
        id={triggerId}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group relative flex min-h-[56px] w-full cursor-pointer items-center justify-between rounded-[14px] border bg-[#FAF8F3]/95 px-3.5 py-2.5 transition-all duration-300",
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
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#C9973F]/40 bg-white/95 py-1 pl-1 pr-2.5 text-xs font-medium text-[#071A33] shadow-sm transition-all hover:border-[#C9973F]"
                >
                  <img
                    src={p.image || `/products/${p.slug}.webp`}
                    alt={p.name}
                    className="h-7 w-7 rounded-full object-cover border border-[#C9973F]/30"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=120&q=80";
                    }}
                  />
                  <span className="font-display tracking-tight text-[0.8rem]">{p.name}</span>
                  <button
                    type="button"
                    onClick={(e) => removeProduct(p.slug, e)}
                    aria-label={`Remove ${p.name}`}
                    className="rounded-full p-0.5 text-muted-foreground/70 hover:bg-black/5 hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}

              {selectedProducts.length < maxSelected && (
                <span className="text-[0.7rem] text-[#C9973F] font-medium pl-1">
                  +{maxSelected - selectedProducts.length} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 pl-1">
          {selectedProducts.length > 0 && (
            <span className="hidden sm:inline-block rounded-full bg-[#C9973F]/15 px-2 py-0.5 text-[0.68rem] font-semibold text-[#071A33]">
              {selectedProducts.length}/{maxSelected}
            </span>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4 text-[#C9973F]" />
          </motion.div>
        </div>
      </div>

      {/* PORTAL PANEL */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 z-50 bg-[#040E1F]/50 backdrop-blur-sm"
                />

                {/* Panel Container (Mobile Bottom Sheet / Desktop Floating Dropdown) */}
                <motion.div
                  ref={panelRef}
                  id={listboxId}
                  role="listbox"
                  aria-multiselectable="true"
                  onPointerMove={handlePointerMove}
                  initial={
                    window.innerWidth < 768
                      ? { y: "100%", opacity: 0 }
                      : {
                          scale: 0.96,
                          opacity: 0,
                          y: coords.flip ? -8 : 8,
                        }
                  }
                  animate={
                    window.innerWidth < 768
                      ? { y: 0, opacity: 1 }
                      : { scale: 1, opacity: 1, y: 0 }
                  }
                  exit={
                    window.innerWidth < 768
                      ? { y: "100%", opacity: 0 }
                      : {
                          scale: 0.96,
                          opacity: 0,
                          y: coords.flip ? -8 : 8,
                        }
                  }
                  transition={{
                    type: prefersReducedMotion ? "tween" : "spring",
                    duration: 0.22,
                    stiffness: 380,
                    damping: 30,
                  }}
                  style={
                    window.innerWidth < 768
                      ? {}
                      : {
                          position: "fixed",
                          top: `${coords.top}px`,
                          left: `${coords.left}px`,
                          width: `${coords.width}px`,
                          maxHeight: "72vh",
                        }
                  }
                  className={cn(
                    "z-50 flex flex-col overflow-hidden border border-[#C9973F]/40 bg-[#FAF8F3] shadow-[0_24px_60px_rgba(7,26,51,0.28)]",
                    window.innerWidth < 768
                      ? "fixed inset-x-0 bottom-0 max-h-[85vh] rounded-t-[28px]"
                      : "rounded-[24px]"
                  )}
                >
                  {/* Cursor-follow gold spotlight layer */}
                  {!prefersReducedMotion && (
                    <div
                      className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
                      style={{
                        background:
                          "radial-gradient(180px circle at var(--mx, -500px) var(--my, -500px), rgba(201,151,63,0.18), transparent 75%)",
                      }}
                    />
                  )}

                  {/* Mobile Drag Handle */}
                  <div className="md:hidden pt-2.5 pb-1 flex justify-center shrink-0">
                    <div className="h-1.5 w-12 rounded-full bg-[#071A33]/20" />
                  </div>

                  {/* Sticky Header: Search Bar */}
                  <div className="relative z-10 border-b border-[#C9973F]/20 bg-[#FAF8F3]/95 px-5 pt-3 pb-3 backdrop-blur-md">
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#C9973F]" />
                        <span className="font-display text-base font-semibold text-[#071A33]">
                          Select Export Products
                        </span>
                        <span className="rounded-full bg-[#C9973F]/15 px-2 py-0.5 text-[0.7rem] font-semibold text-[#071A33]">
                          {validProducts.length} verified
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {selectedProducts.length}/{maxSelected} selected
                      </span>
                    </div>

                    <div className="relative flex items-center">
                      <Search className="absolute left-3.5 h-4 w-4 text-[#C9973F]" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search 90+ products by name, origin, or category...`}
                        className="w-full rounded-xl border border-[#E3E7EE] bg-white py-2.5 pl-10 pr-9 text-sm text-[#0B1B33] placeholder:text-muted-foreground/60 transition-colors focus:border-[#C9973F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/25"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 rounded-full p-1 text-muted-foreground hover:bg-black/5 hover:text-[#0B1B33]"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Horizontally scrolling Category Tabs with Animated Underline */}
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-medium">
                      {categoryTabs.map((cat) => {
                        const active = activeCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn(
                              "relative shrink-0 rounded-full px-3 py-1.5 transition-all flex items-center gap-1.5",
                              active
                                ? "bg-[#071A33] text-gold-soft font-semibold shadow-sm"
                                : "bg-white/80 text-[#0B1B33]/70 hover:bg-white hover:text-[#071A33] border border-[#E3E7EE]"
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
                            {active && !prefersReducedMotion && (
                              <motion.div
                                layoutId="activeCategoryPill"
                                className="absolute inset-0 rounded-full ring-1 ring-[#C9973F]/50 -z-10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Body: Split View (Cards Grid on left + Desktop Hover Preview on right) */}
                  <div className="relative z-10 flex-1 overflow-hidden grid md:grid-cols-12 min-h-0">
                    {/* Products Grid Column */}
                    <div className="md:col-span-8 overflow-y-auto p-4 space-y-4 max-h-[50vh] md:max-h-[52vh] thin-scrollbar">
                      {filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                          <div className="grid h-12 w-12 place-items-center rounded-full bg-[#C9973F]/15 text-[#C9973F] mb-3">
                            <Layers className="h-6 w-6 stroke-1" />
                          </div>
                          <p className="font-display text-lg text-[#071A33]">
                            No products match "{searchQuery}"
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                            We export custom agri-produce, spice blends, and cut-to-size stones.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              onCustomRequest?.(searchQuery);
                              setIsOpen(false);
                            }}
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#071A33] px-4 py-2 text-xs font-semibold text-gold-soft hover:bg-[#0E2A4F] transition-colors"
                          >
                            <MessageSquare className="h-3.5 w-3.5" /> Tell us what you need
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {filteredProducts.map((p, index) => {
                            const selected = isSelected(p.slug);
                            const isHovered = hoveredProduct?.slug === p.slug;
                            const isDimmed = Boolean(hoveredProduct && !isHovered);

                            return (
                              <motion.div
                                key={p.slug}
                                role="option"
                                aria-selected={selected}
                                tabIndex={-1}
                                onMouseEnter={() => handleCardHover(p)}
                                onMouseLeave={() => handleCardHover(null)}
                                onClick={() => toggleProduct(p)}
                                whileHover={
                                  prefersReducedMotion
                                    ? {}
                                    : {
                                        y: -4,
                                        scale: 1.03,
                                        transition: { type: "spring", stiffness: 420, damping: 25 },
                                      }
                                }
                                className={cn(
                                  "group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl border p-2.5 transition-all duration-200",
                                  selected
                                    ? "border-[#C9973F] bg-[#C9973F]/10 shadow-[0_4px_16px_rgba(201,151,63,0.18)]"
                                    : "border-[#E3E7EE] bg-white hover:border-[#C9973F]/80 hover:shadow-[0_8px_20px_rgba(7,26,51,0.08)]",
                                  isDimmed && "opacity-85",
                                  focusedIndex === index && "ring-2 ring-[#C9973F]"
                                )}
                              >
                                {/* Left gold accent bar that animates in on hover */}
                                <div
                                  className={cn(
                                    "absolute left-0 top-0 bottom-0 w-1 bg-[#C9973F] transition-all duration-200",
                                    selected || isHovered ? "opacity-100" : "opacity-0"
                                  )}
                                />

                                {/* 44px Thumbnail with zoom on hover */}
                                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-[#E3E7EE]">
                                  <img
                                    src={p.image || `/products/${p.slug}.webp`}
                                    alt={p.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-112"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).src =
                                        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=120&q=80";
                                    }}
                                  />
                                </div>

                                {/* Product Info */}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <h5 className="font-display text-sm font-semibold text-[#071A33] truncate">
                                      {p.name}
                                    </h5>
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[0.68rem] text-muted-foreground truncate">
                                      {p.origin}
                                    </span>
                                    <span className="text-[0.62rem] font-medium text-[#C9973F] bg-[#C9973F]/10 px-1.5 py-0.2 rounded">
                                      {p.category}
                                    </span>
                                  </div>
                                </div>

                                {/* Selection Check / Plus Action */}
                                <div className="shrink-0 pl-1">
                                  {selected ? (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                      className="grid h-6 w-6 place-items-center rounded-full bg-[#C9973F] text-white shadow-sm"
                                    >
                                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                    </motion.div>
                                  ) : (
                                    <div className="grid h-6 w-6 place-items-center rounded-full bg-black/5 text-[#071A33]/60 group-hover:bg-[#C9973F] group-hover:text-white transition-all transform group-hover:translate-x-0.5">
                                      <Plus className="h-3.5 w-3.5" />
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Desktop Right Column: 150ms Hover Preview Card */}
                    <div className="hidden md:flex md:col-span-4 flex-col border-l border-[#C9973F]/20 bg-white/70 p-4">
                      {previewProduct ? (
                        <motion.div
                          key={previewProduct.slug}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col h-full justify-between"
                        >
                          <div>
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#E3E7EE] shadow-sm">
                              <img
                                src={previewProduct.image || `/products/${previewProduct.slug}.webp`}
                                alt={previewProduct.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80";
                                }}
                              />
                              <div className="absolute top-2 left-2 rounded-full bg-[#071A33]/85 backdrop-blur-sm px-2.5 py-0.5 text-[0.65rem] font-semibold text-gold-soft">
                                {previewProduct.category}
                              </div>
                            </div>

                            <h4 className="mt-3 font-display text-base font-semibold text-[#071A33]">
                              {previewProduct.name}
                            </h4>

                            <div className="mt-2.5 space-y-1.5 rounded-xl bg-[#FAF8F3] p-2.5 border border-[#E3E7EE] text-[0.72rem]">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Origin:</span>
                                <span className="font-medium text-[#071A33]">{previewProduct.origin}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Standard Grade:</span>
                                <span className="font-medium text-[#071A33]">{previewProduct.grade}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">MOQ:</span>
                                <span className="font-medium text-[#C9973F]">{previewProduct.moq}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Packaging:</span>
                                <span className="font-medium text-[#071A33] truncate max-w-[130px]">{previewProduct.packaging}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleProduct(previewProduct)}
                            className={cn(
                              "mt-3 w-full rounded-xl py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
                              isSelected(previewProduct.slug)
                                ? "border border-[#C9973F] bg-[#C9973F]/15 text-[#071A33]"
                                : "bg-[#071A33] text-gold-soft hover:bg-[#0E2A4F]"
                            )}
                          >
                            {isSelected(previewProduct.slug) ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-[#C9973F]" /> Selected
                              </>
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5" /> Add to Enquiry
                              </>
                            )}
                          </button>
                        </motion.div>
                      ) : (
                        <div className="flex h-full items-center justify-center text-center text-xs text-muted-foreground">
                          Hover over any product to inspect grades and minimum order quantities.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Bar: Magnetic Done Button */}
                  <div className="relative z-10 flex items-center justify-between border-t border-[#C9973F]/20 bg-[#FAF8F3] px-5 py-3.5">
                    <div className="text-xs text-muted-foreground">
                      {selectedProducts.length > 0 ? (
                        <span>
                          <strong className="text-[#071A33] font-semibold">
                            {selectedProducts.length}
                          </strong>{" "}
                          selected (max {maxSelected})
                        </span>
                      ) : (
                        <span>Select at least 1 product for export quote</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedProducts.length > 0 && (
                        <button
                          type="button"
                          onClick={() => onChange([])}
                          className="rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          Clear all
                        </button>
                      )}

                      <motion.button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        onMouseMove={handleMagneticMove}
                        onMouseLeave={handleMagneticLeave}
                        animate={{ x: magneticPos.x, y: magneticPos.y }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D4A54E] via-[#C9973F] to-[#9B6F28] px-5 py-2 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(201,151,63,0.35)] hover:shadow-[0_6px_20px_rgba(201,151,63,0.45)] transition-shadow"
                      >
                        Done <ArrowRight className="h-3.5 w-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
