import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/primitives";
import { getCategory } from "@/data/products";
import { site } from "@/data/site";

export const Route = createFileRoute("/products/$category/")({
  loader: ({ params }) => {
    const category = getCategory(params.category);
    if (!category) throw notFound();
    return { slug: category.slug };
  },
  head: ({ loaderData }) => {
    const c = loaderData ? getCategory(loaderData.slug) : undefined;
    const title = c ? `${c.name} Exporter from India — ${site.name}` : "Category unavailable";
    return {
      meta: [
        { title },
        { name: "description", content: c?.blurb ?? "" },
        { property: "og:title", content: title },
        { property: "og:description", content: c?.blurb ?? "" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(c ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useLoaderData();
  const c = getCategory(slug)!;

  return (
    <>
      <PageHeader
        eyebrow={`${c.products.length} Products Available`}
        title={c.name}
        text={c.blurb}
        image={c.image}
        crumbs={[{ label: "Products", to: "/products" }, { label: c.name }]}
      />
      <section className="py-16 md:py-24 bg-ivory">
        <div className="container-x">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {c.products.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05} className="h-full">
                <ProductCard product={p} category={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
