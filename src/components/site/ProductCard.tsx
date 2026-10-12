import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Plus } from "lucide-react";
import type { Category, Product } from "@/data/products";
import { useBasket } from "@/lib/basket";

export function ProductCard({ product, category }: { product: Product; category: Category }) {
  const { add, has } = useBasket();
  const key = `${category.slug}/${product.slug}`;
  const inBasket = has(key);
  return (
    <article className="group relative overflow-hidden rounded-2xl border hairline bg-card shadow-soft transition-shadow duration-500 hover:shadow-lift">
      <Link to="/products/$category/$product" params={{ category: category.slug, product: product.slug }} className="block">
        <div className="aspect-[4/3] overflow-hidden">
          <img src={category.image} alt={`${product.name} from ${product.origin}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
        </div>
        <div className="p-6">
          <p className="eyebrow !text-[0.62rem]">{category.name}</p>
          <h3 className="mt-2 text-2xl text-forest">{product.name}</h3>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div><dt className="text-muted-foreground">Origin</dt><dd className="mt-0.5 text-ink">{product.origin}</dd></div>
            <div><dt className="text-muted-foreground">Grade</dt><dd className="mt-0.5 text-ink">{product.grade}</dd></div>
          </dl>
          <span className="mt-5 inline-flex -translate-x-3 items-center gap-2 text-sm text-gold opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
            View Details <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
      <button
        onClick={() => add({ key, name: product.name, category: category.name })}
        aria-label={inBasket ? `${product.name} in enquiry basket` : `Add ${product.name} to enquiry`}
        className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ivory/90 px-3 py-1.5 text-xs font-medium text-forest backdrop-blur transition-colors hover:bg-gold"
      >
        {inBasket ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        {inBasket ? "Added" : "Enquire"}
      </button>
    </article>
  );
}
