import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PostCard } from "@/components/site/Blocks";
import { PageHeader } from "@/components/site/PageHeader";
import { btn } from "@/components/site/primitives";
import { posts } from "@/data/blog";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: `Journal & Export Insights — ${site.name}` },
      { name: "description", content: "Essential trade guides on export documentation, product quality markers, maritime cold-chain logistics, and stone specification from India." },
      { property: "og:title", content: `Journal — ${site.name}` },
      { property: "og:description", content: "Trade guides and insights for international importers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Blog,
});

function Blog() {
  const cats = ["All", ...new Set(posts.map((p) => p.category))];
  const [c, setC] = useState("All");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchCat = c === "All" || p.category === c;
      const matchSearch =
        !search ||
        `${p.title} ${p.excerpt} ${p.category} ${p.author}`.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [c, search]);

  const visiblePosts = filtered.slice(0, visibleCount);
  const featuredPost = visiblePosts[0];
  const remainingPosts = visiblePosts.slice(1);

  return (
    <>
      <PageHeader
        eyebrow="Intelligence & Trade Guides"
        title="Insights for Importers"
        text="Practical field knowledge on customs paperwork, quality testing parameters, and oceanic cargo handling from our senior trade specialists."
        image="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80"
        crumbs={[{ label: "Blog & Journal" }]}
      />

      <section className="py-16 md:py-24 bg-ivory">
        <div className="container-x">
          {/* Filter Bar & Search */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between pb-10 border-b hairline">
            <div className="flex flex-wrap gap-2">
              {cats.map((x) => (
                <button
                  key={x}
                  onClick={() => {
                    setC(x);
                    setVisibleCount(6);
                  }}
                  className={cn(
                    "rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer",
                    c === x
                      ? "border-[#071A33] bg-[#071A33] text-gold-soft shadow-sm"
                      : "border-gold/30 bg-card text-ink/70 hover:border-gold hover:text-[#071A33]"
                  )}
                >
                  {x}
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full rounded-full border border-gold/30 bg-card py-2.5 pl-10 pr-4 text-xs focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          {/* Posts Grid: 3-column grid with featured first post spanning 2 columns */}
          {visiblePosts.length > 0 ? (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredPost && (
                <div className="md:col-span-2">
                  <PostCard post={featuredPost} featured={true} />
                </div>
              )}

              {remainingPosts.map((p) => (
                <div key={p.slug} className="h-full">
                  <PostCard post={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center py-12 rounded-3xl border border-dashed border-gold/40">
              <p className="font-display text-2xl text-[#071A33]">No articles found</p>
              <p className="mt-2 text-sm text-muted-foreground">Try selecting a different category or clearing search.</p>
              <button onClick={() => { setC("All"); setSearch(""); }} className={cn(btn.gold, "mt-6")}>
                Reset Filter
              </button>
            </div>
          )}

          {/* Load More Button if more posts available */}
          {filtered.length > visibleCount && (
            <div className="mt-16 text-center">
              <button
                onClick={() => setVisibleCount((n) => n + 3)}
                className={cn(btn.outline, "inline-flex items-center gap-2")}
              >
                <ArrowDown className="h-4 w-4" /> Load More Articles ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
