import { useState } from "react";
import { cn } from "@/lib/utils";

interface CountryFlagProps {
  code: string;
  name?: string;
  className?: string;
  fallbackEmoji?: string;
}

export function CountryFlag({
  code,
  name,
  className,
  fallbackEmoji,
}: CountryFlagProps) {
  const [hasError, setHasError] = useState(false);
  const cleanCode = (code || "").trim().toLowerCase();

  // If code is empty or regional emoji fallback
  if (!cleanCode || cleanCode.length !== 2 || hasError) {
    if (fallbackEmoji) {
      return <span className="text-base leading-none select-none">{fallbackEmoji}</span>;
    }
    return (
      <span className="inline-flex h-4 min-w-[20px] items-center justify-center rounded-[2px] bg-slate-200 px-1 font-mono text-[9px] font-bold text-slate-700 select-none">
        {code ? code.toUpperCase() : "—"}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${cleanCode}.png`}
      srcSet={`https://flagcdn.com/w80/${cleanCode}.png 2x`}
      alt={name ? `${name} flag` : `${code.toUpperCase()} flag`}
      width={20}
      height={15}
      loading="lazy"
      decoding="async"
      onError={() => setHasError(true)}
      className={cn(
        "inline-block h-3.5 w-5 shrink-0 rounded-[2px] object-cover shadow-[0_1px_2px_rgba(0,0,0,0.18)] border border-black/10 select-none",
        className
      )}
    />
  );
}
