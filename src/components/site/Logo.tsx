import { Link } from "@tanstack/react-router";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label={`${site.name} home`}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border hairline">
        <span className={cn("font-display text-xl italic", light ? "text-gold-soft" : "text-gold")}>V</span>
      </span>
      <span className="leading-none">
        <span className={cn("block font-display text-xl tracking-tight", light ? "text-on-forest" : "text-forest")}>{site.short}</span>
        <span className={cn("mt-1 block text-[0.6rem] uppercase tracking-[0.3em]", light ? "text-on-forest-muted" : "text-muted-foreground")}>Global Exports</span>
      </span>
    </Link>
  );
}
