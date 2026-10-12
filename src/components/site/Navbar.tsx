import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { categories } from "@/data/products";
import { useBasket } from "@/lib/basket";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { btn } from "./primitives";

const links = [
  { to: "/about", label: "About" },
  { to: "/markets", label: "Markets" },
  { to: "/certifications", label: "Certifications" },
  { to: "/blog", label: "Blog" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { items } = useBasket();
  const overHero = pathname === "/" && !scrolled;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { setOpen(false); setMega(false); }, [pathname]);

  const linkCls = cn("text-sm tracking-wide transition-colors", overHero ? "text-on-forest/85 hover:text-gold-soft" : "text-ink/75 hover:text-forest");

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-500", overHero ? "bg-transparent" : "glass-light border-b hairline shadow-soft")}>
      <nav className="container-x flex h-20 items-center justify-between gap-6">
        <Logo light={overHero} />
        <div className="hidden items-center gap-8 lg:flex">
          <Link to="/" className={linkCls}>Home</Link>
          <div className="relative" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
            <Link to="/products" className={cn(linkCls, "inline-flex items-center gap-1")}>
              Products <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            <AnimatePresence>
              {mega && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-1/2 top-full w-[52rem] -translate-x-1/2 pt-5"
                >
                  <div className="grid grid-cols-3 gap-2 rounded-2xl border hairline bg-ivory p-4 shadow-lift">
                    {categories.map((c) => (
                      <div key={c.slug} className="group rounded-xl p-3 transition-colors hover:bg-sand">
                        <Link to="/products/$category" params={{ category: c.slug }} className="flex items-center gap-3">
                          <img src={c.image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" loading="lazy" />
                          <span className="font-display text-lg leading-tight text-forest">{c.name}</span>
                        </Link>
                        <ul className="mt-2 space-y-1 pl-[3.75rem]">
                          {c.products.slice(0, 3).map((p) => (
                            <li key={p.slug}>
                              <Link to="/products/$category/$product" params={{ category: c.slug, product: p.slug }} className="text-xs text-muted-foreground hover:text-forest">
                                {p.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={linkCls} activeProps={{ className: "!text-gold" }}>{l.label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/contact" aria-label="Enquiry basket" className={cn("relative grid h-10 w-10 place-items-center rounded-full border hairline", overHero ? "text-on-forest" : "text-forest")}>
            <ShoppingBag className="h-4 w-4" />
            {items.length > 0 && <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gold text-[0.65rem] font-semibold text-forest-deep">{items.length}</span>}
          </Link>
          <Link to="/contact" className={cn(btn.gold, "hidden !px-5 !py-2.5 sm:inline-flex")}>Request a Quote</Link>
          <button onClick={() => setOpen(true)} aria-label="Open menu" className={cn("grid h-10 w-10 place-items-center lg:hidden", overHero ? "text-on-forest" : "text-forest")}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex h-dvh flex-col overflow-y-auto bg-forest-deep px-6 pb-10"
          >
            <div className="flex h-20 items-center justify-between">
              <Logo light />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-on-forest"><X className="h-6 w-6" /></button>
            </div>
            <div className="mt-8 flex flex-col gap-5">
              {[{ to: "/", label: "Home" }, { to: "/products", label: "Products" }, ...links, { to: "/contact", label: "Contact" }].map((l, i) => (
                <motion.div key={l.to} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                  <Link to={l.to} className="font-display text-4xl text-on-forest hover:text-gold-soft">{l.label}</Link>
                </motion.div>
              ))}
            </div>
            <Link to="/contact" className={cn(btn.gold, "mt-auto")}>Request a Quote</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
