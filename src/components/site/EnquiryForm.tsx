import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { categories } from "@/data/products";
import { useBasket } from "@/lib/basket";
import { cn } from "@/lib/utils";
import { btn } from "./primitives";

const schema = z.object({
  firstName: z.string().trim().min(1, "Required").max(60),
  lastName: z.string().trim().min(1, "Required").max(60),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(6, "Enter a valid phone").max(30),
  company: z.string().trim().min(1, "Required").max(120),
  country: z.string().trim().min(1, "Required").max(60),
  product: z.string().min(1, "Choose a product"),
  quantity: z.string().trim().max(60).optional(),
  message: z.string().trim().max(1500).optional(),
});
type Values = z.infer<typeof schema>;

const field = "w-full rounded-xl border border-input bg-card/70 px-4 py-3 text-sm text-ink placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25";

export function EnquiryForm() {
  const { items, remove, clear } = useBasket();
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (items.length && !data.product) data.product = "Enquiry basket";
    const r = schema.safeParse(data);
    if (!r.success) {
      const errs: typeof errors = {};
      r.error.issues.forEach((i) => (errs[i.path[0] as keyof Values] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setState("loading");
    // TODO: persist to Lovable Cloud + email notification
    await new Promise((res) => setTimeout(res, 1200));
    setState("done");
    clear();
  }

  const F = ({ name, label, ...rest }: { name: keyof Values; label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-xs font-medium tracking-wide text-ink/70">{label}</label>
      <input id={name} name={name} className={cn(field, errors[name] && "border-destructive")} {...rest} />
      {errors[name] && <p className="mt-1 text-xs text-destructive">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="glass-light relative overflow-hidden rounded-3xl border hairline p-6 shadow-lift md:p-10">
      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-[28rem] flex-col items-center justify-center text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}>
              <CheckCircle2 className="h-16 w-16 text-gold" strokeWidth={1.2} />
            </motion.div>
            <h3 className="mt-6 text-4xl text-forest">Enquiry received</h3>
            <p className="mt-3 max-w-sm text-muted-foreground">Our trade desk will reply within one business day with pricing and availability.</p>
            <button onClick={() => setState("idle")} className={cn(btn.outline, "mt-8")}>Send another</button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-5 md:grid-cols-2">
            {F({ name: "firstName", label: "First name", autoComplete: "given-name" })}
            {F({ name: "lastName", label: "Last name", autoComplete: "family-name" })}
            {F({ name: "email", label: "Email", type: "email", autoComplete: "email" })}
            {F({ name: "phone", label: "Phone", type: "tel", autoComplete: "tel" })}
            {F({ name: "company", label: "Company", autoComplete: "organization" })}
            {F({ name: "country", label: "Country", autoComplete: "country-name" })}
            <div>
              <label htmlFor="product" className="mb-1.5 block text-xs font-medium tracking-wide text-ink/70">Product interest</label>
              <select id="product" name="product" defaultValue="" className={cn(field, errors.product && "border-destructive")}>
                <option value="">{items.length ? "From enquiry basket" : "Select a product"}</option>
                {categories.map((c) => (
                  <optgroup key={c.slug} label={c.name}>
                    {c.products.map((p) => <option key={p.slug} value={p.name}>{p.name}</option>)}
                  </optgroup>
                ))}
              </select>
              {errors.product && <p className="mt-1 text-xs text-destructive">{errors.product}</p>}
            </div>
            {F({ name: "quantity", label: "Quantity / MOQ", placeholder: "e.g. 2 × 20ft FCL" })}
            {items.length > 0 && (
              <div className="md:col-span-2">
                <p className="mb-2 text-xs font-medium tracking-wide text-ink/70">Enquiry basket ({items.length})</p>
                <div className="flex flex-wrap gap-2">
                  {items.map((i) => (
                    <span key={i.key} className="inline-flex items-center gap-2 rounded-full border hairline bg-sand px-3 py-1.5 text-xs text-forest">
                      {i.name}
                      <button type="button" onClick={() => remove(i.key)} aria-label={`Remove ${i.name}`}><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="md:col-span-2">
              <label htmlFor="message" className="mb-1.5 block text-xs font-medium tracking-wide text-ink/70">Message</label>
              <textarea id="message" name="message" rows={4} className={field} placeholder="Destination port, packaging, timelines…" />
            </div>
            <button disabled={state === "loading"} className={cn(btn.gold, "md:col-span-2 disabled:opacity-70")}>
              {state === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Send Enquiry"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
