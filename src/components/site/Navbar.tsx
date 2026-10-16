import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { categories } from "@/data/products";
import { site } from "@/data/site";
import { useBasket } from "@/lib/basket";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { InfinityWatermark, btn } from "./primitives";

const links = [
  { to: "/about", label: "About" },
  { to: "/markets", label: "Markets" },
  { to: "/certifications", label: "Certifications" },
  { to: "/blog", label: "Blog" },
] as const;

// Rich category metadata for descriptors and spec chips
const categoryMeta: Record<
  string,
  { descriptor: string; origin: string; moq: string; cert: string }
> = {
  agriculture: {
    descriptor: "Basmati, wheat, maize & pulses",
    origin: "Origin: Punjab & Haryana",
    moq: "MOQ: 1 × 20ft FCL (25 MT)",
    cert: "APEDA & ISO 22000",
  },
  "fresh-vegetables": {
    descriptor: "Onions, garlic, ginger & green chillies",
    origin: "Origin: Nashik & Gujarat",
    moq: "MOQ: 1 × 40ft Reefer (28 MT)",
    cert: "GlobalGAP & APEDA",
  },
  "fresh-fruits": {
    descriptor: "Alphonso mangoes, pomegranate & bananas",
    origin: "Origin: Ratnagiri & Maharashtra",
    moq: "MOQ: Air Freight / Reefer FCL",
    cert: "Phytosanitary & APEDA",
  },
  spices: {
    descriptor: "Cardamom, turmeric, cumin & cloves",
    origin: "Origin: Kerala & Rajasthan",
    moq: "MOQ: 500 kg LCL / 20ft FCL",
    cert: "Spices Board of India",
  },
  "natural-stones-tiles": {
    descriptor: "Makrana marble, granite & vitrified tiles",
    origin: "Origin: Rajasthan & Morbi, Gujarat",
    moq: "MOQ: 1 × 20ft Heavy FCL",
    cert: "ISPM-15 Wooden Crates",
  },
};

