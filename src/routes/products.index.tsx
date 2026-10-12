import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import farm from "@/assets/farm.jpg";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { allProducts, categories } from "@/data/products";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: `Export Products Catalogue — ${site.name}` },
      { name: "description", content: "Browse rice, wheat, spices, fresh produce, dry fruits, marble, granite and PVC pipes exported from India." },
      { property: "og:title", content: `Export Products Catalogue — ${site.name}` },
      { property: "og:description", content: "Every product we export from India, with grades, origins and MOQs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Products,
});

const originGroups = ["North India", "West India", "South India", "Central India"];
const regionOf = (o: string) =>
  /Punjab|Haryana|Uttar/.test(o) ? "North India" : /Gujarat|Maharashtra|Nashik|Rajasthan|Goa|Jalgaon|Sangli|Unjha|Kutch/.test(o) ? "West India" : /Kerala|Tamil|Karnataka|Andhra|Telangana|Erode|Guntur|Idukki/.test(o) ? "South India" : "Central India";
const packTypes = ["Bags", "Cartons", "Crates & Bundles"];
const packOf = (p: string) => (/bag|jute|PP/i.test(p) ? "Bags" : /carton|tin|punnet/i.test(p) ? "Cartons" : "Crates & Bundles");

function Products() {
  const [q, setQ] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [origins, setOrigins] = useState<string[]>([]);
  const [packs, setPacks] = useState<string[]>([]);
  const [sort, setSort] = useState("featured");
  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const list = useMemo(() => {
    let l = allProducts.filter(
      (p) =>
        (!q || `${p.name} ${p.origin} ${p.category.name}`.toLowerCase().includes(q.toLowerCase())) &&
        (!cats.length || cats.includes(p.category.slug)) &&
        (!origins.length || origins.includes(regionOf(p.origin))) &&
        (!packs.length || packs.includes(packOf(p.packaging))),
    );
    if (sort === "az") l = [...l].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") l = [...l].sort((a, b) => b.name.localeCompare(a.name));
    return l;
  }, [q, cats, origins, packs, sort]);

  const Group = ({ title, opts, sel, set }: { title: string; opts: { v: string; l: string }[]; sel: string[]; set: (v: string[]) => void }) => (
    <fieldset className="border-t hairline py-6">
      <legend className="eyebrow">{title}</legend>
      <div className="mt-4 space-y-2.5">
        {opts.map((o) => (
          <label key={o.v} className="flex cursor-pointer items-center gap-3 text-sm text-ink/80">
            <input type="checkbox" checked={sel.includes(o.v)} onChange={() => toggle(sel, set, o.v)} className="h-4 w-4 accent-forest" />
            {o.l}
          </label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <>
      <PageHeader eyebrow="Catalogue" title="Our Products" text="Over fifty export-grade products across six categories, each with full specification and documentation." crumbs={[{ label: "Products" }]} image={farm} />
      <section className="section-y bg-ivory !pt-14">
        <div className="container-x grid gap-10 lg:grid-cols-[16rem_1fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Group title="Category" opts={categories.map((c) => ({ v: c.slug, l: c.name }))} sel={cats} set={setCats} />
            <Group title="Origin" opts={originGroups.map((o) => ({ v: o, l: o }))} sel={origins} set={setOrigins} />
            <Group title="Packaging" opts={packTypes.map((o) => ({ v: o, l: o }))} sel={packs} set={setPacks} />
          </aside>
          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input aria-label="Search products" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, origins…" className="w-full rounded-full border border-input bg-card py-3 pl-11 pr-4 text-sm focus:border-gold focus:outline-none" />
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">{list.length} products</span>
                <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-input bg-card px-4 py-2.5 focus:outline-none">
                  <option value="featured">Featured</option>
                  <option value="az">Name A–Z</option>
                  <option value="za">Name Z–A</option>
                </select>
              </div>
            </div>
            <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence>
                {list.map((p) => (
                  <motion.div key={`${p.category.slug}-${p.slug}`} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }}>
                    <ProductCard product={p} category={p.category} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            {!list.length && <p className={cn("mt-16 text-center text-muted-foreground")}>No products match those filters.</p>}
          </div>
        </div>
      </section>
    </>
  );
}
