import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { btn } from "./primitives";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [formInView, setFormInView] = useState(false);
  const location = useLocation();

  // Hide sticky quote button on pages that are dedicated to quoting
  const isDedicatedQuotePage =
    location.pathname.startsWith("/contact") ||
    location.pathname.startsWith("/enquiry");

  useEffect(() => {
    const handleScroll = () => {
      // Hide the back-to-top button until user scrolls 400px
      setShowTop(window.scrollY > 400);

      // Auto-detect if an enquiry form is currently in the viewport
      const formEl = document.getElementById("enquiry-form") || document.getElementById("quote");
      if (formEl) {
        const rect = formEl.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 60;
        setFormInView(inView);
      } else {
        setFormInView(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const shouldShowStickyQuote = !isDedicatedQuotePage && !formInView;

  return (
    <>
      {/* Floating Buttons: neatly aligned with compact mobile footprint so they never block inputs or overlap */}
      <div
        className={cn(
          "fixed right-3.5 sm:right-6 md:right-8 z-40 flex flex-col items-center gap-3 transition-all duration-300",
          shouldShowStickyQuote
            ? "bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] md:bottom-8"
            : "bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 md:bottom-8"
        )}
      >
        <AnimatePresence>
          {showTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-[#071A33]/92 backdrop-blur-md text-[#F2C86E] shadow-xl hover:bg-[#0E2A4F] hover:text-gold hover:border-gold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* WhatsApp floating button: streamlined on mobile screens to preserve viewport ergonomics */}
        <a
          href={`https://wa.me/${site.whatsapp}?text=Hello%20Aurelian%20International,%20I%20would%20like%20to%20enquire%20about%20importing%20products.`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="grid h-12 w-12 sm:h-13 sm:w-13 md:h-14 md:w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl ring-3 sm:ring-4 ring-[#071A33] transition-transform hover:scale-105 hover:ring-[#C9973F] focus:outline-none focus:ring-[#C9973F]"
        >
          <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
        </a>
      </div>

      {/* Mobile Sticky Quote Bar: Only shown while browsing general pages, hides automatically on quotation form */}
      <AnimatePresence>
        {shouldShowStickyQuote && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed left-0 right-0 bottom-0 z-30 w-full max-w-full border-t border-gold/30 bg-[#071A33]/95 backdrop-blur-md px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden shadow-[0_-8px_24px_rgba(0,0,0,0.45)]"
          >
            <Link to="/contact" className={cn(btn.gold, "w-full max-w-full min-h-[44px] justify-center shadow-lg py-2.5 text-sm")}>
              Request a Quote
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function PageLoader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#040E1F]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: [0.96, 1.04, 1],
              filter: [
                "drop-shadow(0 0 10px rgba(242,200,110,0.25))",
                "drop-shadow(0 0 28px rgba(242,200,110,0.7))",
                "drop-shadow(0 0 14px rgba(242,200,110,0.4))",
              ],
            }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="relative flex items-center justify-center p-6"
          >
            <img
              src="/brand/aurelian-symbol-transparent.png"
              alt="Aurelian"
              style={{ background: "transparent" }}
              className="h-16 w-auto object-contain md:h-20 select-none"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