const menuContainerVariants = {
  hidden: { opacity: 0, y: -12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);

  const megaRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { items, openBasket } = useBasket();

  // Route active checks
  const isHome = pathname === "/";
  const isProductsActive = pathname.startsWith("/products");
  const isTransparent = isHome && !scrolled && !mega;

  // Track scrolling
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route navigation
  useEffect(() => {
    setOpen(false);
    setMega(false);
  }, [pathname]);

  // Handle outside click & Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(event.target as Node)) {
        setMega(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMega(false);
        setOpen(false);
      }
    }
    if (mega) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mega]);

  // Smooth hover bridge handlers (prevents flicker on mouse movement)
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setMega(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setMega(false);
    }, 140);
  };

  const navLinkCls = cn(
    "relative text-sm font-medium tracking-wide transition-colors py-2 text-[#F4F1EA]/90 hover:text-[#F2C86E]"
  );

  const activeCategory = categories[activeCategoryIdx] ?? categories[0]!;
  const activeMeta = categoryMeta[activeCategory.slug] ?? {
    descriptor: activeCategory.blurb,
    origin: "Origin: Pan-India",
    moq: "MOQ: 1 × 20ft FCL",
    cert: "Export Grade Certified",
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        isTransparent
          ? "bg-transparent border-b border-transparent"
          : "bg-[#071A33] border-b border-[#C9973F]/35 shadow-lg"
      )}
    >
      <nav className="container-x flex h-20 items-center justify-between gap-6">
        <Logo size="md" />

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {/* Home Link - ONLY highlighted gold when on '/' AND mega menu is closed */}
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className={cn(
              navLinkCls,
              isHome && !mega && "!text-[#F2C86E] font-semibold"
            )}
          >
            Home
          </Link>

          {/* Products Mega-Menu Dropdown Trigger */}
          <div
            ref={megaRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to="/products"
              className={cn(
                navLinkCls,
                "inline-flex items-center gap-1.5 cursor-pointer py-2",
                (isProductsActive || mega) && "!text-[#F2C86E] font-semibold",
                mega &&
                  "after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#F2C86E] after:shadow-[0_0_8px_#F2C86E]"
              )}
            >
              Products
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200 text-[#C9973F]",
                  mega && "rotate-180 !text-[#F2C86E]"
                )}
              />
            </Link>

            {/* Mega-Menu Panel with Invisible Hover Bridge */}
            <AnimatePresence>
              {mega && (
                <div
                  className="fixed left-1/2 -translate-x-1/2 top-20 w-[96vw] max-w-[1200px] z-50 pt-2"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <motion.div
                    variants={menuContainerVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="relative rounded-b-[24px] rounded-t-lg border border-[rgba(242,200,110,0.25)] shadow-[0_40px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl overflow-hidden before:absolute before:-top-4 before:inset-x-0 before:h-5 before:content-['']"
                    style={{
                      background:
                        "linear-gradient(160deg, #0E2A4F 0%, #071A33 55%, #040E1F 100%)",
                    }}
                  >
                    {/* Subtle gold radial glow in top-right corner */}
                    <div
                      className="absolute top-0 right-0 w-[460px] h-[340px] pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle at 100% 0%, rgba(242,200,110,0.12), transparent 70%)",
                      }}
                    />

                    {/* Faint infinity-symbol watermark (3% opacity) in bottom-left */}
                    <InfinityWatermark className="absolute -bottom-10 -left-10 w-80 h-40 text-[#C9973F] opacity-[0.03] pointer-events-none" />

                    {/* Main 2-area layout: Left 65%, Right 35% */}
                    <div className="relative z-10 grid grid-cols-12 gap-6 p-6 lg:p-7">
                      {/* Left: 3-column Category Blocks (~65%) */}
                      <div className="col-span-12 lg:col-span-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 xl:gap-4">
                          {categories.map((c, idx) => {
                            const meta = categoryMeta[c.slug] ?? {
                              descriptor: c.blurb,
                            };
                            const isActive = activeCategoryIdx === idx;
                            return (
                              <motion.div
                                key={c.slug}
                                variants={itemVariants}
                                onMouseEnter={() => setActiveCategoryIdx(idx)}
                                className={cn(
                                  "group rounded-2xl p-3.5 transition-all duration-200 border cursor-pointer flex flex-col justify-between",
                                  isActive
                                    ? "bg-[#0E2A4F] border-[#C9973F]/60 shadow-lg shadow-[#040E1F]/50 -translate-y-0.5"
                                    : "bg-[#0E2A4F]/25 border-[#C9973F]/20 hover:bg-[#0E2A4F]/60 hover:border-[#C9973F]/50 hover:-translate-y-0.5"
                                )}
                              >
                                <div>
                                  {/* Header: Thumbnail + Category Name & Pill */}
                                  <div className="flex items-start gap-3">
                                    <img
                                      src={c.image}
                                      alt={c.name}
                                      className="h-11 w-11 rounded-full object-cover shrink-0 ring-1 ring-[#C9973F]/60 ring-offset-2 ring-offset-[#071A33]"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <Link
                                        to="/products/$category"
                                        params={{ category: c.slug }}
                                        className="font-display text-[18px] xl:text-[19px] font-medium leading-tight text-white group-hover:text-[#F2C86E] transition-colors truncate block"
                                      >
                                        {c.name}
                                      </Link>
                                      <span className="inline-block mt-1 text-[10px] font-sans font-semibold tracking-wider text-[#F2C86E] bg-[#040E1F]/90 border border-[#C9973F]/40 px-2 py-0.5 rounded-full">
                                        {c.products.length} products
                                      </span>
                                    </div>
                                  </div>

                                  {/* Short one-line descriptor in muted silver */}
                                  <p className="mt-2 text-xs text-[#A8B2C1] line-clamp-1 font-sans">
                                    {meta.descriptor}
                                  </p>

                                  {/* Top 4 Products List */}
                                  <ul className="mt-2.5 space-y-1.5 border-t border-[#C9973F]/15 pt-2">
                                    {c.products.slice(0, 4).map((p) => (
                                      <li key={p.slug}>
                                        <Link
                                          to="/products/$category/$product"
                                          params={{
                                            category: c.slug,
                                            product: p.slug,
                                          }}
                                          className="group/prod flex items-center justify-between text-[13px] text-[#D9DDE3] hover:text-[#F2C86E] transition-all duration-150 py-0.5"
                                        >
                                          <span className="flex items-center gap-2 group-hover/prod:translate-x-1 transition-transform duration-150 line-clamp-1">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#C9973F]/70 shrink-0 group-hover/prod:bg-[#F2C86E] transition-colors" />
                                            {p.name}
                                          </span>
                                          <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover/prod:opacity-100 group-hover/prod:translate-x-0 transition-all text-[#F2C86E] shrink-0 ml-1" />
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* "View all →" Link with animated underline */}
                                <div className="mt-3 pt-2 border-t border-[#C9973F]/10">
                                  <Link
                                    to="/products/$category"
                                    params={{ category: c.slug }}
                                    className="group/view inline-flex items-center gap-1.5 text-xs font-semibold text-[#F2C86E] hover:underline underline-offset-4"
                                  >
                                    View all
                                    <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/view:translate-x-1" />
                                  </Link>
                                </div>
                              </motion.div>
                            );
                          })}

                          {/* Grid ends with the 6 approved categories */}
                        </div>
                      </div>

                      {/* Right: Featured Preview Card (~35%) */}
                      <div className="col-span-12 lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#C9973F]/20 pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-between">
                        <div className="relative h-full min-h-[380px] rounded-2xl overflow-hidden border border-[#C9973F]/35 bg-[#040E1F] shadow-2xl flex flex-col justify-end p-6 group">
                          {/* Full-bleed photo with cross-fade and smooth scale */}
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={activeCategory.slug}
                              src={activeCategory.image}
                              alt={activeCategory.name}
                              initial={{ opacity: 0, scale: 1.08 }}
                              animate={{ opacity: 1, scale: 1.02 }}
                              exit={{ opacity: 0, scale: 1 }}
                              transition={{ duration: 0.35, ease: "easeOut" }}
                              className="absolute inset-0 h-full w-full object-cover"
                              style={{ filter: "brightness(0.85) contrast(1.05)" }}
                            />
                          </AnimatePresence>

                          {/* Floating Export Grade Badge */}
                          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full border border-[#C9973F]/50 bg-[#071A33]/85 px-3 py-1 text-[11px] font-semibold text-[#F2C86E] backdrop-blur-md shadow-sm">
                            <ShieldCheck className="h-3.5 w-3.5 text-[#F2C86E]" />
                            Export Grade
                          </div>

                          {/* Bottom gradient overlay only */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,14,31,0.96)] via-[rgba(4,14,31,0.6)] to-transparent pointer-events-none" />

                          {/* Card Content */}
                          <div className="relative z-10">
                            <span className="text-[10px] uppercase tracking-[0.25em] text-[#F2C86E] font-sans font-semibold">
                              FEATURED CATEGORY
                            </span>
                            <h3 className="mt-1 font-display text-3xl font-normal text-white leading-tight">
                              {activeCategory.name}
                            </h3>
                            <p className="mt-2 text-xs text-[#D9DDE3] line-clamp-2 leading-relaxed">
                              {activeCategory.blurb}
                            </p>

                            {/* 3 Spec Chips */}
                            <div className="mt-3.5 flex flex-wrap gap-2 text-[11px] font-sans">
                              <span className="rounded-lg bg-[#071A33]/80 border border-[#C9973F]/35 px-2.5 py-1 text-[#F4F1EA] backdrop-blur-sm">
                                {activeMeta.origin}
                              </span>
                              <span className="rounded-lg bg-[#071A33]/80 border border-[#C9973F]/35 px-2.5 py-1 text-[#F4F1EA] backdrop-blur-sm">
                                {activeMeta.moq}
                              </span>
                              <span className="rounded-lg bg-[#071A33]/80 border border-[#C9973F]/35 px-2.5 py-1 text-[#F4F1EA] backdrop-blur-sm">
                                {activeMeta.cert}
                              </span>
                            </div>

                            {/* Gold Gradient Action Button */}
                            <Link
                              to="/products/$category"
                              params={{ category: activeCategory.slug }}
                              className={cn(
                                btn.gold,
                                "mt-5 !w-full justify-center !py-2.5 text-sm !font-semibold shadow-lg"
                              )}
                            >
                              Explore {activeCategory.name} <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Slim Footer Row inside the panel */}
                    <div className="border-t border-[#C9973F]/20 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 bg-[#040E1F]/70 rounded-b-[24px]">
                      <div className="flex items-center gap-2 text-xs text-[#D9DDE3]">
                        <span className="text-[#A8B2C1]">Can&apos;t find a product?</span>
                        <Link
                          to="/contact"
                          className="text-[#F2C86E] hover:underline font-medium"
                        >
                          Tell us what you need &rarr;
                        </Link>
                      </div>
                      <div className="flex items-center gap-3">
                        <a
                          href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
                            "Hello Aurelian International, I would like to inquire about your export commodities."
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-[#25D366] hover:text-[#3ce27d] transition-colors font-medium px-3 py-1.5 rounded-full border border-[#25D366]/30 hover:border-[#25D366]/60 bg-[#071A33]"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          WhatsApp Trade Desk
                        </a>
                        <Link
                          to="/contact"
                          className={cn(
                            btn.gold,
                            "!px-4 !py-1.5 text-xs !font-semibold shadow-sm"
                          )}
                        >
                          Request a Quote
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Standard Navigation Links */}
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={navLinkCls}
              activeProps={{ className: "!text-[#F2C86E] font-semibold" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {/* Enquiry Basket Trigger */}
          <button
            onClick={openBasket}
            aria-label={`Open enquiry basket (${items.length} items)`}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white hover:border-[#C9973F] hover:bg-white/10 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <ShoppingBag className="h-4 w-4" />
            {items.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-r from-[#9A6B1F] to-[#F2C86E] text-[0.65rem] font-bold text-[#071A33] shadow-md">
                {items.length}
              </span>
            )}
          </button>

          <Link
            to="/contact"
            className={cn(
              btn.gold,
              "hidden !px-5 !py-2.5 sm:inline-flex shadow-sm"
            )}
          >
            Request a Quote
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-full text-white hover:text-[#F2C86E] lg:hidden transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Full-Screen Navy with Category Accordion) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed inset-0 z-50 flex h-dvh flex-col overflow-y-auto bg-[#040E1F] px-6 pb-10"
          >
            {/* Mobile Header */}
            <div className="flex h-20 items-center justify-between border-b border-white/10 shrink-0">
              <Logo size="sm" />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-white hover:text-[#F2C86E] transition-colors p-2"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Main Links */}
            <div className="mt-6 flex flex-col gap-4">
              {[
                { to: "/", label: "Home" },
                { to: "/products", label: "Products" },
                ...links,
                { to: "/contact", label: "Contact" },
              ].map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.03 }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="font-display text-2xl text-[#F4F1EA] hover:text-[#F2C86E] transition-colors block py-1"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Categories Accordion with Rich Thumbnails & 48px Touch Targets */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="eyebrow !text-[0.65rem] !text-[#F2C86E] mb-3">
                Export Categories
              </p>
              <div className="space-y-3">
                {categories.map((c) => {
                  const isExpanded = expandedMobileCategory === c.slug;
                  return (
                    <div
                      key={c.slug}
                      className="rounded-2xl border border-[#C9973F]/25 bg-[#071A33]/70 overflow-hidden"
                    >
                      {/* Accordion Header (48px min touch target) */}
                      <button
                        onClick={() =>
                          setExpandedMobileCategory(isExpanded ? null : c.slug)
                        }
                        className="w-full flex items-center justify-between p-3.5 min-h-[48px] text-left cursor-pointer focus:outline-none"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={c.image}
                            alt={c.name}
                            className="h-9 w-9 rounded-full object-cover ring-1 ring-[#C9973F]/50 shrink-0"
                          />
                          <div>
                            <span className="font-display text-base text-white font-medium block">
                              {c.name}
                            </span>
                            <span className="text-[11px] text-[#A8B2C1] font-sans">
                              {c.products.length} products
                            </span>
                          </div>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-[#F2C86E] transition-transform duration-200",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </button>

                      {/* Accordion Content with Featured Banner & Products */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: "easeOut" }}
                            className="overflow-hidden border-t border-[#C9973F]/15"
                          >
                            {/* Category Banner */}
                            <div className="relative h-24 w-full overflow-hidden">
                              <img
                                src={c.image}
                                alt={c.name}
                                className="h-full w-full object-cover"
                                style={{ filter: "brightness(0.85)" }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#071A33] via-[#071A33]/40 to-transparent" />
                              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                                <span className="text-xs text-white font-medium drop-shadow">
                                  {c.headline}
                                </span>
                                <Link
                                  to="/products/$category"
                                  params={{ category: c.slug }}
                                  onClick={() => setOpen(false)}
                                  className="text-xs font-semibold text-[#F2C86E] bg-[#040E1F]/80 px-2.5 py-1 rounded-full border border-[#C9973F]/40"
                                >
                                  View All &rarr;
                                </Link>
                              </div>
                            </div>

                            {/* Products with Thumbnails & 48px touch targets */}
                            <div className="p-2.5 space-y-1">
                              {c.products.map((p) => (
                                <Link
                                  key={p.slug}
                                  to="/products/$category/$product"
                                  params={{
                                    category: c.slug,
                                    product: p.slug,
                                  }}
                                  onClick={() => setOpen(false)}
                                  className="flex items-center gap-3 p-2 min-h-[48px] rounded-xl hover:bg-[#0E2A4F] text-sm text-[#D9DDE3] hover:text-[#F2C86E] transition-colors"
                                >
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="h-8 w-8 rounded-lg object-cover ring-1 ring-[#C9973F]/40 shrink-0"
                                  />
                                  <span className="line-clamp-1 flex-1 text-xs">
                                    {p.name}
                                  </span>
                                  <ArrowRight className="h-3.5 w-3.5 text-[#F2C86E] shrink-0" />
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Footer CTAs */}
            <div className="mt-auto pt-6 flex flex-col gap-3 shrink-0">
              <button
                onClick={() => {
                  setOpen(false);
                  openBasket();
                }}
                className={cn(
                  btn.outlineLight,
                  "w-full justify-center !py-3 min-h-[48px]"
                )}
              >
                <ShoppingBag className="h-4 w-4" /> View Enquiry Basket ({items.length})
              </button>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className={cn(
                  btn.gold,
                  "w-full justify-center !py-3 min-h-[48px]"
                )}
              >
                Request a Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
