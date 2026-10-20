import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Globe,
  Loader2,
  MessageCircle,
  Package,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { ProductPicker, type SelectedProductItem } from "./ProductPicker";
import { allProducts } from "@/data/products";
import { site } from "@/data/site";
import { useBasket } from "@/lib/basket";
import { submitEnquiry } from "@/lib/enquiry";
import { cn } from "@/lib/utils";

// Top international trading destinations with emojis
const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "IN", name: "India", flag: "🇮🇳" },
];

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  email: z.string().trim().email("Enter a valid trade email").max(255),
  phone: z.string().trim().min(6, "Enter a valid phone with country code").max(30),
  company: z.string().trim().min(1, "Company / trading name required").max(120),
  country: z.string().trim().min(1, "Select destination country").max(60),
  quantity: z.string().trim().max(60).optional(),
  unit: z.enum(["MT", "FCL", "kg"]).default("MT"),
  message: z.string().trim().max(1500).optional(),
});

type Values = z.infer<typeof schema>;

export function EnquiryForm() {
  const { items, clear, add, remove } = useBasket();
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [submittedEmail, setSubmittedEmail] = useState<string>("");
  const [formLoadedAt] = useState<number>(() => Date.now());

  // Selected products for the interactive ProductPicker
  const [selectedProducts, setSelectedProducts] = useState<SelectedProductItem[]>([]);

  // Sync URL ?product= param into basket if arriving directly from external product link
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const prodParam = sp.get("product") || sp.get("item");
      if (prodParam) {
        const match = allProducts.find(
          (p) =>
            p.name.toLowerCase() === prodParam.toLowerCase() ||
            p.slug.toLowerCase() === prodParam.toLowerCase()
        );
        if (match) {
          add({
            key: match.slug,
            name: match.name,
            category: match.category,
            origin: match.specs?.origin || match.origin || "India",
            image: match.image,
          });
        }
      }
    }
  }, []);

  // Sync basket items into selected products whenever basket items update
  useEffect(() => {
    if (items.length > 0) {
      const synced: SelectedProductItem[] = items.map((i) => {
        const fullProd = allProducts.find((p) => p.name === i.name || p.slug === i.key);
        return {
          slug: fullProd?.slug || i.key || i.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          name: i.name,
          category: i.category,
          image: i.image,
          origin: fullProd?.origin,
          grade: fullProd?.grade,
          moq: fullProd?.moq,
        };
      });
      setSelectedProducts(synced);
    }
  }, [items]);

  // Synchronize ProductPicker changes back to the basket
  const handleProductChange = (newSelected: SelectedProductItem[]) => {
    setSelectedProducts(newSelected);
    if (errors.products) {
      setErrors((prev) => ({ ...prev, products: undefined }));
    }

    // Keep basket in sync
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
  };

  // Unit toggle state for Quantity / MOQ
  const [unit, setUnit] = useState<"MT" | "FCL" | "kg">("MT");
  const [quantityValue, setQuantityValue] = useState("");

  // Searchable Country Dropdown state
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<{ code: string; name: string; flag: string } | null>(
    null
  );
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);

  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [countrySearch]);

  // Close country dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Form Submission
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "loading") return;

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData) as Record<string, string>;

    data["country"] = selectedCountry ? selectedCountry.name : (data["country"] || "");
    data["unit"] = unit;

    const r = schema.safeParse(data);
    const newErrors: Record<string, string | undefined> = {};

    if (!r.success) {
      r.error.issues.forEach((i) => {
        newErrors[i.path[0] as string] = i.message;
      });
    }

    // Require at least one product selected
    if (selectedProducts.length === 0) {
      newErrors.products = "Please select at least one export product from the catalog";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setState("loading");

    try {
      const fullName = `${data["firstName"] || ""} ${data["lastName"] || ""}`.trim() || data["name"] || "";
      const email = (data["email"] || "").trim();
      const company = (data["company"] || "").trim();
      const phone = (data["phone"] || "").trim();
      const country = selectedCountry ? selectedCountry.name : (data["country"] || "").trim();
      const product = selectedProducts.map((p) => p.name).join(", ");
      const quantity = data["quantity"]?.trim() ? `${data["quantity"].trim()} ${unit}` : "";
      const message = (data["message"] || "").trim();
      const _hp = data["_hp"] || data["_hp_company_fax"] || "";

      const res = await submitEnquiry({
        name: fullName,
        company,
        email,
        phone,
        country,
        product,
        quantity,
        message,
        _hp,
      });

      if (!res.ok) {
        setState("idle");
        setErrors({
          form: res.error || "Something went wrong. Please try again or email us at aurelianinternational@gmail.com",
        });
        return;
      }

      // Success
      setSubmittedEmail(email);
      setState("done");
      clear();
      formEl.reset();
    } catch (networkErr) {
      console.error("[Enquiry Submit Error]:", networkErr);
      setState("idle");
      setErrors({
        form: "Something went wrong. Please try again or email us at aurelianinternational@gmail.com",
      });
    }
  }

  // Pre-fill message on custom request from ProductPicker empty state
  const [customMessage, setCustomMessage] = useState("");
  const handleCustomRequest = (q: string) => {
    setCustomMessage(
      `I am interested in sourcing ${q} or a custom specification not listed in the catalog. Please advise on grade availability, MOQ and shipping timelines.`
    );
  };

  return (
    <div
      id="enquiry-form"
      className="relative overflow-hidden rounded-[28px] border border-[#C9973F]/40 bg-[#FAF8F3] p-6 md:p-10 shadow-[0_20px_50px_rgba(7,26,51,0.12)] scroll-mt-24"
    >
      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex min-h-[30rem] flex-col items-center justify-center text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 450, damping: 25, delay: 0.1 }}
              className="grid h-20 w-20 place-items-center rounded-full bg-[#C9973F]/20 text-[#C9973F]"
            >
              <CheckCircle2 className="h-12 w-12 text-[#C9973F]" strokeWidth={1.8} />
            </motion.div>
            <h3 className="mt-6 font-display text-4xl text-[#071A33]">Enquiry Transmitted</h3>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#C9973F]/40 bg-[#C9973F]/10 px-4 py-1.5 text-xs font-semibold text-[#071A33]">
              <span>Reference Number:</span>
              <span className="font-mono text-sm font-bold text-[#C9973F]">{referenceNumber}</span>
            </div>

            <p className="mt-4 max-w-md text-base text-[#071A33] font-semibold leading-relaxed">
              Thank you! Our team will contact you within 24 hours.
            </p>
            <p className="mt-1.5 max-w-md text-xs text-muted-foreground leading-relaxed">
              Your commercial export enquiry has been received. Our international export desk will review your specifications and respond with FOB/CIF pricing, lab certificates, and vessel schedules.
            </p>

            <div className="mt-6 rounded-2xl bg-white/80 p-4 border border-[#C9973F]/30 max-w-sm w-full text-left">
              <span className="eyebrow !text-[0.65rem] !text-[#C9973F]">Products Quoted</span>
              <ul className="mt-1.5 space-y-1 text-xs text-[#071A33] font-medium">
                {selectedProducts.map((p) => (
                  <li key={p.slug} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C9973F]" />
                    {p.name} ({p.category})
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedProducts([]);
                setReferenceNumber("");
                setSubmittedEmail("");
                setState("idle");
              }}
              className="mt-8 rounded-xl border border-[#071A33] px-6 py-2.5 text-xs font-semibold text-[#071A33] hover:bg-[#071A33] hover:text-white transition-all cursor-pointer"
            >
              Send another enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Anti-bot honeypot field - hidden from humans */}
            <div className="sr-only hidden" aria-hidden="true">
              <label htmlFor="_hp_company_fax">Leave blank</label>
              <input
                id="_hp_company_fax"
                type="text"
                name="_hp_company_fax"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* General form error notice if returned from server */}
            {errors.form && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-destructive font-medium">
                {errors.form}
              </div>
            )}

            <div>
              <span className="eyebrow !text-[#C9973F]">Export Inquiry Form</span>
              <h3 className="font-display text-2xl text-[#071A33]">Request Commercial Quotation</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                All commodities exported under SGS / Geo-Chem inspection with full international customs clearance.
              </p>
            </div>

            {/* PRODUCT PICKER (TASK 1 Requirement) */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-semibold tracking-wide text-[#071A33]">
                <span className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-[#C9973F]" />
                  Product Interest *
                </span>
                <span className="text-[0.7rem] font-normal text-muted-foreground">
                  Select up to 8 products
                </span>
              </label>

              <ProductPicker
                selectedProducts={selectedProducts}
                onChange={handleProductChange}
                hasError={Boolean(errors.products)}
                onCustomRequest={handleCustomRequest}
              />

              {errors.products && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.products}</p>
              )}
            </div>

            {/* Name, Company, Email, Phone 2x2 Grid with floating effect */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* First Name */}
              <div className="group space-y-1">
                <label
                  htmlFor="firstName"
                  className="block text-xs font-semibold text-[#071A33]/85"
                >
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  autoComplete="given-name"
                  placeholder="e.g. David"
                  className={cn(
                    "w-full rounded-[14px] border border-[#E3E7EE] bg-white/95 px-4 py-3 text-sm text-[#0B1B33] placeholder:text-muted-foreground/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft focus:border-[#C9973F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/25 focus:shadow-[0_0_15px_rgba(201,151,63,0.15)]",
                    errors.firstName && "border-destructive ring-1 ring-destructive/40"
                  )}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="group space-y-1">
                <label
                  htmlFor="lastName"
                  className="block text-xs font-semibold text-[#071A33]/85"
                >
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  autoComplete="family-name"
                  placeholder="e.g. Henderson"
                  className={cn(
                    "w-full rounded-[14px] border border-[#E3E7EE] bg-white/95 px-4 py-3 text-sm text-[#0B1B33] placeholder:text-muted-foreground/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft focus:border-[#C9973F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/25 focus:shadow-[0_0_15px_rgba(201,151,63,0.15)]",
                    errors.lastName && "border-destructive ring-1 ring-destructive/40"
                  )}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">{errors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div className="group space-y-1">
                <label htmlFor="email" className="block text-xs font-semibold text-[#071A33]/85">
                  Official Trade Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="trade@company.com"
                  className={cn(
                    "w-full rounded-[14px] border border-[#E3E7EE] bg-white/95 px-4 py-3 text-sm text-[#0B1B33] placeholder:text-muted-foreground/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft focus:border-[#C9973F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/25 focus:shadow-[0_0_15px_rgba(201,151,63,0.15)]",
                    errors.email && "border-destructive ring-1 ring-destructive/40"
                  )}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="group space-y-1">
                <label htmlFor="phone" className="block text-xs font-semibold text-[#071A33]/85">
                  Phone & Country Code *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1 (555) 000-0000"
                  className={cn(
                    "w-full rounded-[14px] border border-[#E3E7EE] bg-white/95 px-4 py-3 text-sm text-[#0B1B33] placeholder:text-muted-foreground/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft focus:border-[#C9973F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/25 focus:shadow-[0_0_15px_rgba(201,151,63,0.15)]",
                    errors.phone && "border-destructive ring-1 ring-destructive/40"
                  )}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              {/* Company */}
              <div className="group space-y-1">
                <label
                  htmlFor="company"
                  className="block text-xs font-semibold text-[#071A33]/85"
                >
                  Importing Company *
                </label>
                <input
                  id="company"
                  name="company"
                  autoComplete="organization"
                  placeholder="e.g. Henderson Commodities LLC"
                  className={cn(
                    "w-full rounded-[14px] border border-[#E3E7EE] bg-white/95 px-4 py-3 text-sm text-[#0B1B33] placeholder:text-muted-foreground/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft focus:border-[#C9973F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/25 focus:shadow-[0_0_15px_rgba(201,151,63,0.15)]",
                    errors.company && "border-destructive ring-1 ring-destructive/40"
                  )}
                />
                {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
              </div>

              {/* Searchable Country Select with Flags (TASK 1 Requirement) */}
              <div ref={countryRef} className="relative group space-y-1">
                <label className="block text-xs font-semibold text-[#071A33]/85">
                  Destination Country *
                </label>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setCountryOpen(!countryOpen)}
                  className={cn(
                    "relative flex w-full cursor-pointer items-center justify-between rounded-[14px] border bg-white/95 px-4 py-3 text-sm text-[#0B1B33] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft",
                    countryOpen
                      ? "border-[#C9973F] ring-2 ring-[#C9973F]/25 shadow-[0_0_15px_rgba(201,151,63,0.15)]"
                      : "border-[#E3E7EE]",
                    errors.country && "border-destructive ring-1 ring-destructive/40"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    {selectedCountry ? (
                      <>
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span className="font-medium text-[#071A33]">{selectedCountry.name}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground/60 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-[#C9973F]" /> Select destination country...
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-[#C9973F] transition-transform duration-200",
                      countryOpen && "rotate-180"
                    )}
                  />
                </div>

                <input
                  type="hidden"
                  name="country"
                  value={selectedCountry ? selectedCountry.name : ""}
                />

                {/* Country Dropdown Panel */}
                <AnimatePresence>
                  {countryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 right-0 top-full z-40 mt-1.5 rounded-[16px] border border-[#C9973F]/35 bg-[#FAF8F3] p-2.5 shadow-xl backdrop-blur-md"
                    >
                      <div className="relative mb-2">
                        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          placeholder="Search countries..."
                          className="w-full rounded-lg border border-[#E3E7EE] bg-white py-1.5 pl-8 pr-3 text-xs focus:border-[#C9973F] focus:outline-none"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-44 overflow-y-auto space-y-0.5 thin-scrollbar">
                        {filteredCountries.map((c) => (
                          <div
                            key={c.code}
                            onClick={() => {
                              setSelectedCountry(c);
                              setCountryOpen(false);
                              setCountrySearch("");
                              if (errors.country) {
                                setErrors((prev) => ({ ...prev, country: undefined }));
                              }
                            }}
                            className={cn(
                              "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-[#071A33] hover:bg-[#C9973F]/15 transition-colors",
                              selectedCountry?.code === c.code && "bg-[#C9973F]/20 font-semibold"
                            )}
                          >
                            <span className="text-base">{c.flag}</span>
                            <span>{c.name}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
              </div>
            </div>

            {/* Quantity / MOQ with Unit Toggle (MT / FCL / kg) (TASK 1 Requirement) */}
            <div className="space-y-1">
              <label
                htmlFor="quantity"
                className="block text-xs font-semibold text-[#071A33]/85"
              >
                Quantity / Order Volume (MOQ)
              </label>
              <div className="flex rounded-[14px] border border-[#E3E7EE] bg-white/95 overflow-hidden transition-all hover:border-[#C9973F]/60 focus-within:border-[#C9973F] focus-within:ring-2 focus-within:ring-[#C9973F]/25 focus-within:shadow-[0_0_15px_rgba(201,151,63,0.15)]">
                <input
                  id="quantity"
                  name="quantity"
                  value={quantityValue}
                  onChange={(e) => setQuantityValue(e.target.value)}
                  placeholder="e.g. 50"
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-[#0B1B33] placeholder:text-muted-foreground/60 focus:outline-none"
                />
                {/* Unit Toggle Buttons */}
                <div className="flex items-center gap-1 bg-[#EEF1F5] p-1.5 my-1.5 mr-2 rounded-xl text-xs font-semibold">
                  {(["MT", "FCL", "kg"] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={cn(
                        "rounded-lg px-2.5 py-1 transition-all",
                        unit === u
                          ? "bg-[#071A33] text-gold-soft shadow-sm"
                          : "text-muted-foreground hover:text-[#071A33]"
                      )}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <input type="hidden" name="unit" value={unit} />
            </div>

            {/* Message Box */}
            <div className="space-y-1">
              <label htmlFor="message" className="block text-xs font-semibold text-[#071A33]/85">
                Specification Details & Shipping Notes
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Target destination port (e.g. Jebel Ali, Rotterdam, Felixstowe), packaging preferences (25kg bags, bulk, pallets), target shipment window..."
                className="w-full rounded-[14px] border border-[#E3E7EE] bg-white/95 px-4 py-3 text-sm text-[#0B1B33] placeholder:text-muted-foreground/60 transition-all hover:-translate-y-0.5 hover:shadow-soft focus:border-[#C9973F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/25 focus:shadow-[0_0_15px_rgba(201,151,63,0.15)]"
              />
            </div>

            {/* Action Buttons: Submit with Shine Sweep + Instant WhatsApp */}
            <div className="pt-2 grid gap-3 sm:grid-cols-2">
              {/* Premium Gold Shine Submit Button */}
              <button
                type="submit"
                disabled={state === "loading"}
                className="relative overflow-hidden rounded-[14px] bg-gradient-to-r from-[#D4A54E] via-[#C9973F] to-[#9B6F28] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(201,151,63,0.38)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(201,151,63,0.5)] hover:-translate-y-0.5 disabled:opacity-75 before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-700 cursor-pointer"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {state === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" /> Transmitting Request...
                    </>
                  ) : (
                    <>
                      <span>Send Commercial Enquiry</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </div>
              </button>

              {/* Instant WhatsApp Trade Desk Button */}
              <a
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
                  `Hello Aurelian International trade desk, I would like to request an export quote for: ${
                    selectedProducts.length > 0
                      ? selectedProducts.map((p) => p.name).join(", ")
                      : "General Indian produce & stones"
                  }.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-[#071A33]/20 bg-[#071A33] px-6 py-3.5 text-sm font-semibold text-gold-soft shadow-[0_4px_16px_rgba(7,26,51,0.18)] transition-all duration-200 hover:bg-[#0E2A4F] hover:text-white hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4 text-gold-soft" /> Instant WhatsApp Desk
              </a>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
