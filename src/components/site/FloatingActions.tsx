import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { btn } from "./primitives";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hide the back-to-top button until user scrolls 400px
      setShowTop(window.scrollY > 400);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Floating Buttons: stacked neatly with exactly 12px gap (gap-3) in bottom right */}
      <div className="fixed bottom-20 right-5 z-40 flex flex-col items-center gap-3 md:bottom-8 md:right-8">
        <AnimatePresence>
          {showTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-[#071A33] text-[#F2C86E] shadow-xl hover:bg-[#0E2A4F] hover:text-gold hover:border-gold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* WhatsApp floating button: keep the WhatsApp green for recognition only, but with a navy ring */}
        <a
          href={`https://wa.me/${site.whatsapp}?text=Hello%20Aurelian%20International,%20I%20would%20like%20to%20enquire%20about%20importing%20products.`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl ring-4 ring-[#071A33] transition-transform hover:scale-105 hover:ring-[#C9973F] focus:outline-none focus:ring-[#C9973F]"
        >
          <MessageCircle className="h-7 w-7" />
        </a>
      </div>

      {/* Mobile Sticky Quote Bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gold/30 bg-[#071A33]/95 backdrop-blur-md p-3 md:hidden">
        <Link to="/contact" className={cn(btn.gold, "w-full justify-center shadow-lg")}>
          Request a Quote
        </Link>
      </div>
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
