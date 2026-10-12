import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Download, Plus } from "lucide-react";
import { useState } from "react";
import port from "@/assets/port.jpg";
import warehouse from "@/assets/warehouse.jpg";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal, btn } from "@/components/site/primitives";
import { getCategory, getProduct } from "@/data/products";
import { site } from "@/data/site";
import { useBasket } from "@/lib/basket";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$category/$product")({
  loader: ({ params }) => {
    const p = getProduct(params.category, params.product);
    if (!p) throw notFound();
    return { cat: params.category, slug: p.slug };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? getProduct(loaderData.cat, loaderData.slug) : undefined;
    const title = p ? `${p.name} Exporter — ${p.origin}, India | ${site.short}` : "Product unavailable";
    const desc = p ? `${p.description} Grade ${p.grade}. MOQ ${p.moq}.` : "";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(p ? [] : [{ name: "robots", content: "noindex" }]),
      ],
      scripts: p
        ? [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description, brand: { "@type": "Brand", name: site.name }, countryOfOrigin: "India" }) }]
        : [],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { cat, slug } = Route.useLoaderData();
  const c = getCategory(cat)!;
  const p = getProduct(cat, slug)!;
  const imgs = [c.image, warehouse, port];
  const [active, setActive] = useState(0);
  const { add, has } = useBasket();
  const key = `${c.slug}/${p.slug}`;
  const specs = [["Grade", p.grade], ["Origin", p.origin], ["Packaging", p.packaging], ["MOQ", p.moq], ["Shelf life", p.shelfLife], ["Certifications", p.certifications.join(", ")]];

  function downloadSpec() {
    const txt = `${site.name}\n${p.name} — Specification Sheet\n\n${specs.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${p.description}\n\nContact: ${site.email} · ${site.phone}`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain" }));
    a.download = `${p.slug}-spec-sheet.txt`;
    a.click();
  }

  return (
    <>
      <PageHeader eyebrow={c.name} title={p.name} crumbs={[{ label: "Products", to: "/products" }, { label: c.name, to: "/products/$category", params: { category: c.slug } }, { label: p.name }]} />
      <section className="section-y bg-ivory !pt-14">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_24rem]">
          <div>
            <div className="aspect-[16/10] overflow-hidden rounded-2xl"><img src={imgs[active]} alt={`${p.name} — image ${active + 1}`} className="h-full w-full object-cover" /></div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {imgs.map((src, i) => (
                <button key={i} onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`} className={cn("aspect-[16/10] overflow-hidden rounded-xl ring-2 transition", active === i ? "ring-gold" : "ring-transparent opacity-70 hover:opacity-100")}>
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <article className="mt-14">
              <h2 className="text-4xl text-forest">Overview</h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{p.description} Sourced directly from {p.origin} and processed to international buyer specifications, with batch-wise lab reports available on request.</p>
              <h2 className="mt-12 text-4xl text-forest">Specifications</h2>
              <table className="mt-6 w-full text-sm">
                <tbody>
                  {specs.map(([k, v]) => (
                    <tr key={k} className="border-b hairline">
                      <th scope="row" className="w-1/3 py-4 text-left font-normal text-muted-foreground">{k}</th>
                      <td className="py-4 text-ink">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={downloadSpec} className={cn(btn.outline, "mt-8")}><Download className="h-4 w-4" /> Download Spec Sheet</button>
            </article>
          </div>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border hairline bg-forest p-8 text-on-forest shadow-lift">
              <p className="eyebrow">Request Quote</p>
              <h3 className="mt-3 text-3xl">{p.name}</h3>
              <p className="mt-2 text-sm text-on-forest-muted">MOQ {p.moq} · {p.packaging}</p>
              <button onClick={() => add({ key, name: p.name, category: c.name })} className={cn(btn.outlineLight, "mt-8 w-full")}>
                {has(key) ? <><Check className="h-4 w-4" /> In enquiry basket</> : <><Plus className="h-4 w-4" /> Add to enquiry basket</>}
              </button>
              <Link to="/contact" onClick={() => add({ key, name: p.name, category: c.name })} className={cn(btn.gold, "mt-3 w-full")}>Request a Quote</Link>
              <p className="mt-6 text-xs text-on-forest-muted">Reply within one business day.</p>
            </div>
          </aside>
        </div>
      </section>
      <section className="section-y bg-sand">
        <div className="container-x">
          <h2 className="text-4xl text-forest md:text-5xl">Related products</h2>
          <div className="mt-10 flex snap-x gap-6 overflow-x-auto pb-4">
            {c.products.filter((x) => x.slug !== p.slug).map((x, i) => (
              <Reveal key={x.slug} delay={i * 0.06} className="w-72 shrink-0 snap-start"><ProductCard product={x} category={c} /></Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
