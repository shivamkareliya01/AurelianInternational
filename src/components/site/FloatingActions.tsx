import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { Logo } from "./Logo";
import { btn } from "./primitives";

export function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <>
      <div className="fixed bottom-24 right-5 z-40 flex flex-col items-end gap-3 md:bottom-6">
        <AnimatePresence>
          {show && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="grid h-11 w-11 place-items-center rounded-full border hairline bg-ivory text-forest shadow-soft"
            >
              <ArrowUp className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
        <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="grid h-14 w-14 place-items-center rounded-full bg-forest text-gold-soft shadow-lift ring-1 ring-gold/40 transition-transform hover:scale-105">
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>
      <div className="glass-light fixed inset-x-0 bottom-0 z-30 border-t hairline p-3 md:hidden">
        <Link to="/contact" className={`${btn.gold} w-full`}>Request a Quote</Link>
      </div>
    </>
  );
}

export function PageLoader() {
  const [done, setDone] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDone(true), 900); return () => clearTimeout(t); }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="fixed inset-0 z-[100] grid place-items-center bg-ivory">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Logo />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
