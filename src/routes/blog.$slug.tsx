import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { getPost } from "@/data/blog";
import { site } from "@/data/site";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const p = getPost(params.slug);
    if (!p) throw notFound();
    return { slug: p.slug };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? getPost(loaderData.slug) : undefined;
    const title = p ? `${p.title} — ${site.short} Journal` : "Article unavailable";
    return {
      meta: [
        { title },
        { name: "description", content: p?.excerpt ?? "" },
        { property: "og:title", content: title },
        { property: "og:description", content: p?.excerpt ?? "" },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(p ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  component: Article,
});

function Article() {
  const { slug } = Route.useLoaderData();
  const p = getPost(slug)!;
  return (
    <>
      <PageHeader eyebrow={`${p.category} · ${p.readTime}`} title={p.title} text={p.excerpt} crumbs={[{ label: "Blog", to: "/blog" }, { label: p.category }]} />
      <article className="section-y bg-ivory !pt-0">
        <div className="container-x max-w-4xl">
          <img src={p.image} alt={p.title} className="-mt-12 aspect-[16/9] w-full rounded-2xl object-cover shadow-lift md:-mt-16" />
          <time dateTime={p.date} className="mt-10 block text-sm text-muted-foreground">{new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
          <div className="mt-8 space-y-6 text-lg leading-[1.85] text-ink/85 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-none first-letter:text-gold">
            {p.body.map((para, i) => <p key={i}>{para}</p>)}
          </div>
          <Link to="/blog" className="mt-14 inline-flex items-center gap-2 text-forest hover:text-gold"><ArrowLeft className="h-4 w-4" /> Back to Journal</Link>
        </div>
      </article>
    </>
  );
}
