import { createFileRoute } from "@tanstack/react-router";
import { posts } from "@/data/blog";
import { categories } from "@/data/products";
import { site } from "@/data/site";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const paths = [
          "/", "/products", "/about", "/markets", "/certifications", "/blog", "/contact",
          ...categories.flatMap((c) => [`/products/${c.slug}`, ...c.products.map((p) => `/products/${c.slug}/${p.slug}`)]),
          ...posts.map((p) => `/blog/${p.slug}`),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${site.url}${p}</loc></url>`).join("")}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
