import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  MessageCircle,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { site } from "@/data/site";
import { useBasket } from "@/lib/basket";
import { useScrollLock } from "@/lib/scroll-lock";
import { ProductPicker } from "./ProductPicker";
import { btn } from "./primitives";
import { cn } from "@/lib/utils";

export function BasketDrawer() {
  const { items, add, remove, clear, isOpen, closeBasket } = useBasket();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [openTimestamp, setOpenTimestamp] = useState<number>(Date.now());
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    destinationPort: "",
    notes: "",
  });

  // Track open timestamp for anti-spam check
  useEffect(() => {
    if (isOpen) {
      setOpenTimestamp(Date.now());
    }
  }, [isOpen]);

  // Use centralized reference-counted scroll lock
  useScrollLock(isOpen);

  // Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBasket();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeBasket]);

  const waProducts = items.map((i) => `• ${i.name} (${i.category})`).join("%0A");
  const waUrl = `https://wa.me/${site.whatsapp}?text=Hello%20Aurelian%20International,%20I%20would%20like%20to%20request%20an%20export%20quotation%20for%20the%20following%20products:%0A${waProducts}%0A%0AMy%20Company:%20${encodeURIComponent(formData.company || "Importer")}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (!formData.name.trim() || !formData.email.trim() || !formData.company.trim()) {
      toast.error("Please fill in your name, company and email.");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one product to the quote basket.");
      return;
    }

    setLoading(true);

    try {
      const nameParts = formData.name.trim().split(/\s+/);
      const firstName = nameParts[0] || "Client";
      const lastName = nameParts.slice(1).join(" ") || "—";

      const payload = {
        firstName,
        lastName,
        email: formData.email.trim(),
        phone: formData.phone.trim() || "+00 0000000000",
        company: formData.company.trim(),
        country: formData.destinationPort.trim() || "International",
        quantity: "",
        unit: "MT",
        notes: formData.notes.trim() || undefined,
        products: items.slice(0, 8).map((i) => ({
          name: i.name,
          category: i.category,
          slug: i.key,
          origin: i.origin || "India",
        })),
        sourcePage: typeof window !== "undefined" ? `${window.location.pathname} (Quote Basket)` : "/basket",
        formLoadedAt: openTimestamp,
      };

      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        setLoading(false);
        const errMessage = json?.errors
          ? Object.values(json.errors)[0]
          : json?.error || "Submission failed. Please check your inputs.";
        toast.error(String(errMessage));
        return;
      }

      setRefNumber(json.reference || "AV-PROCESSED");
      setLoading(false);
      setDone(true);
      toast.success(`Quote request ${json.reference} dispatched successfully!`);
      clear();
    } catch (err) {
      console.error("[Basket Quote Error]:", err);
      setLoading(false);
      toast.error("Network error submitting quote. Please connect via WhatsApp.");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 overflow-hidden"
        >
          {/* Backdrop */}
          <div
            onClick={closeBasket}
            className="absolute inset-0 bg-[#040E1F]/75 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-screen max-w-md border-l border-[#C9973F]/35 bg-[#FAF8F3] shadow-2xl flex flex-col pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b hairline px-6 py-5 bg-[#EEF1F5]/60">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[#071A33] text-[#F2C86E] shadow-sm">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl text-[#071A33]">Enquiry Basket</h2>
                    <p className="text-xs text-muted-foreground">
                      {items.length} {items.length === 1 ? "product" : "products"} selected for
                      quote
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeBasket}
                  aria-label="Close basket"
                  className="rounded-full p-2 text-[#0B1B33]/70 hover:bg-black/5 hover:text-[#0B1B33] transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {done ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="grid h-20 w-20 place-items-center rounded-full bg-[#C9973F]/20 text-[#C9973F]">
                      <CheckCircle2 className="h-12 w-12 text-[#C9973F]" strokeWidth={1.5} />
                    </div>
                    <h3 className="mt-6 font-display text-3xl text-[#071A33]">
                      Quotation Requested
                    </h3>
                    {refNumber && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#C9973F]/40 bg-[#C9973F]/10 px-3.5 py-1 text-xs font-semibold text-[#071A33]">
                        <span>Reference:</span>
                        <span className="font-mono text-sm font-bold text-[#C9973F]">{refNumber}</span>
                      </div>
                    )}
                    <p className="mt-3 text-sm text-muted-foreground max-w-xs">
                      Our international trade desk has received your request. A confirmation email has been dispatched to {formData.email}. We will prepare freight and FOB/CIF pricing within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setDone(false);
                        closeBasket();
                      }}
                      className={cn(btn.navy, "mt-8")}
                    >
                      Continue Browsing
                    </button>
                  </motion.div>
                ) : items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-[#EEF1F5] text-muted-foreground/60">
                      <ShoppingBag className="h-8 w-8 stroke-1 text-[#C9973F]" />
                    </div>
                    <h3 className="mt-5 font-display text-2xl text-[#071A33]">
                      Your basket is empty
                    </h3>
                    <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                      Browse our export catalogue and click "+ Enquire" to add multiple items to a
                      single quotation request.
                    </p>
                    <button onClick={closeBasket} className={cn(btn.gold, "mt-6")}>
                      Explore Catalogue
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Item list */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="eyebrow !text-[0.65rem] !text-[#C9973F]">
                          Selected Products
                        </span>
                        <button
                          onClick={clear}
                          className="text-xs text-destructive hover:underline cursor-pointer"
                        >
                          Clear all
                        </button>
                      </div>
                      {/* Interactive ProductPicker to add/manage quote items */}
                      <div className="space-y-1.5 pb-2">
                        <label className="text-xs font-semibold text-[#071A33]">
                          Add or adjust products
                        </label>
                        <ProductPicker
                          selectedProducts={items.map((i) => ({
                            slug: i.key,
                            name: i.name,
                            category: i.category,
                            image: i.image,
                            origin: i.origin,
                          }))}
                          onChange={(newSelected) => {
                            // Sync with basket
                            items.forEach((item) => {
                              if (!newSelected.some((p) => p.name === item.name)) {
                                remove(item.key);
                              }
                            });
                            newSelected.forEach((item) => {
                              if (!items.some((b) => b.name === item.name)) {
                                add({
                                  key: item.slug,
                                  name: item.name,
                                  category: item.category,
                                  origin: item.origin || "India",
                                  image: item.image,
                                });
                              }
                            });
                          }}
                          placeholder="+ Add products to quote..."
                        />
                      </div>
                    </div>

                    {/* Consolidated Quote Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                      <p className="eyebrow !text-[0.65rem] !text-[#C9973F]">
                        Direct Export Quotation
                      </p>
                      <div>
                        <label className="block text-xs font-medium text-[#0B1B33]/80">
                          Your Name *
                        </label>
                        <input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. David Henderson"
                          className="mt-1 w-full rounded-xl border border-[#E3E7EE] bg-white px-3.5 py-2.5 text-sm focus:border-[#C9973F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/25"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[#0B1B33]/80">
                            Company *
                          </label>
                          <input
                            required
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            placeholder="e.g. Henderson Foods Ltd"
                            className="mt-1 w-full rounded-xl border border-[#E3E7EE] bg-white px-3.5 py-2.5 text-sm focus:border-[#C9973F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/25"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#0B1B33]/80">
                            Email *
                          </label>
                          <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="trade@company.com"
                            className="mt-1 w-full rounded-xl border border-[#E3E7EE] bg-white px-3.5 py-2.5 text-sm focus:border-[#C9973F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/25"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[#0B1B33]/80">
                            Phone / WhatsApp
                          </label>
                          <input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+44 7911 123456"
                            className="mt-1 w-full rounded-xl border border-[#E3E7EE] bg-white px-3.5 py-2.5 text-sm focus:border-[#C9973F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/25"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#0B1B33]/80">
                            Destination Port
                          </label>
                          <input
                            value={formData.destinationPort}
                            onChange={(e) =>
                              setFormData({ ...formData, destinationPort: e.target.value })
                            }
                            placeholder="e.g. Felixstowe, Jebel Ali"
                            className="mt-1 w-full rounded-xl border border-[#E3E7EE] bg-white px-3.5 py-2.5 text-sm focus:border-[#C9973F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/25"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#0B1B33]/80">
                          Specific Quantities or Grade Notes
                        </label>
                        <textarea
                          rows={2}
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="e.g. 2 x 20ft FCL Basmati Rice + 5 MT Spices"
                          className="mt-1 w-full rounded-xl border border-[#E3E7EE] bg-white px-3.5 py-2.5 text-sm focus:border-[#C9973F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/25"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className={cn(btn.gold, "w-full justify-center mt-2")}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Processing Request...
                          </>
                        ) : (
                          <>
                            Send Consolidated Quote Request <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#25D366] bg-white py-2.5 text-xs font-medium text-[#071A33] hover:bg-[#25D366]/10 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4 text-[#25D366]" /> Quick Quote via
                        WhatsApp
                      </a>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
