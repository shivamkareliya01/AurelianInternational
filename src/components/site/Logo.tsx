import { Link } from "@tanstack/react-router";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "md",
  variant = "stacked",
}: {
  light?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "horizontal" | "stacked" | "symbol";
}) {
  const src =
    variant === "horizontal"
      ? "/brand/aurelian-logo-horizontal.png"
      : variant === "symbol"
        ? "/brand/aurelian-symbol-transparent.png"
        : "/brand/aurelian-logo-stacked.png";

  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973F] rounded-sm group",
        className,
      )}
      aria-label={`${site.name} home`}
    >
      <img
        src={src}
        alt={site.name}
        style={{ background: "transparent" }}
        className={cn(
          "w-auto select-none object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_14px_rgba(242,200,110,0.4)] hover:drop-shadow-[0_0_14px_rgba(242,200,110,0.4)]",
          variant === "stacked"
            ? cn(
                size === "sm" && "h-[44px]",
                size === "md" && "h-[58px] md:h-[66px]",
                size === "lg" && "h-[84px] md:h-[96px]",
                size === "xl" && "h-[112px]",
              )
            : variant === "symbol"
              ? cn(
                  size === "sm" && "h-[32px] w-auto",
                  size === "md" && "h-[44px] w-auto",
                  size === "lg" && "h-[64px] w-auto",
                  size === "xl" && "h-[84px] w-auto",
                )
              : cn(
                  size === "sm" && "h-[34px] md:h-[38px]",
                  size === "md" && "h-[42px] md:h-[50px]",
                  size === "lg" && "h-[56px] md:h-[68px]",
                  size === "xl" && "h-[80px]",
                ),
        )}
      />
    </Link>
  );
}
