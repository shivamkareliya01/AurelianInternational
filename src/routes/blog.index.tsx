import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PostCard } from "@/components/site/Blocks";
import { PageHeader } from "@/components/site/PageHeader";
import { posts } from "@/data/blog";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: `Journal — Export Insights | ${site.name}` },
      { name: "description", content: "Guides on documentation, product quality and logistics for importers buying from India." },
      { property: "og:title", content: `Journal — ${site.name}` },
      { property: "og:description", content: "Trade guides and insights for importers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Blog,
});

function Blog() {
  const cats = ["All", ...new Set(posts.map((p) => p.category))];
  const [c, setC] = useState("All");
  const list = c === "All" ? posts : posts.filter((p) => p.category === c);
  return (
    <>
      <PageHeader eyebrow="Journal" title="Insights for importers." crumbs={[{ label: "Blog" }]} />
      <section className="section-y bg-ivory !pt-14">
        <div className="container-x">
          <div className="flex flex-wrap gap-2">
            {cats.map((x) => (
              <button key={x} onClick={() => setC(x)} className={cn("rounded-full border px-5 py-2 text-sm transition-colors", c === x ? "border-forest bg-forest text-on-forest" : "hairline text-ink/70 hover:text-forest")}>{x}</button>
            ))}
          </div>
          <div className="mt-12 grid gap-12 md:grid-cols-2 lg:grid-cols-3">{list.map((p) => <PostCard key={p.slug} post={p} />)}</div>
        </div>
      </section>
    </>
  );
}
