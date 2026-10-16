import { Link } from "@tanstack/react-router";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "md",
  variant = "horizontal",
}: {
  light?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "horizontal" | "stacked" | "symbol";
}) {
  const src =
    variant === "stacked"
      ? "/brand/aurelian-logo-stacked.png"
      : variant === "symbol"
        ? "/brand/aurelian-symbol-transparent.png"
        : "/brand/aurelian-logo-horizontal.png";

  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973F] rounded-sm group",
        className
      )}
      aria-label={`${site.name} home`}
    >
      <img
        src={src}
        alt={site.name}
        style={{ background: "transparent" }}
        className={cn(
          "w-auto select-none object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(242,200,110,0.35)] hover:drop-shadow-[0_0_12px_rgba(242,200,110,0.35)]",
          size === "sm" && "h-[36px]",
          size === "md" && "h-[38px] md:h-[48px]",
          size === "lg" && "h-[54px] md:h-[66px]"
        )}
      />
    </Link>
  );
}
