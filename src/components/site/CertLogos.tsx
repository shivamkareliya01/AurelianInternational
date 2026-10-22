import type { SVGProps } from "react";

// Official vector logos for India statutory export & food compliance authorities

export function DGFTLogo({ className = "h-10 w-10", alt = "Directorate General of Foreign Trade (DGFT) Logo", ...props }: { className?: string; alt?: string } & React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/certifications/dgft.webp"
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "/certifications/dgft.png";
      }}
      {...props}
    />
  );
}

export function APEDALogo({ className = "h-10 w-10", alt = "APEDA Logo", ...props }: { className?: string; alt?: string } & React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/certifications/apeda.webp"
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "/certifications/apeda.png";
      }}
      {...props}
    />
  );
}

export function IndiaOrganicLogo({ className = "h-10 w-10", alt = "India Organic / Jaivik Bharat Logo", ...props }: { className?: string; alt?: string } & React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/certifications/india-organic.webp"
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "/certifications/india-organic.png";
      }}
      {...props}
    />
  );
}

export function SpicesBoardLogo({ className = "h-10 w-10", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Spices Board India Logo"
      {...props}
    >
      {/* Outer circular medallion with spice-crimson perimeter */}
      <circle cx="60" cy="60" r="56" fill="#FFFFFF" stroke="#991B1B" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="51" fill="#FEF2F2" stroke="#D97706" strokeWidth="1" />

      {/* Decorative inner circle */}
      <circle cx="60" cy="60" r="38" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />

      {/* Central Spices Motif: Stylized spice branch & traditional flame */}
      <g transform="translate(42, 28)">
        {/* Pepper Vine Leaves (Forest Green) */}
        <path
          d="M18 10c-6 2-10 8-8 14 3-2 8-3 12-2 1-4 0-8-4-12z"
          fill="#15803D"
        />
        <path
          d="M18 10c6 2 10 8 8 14-3-2-8-3-12-2-1-4 0-8 4-12z"
          fill="#16A34A"
        />
        {/* Cardamom pod in warm olive */}
        <ellipse cx="18" cy="28" rx="6" ry="10" fill="#65A30D" />
        <path d="M18 18v20" stroke="#4D7C0F" strokeWidth="1" strokeLinecap="round" />
        {/* Spice berries / peppercorns (Crimson) */}
        <circle cx="10" cy="26" r="3.2" fill="#991B1B" />
        <circle cx="26" cy="26" r="3.2" fill="#B91C1C" />
        <circle cx="18" cy="40" r="3" fill="#D97706" />
      </g>

      {/* Circular Heading Banner */}
      <text
        x="60"
        y="79"
        textAnchor="middle"
        fontFamily="'Montserrat', 'Inter', sans-serif"
        fontSize="9"
        fontWeight="900"
        fill="#991B1B"
        letterSpacing="0.08em"
      >
        SPICES BOARD
      </text>

      {/* India text with laurel stars */}
      <text
        x="60"
        y="91"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="7"
        fontWeight="800"
        fill="#B45309"
        letterSpacing="0.16em"
      >
        ★ INDIA ★
      </text>

      <text
        x="60"
        y="100"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="4.8"
        fontWeight="600"
        fill="#64748B"
        letterSpacing="0.04em"
      >
        CRES CERTIFIED
      </text>
    </svg>
  );
}

export function FSSAILogo({ className = "h-10 w-10", alt = "FSSAI Logo", ...props }: { className?: string; alt?: string } & React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/certifications/fssai.webp"
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "/certifications/fssai.png";
      }}
      {...props}
    />
  );
}

export function ISOLogo({ className = "h-10 w-10", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ISO 22000 Logo"
      {...props}
    >
      {/* Outer rounded squircle in deep ISO navy */}
      <rect x="5" y="5" width="110" height="110" rx="22" fill="#0A2540" stroke="#38BDF8" strokeWidth="1.5" />

      {/* Globe coordinate wireframe grid (Latitude & Longitude) */}
      <g stroke="#38BDF8" strokeWidth="1" opacity="0.35">
        <circle cx="60" cy="44" r="28" fill="none" />
        <ellipse cx="60" cy="44" rx="28" ry="12" fill="none" />
        <ellipse cx="60" cy="44" rx="14" ry="28" fill="none" />
        <line x1="32" y1="44" x2="88" y2="44" />
        <line x1="60" y1="16" x2="60" y2="72" />
      </g>

      {/* Solid ISO Plaque with sharp shadow */}
      <rect x="24" y="27" width="72" height="34" rx="6" fill="#FFFFFF" />

      {/* Bold Iconic "ISO" Typography */}
      <text
        x="60"
        y="52"
        textAnchor="middle"
        fontFamily="'Montserrat', 'Inter', sans-serif"
        fontSize="24"
        fontWeight="900"
        fill="#0A2540"
        letterSpacing="0.08em"
      >
        ISO
      </text>

      {/* Red Quality Standard Pill Badge */}
      <rect x="22" y="70" width="76" height="18" rx="4" fill="#DC2626" />
      <text
        x="60"
        y="83"
        textAnchor="middle"
        fontFamily="'Montserrat', 'Inter', sans-serif"
        fontSize="10"
        fontWeight="800"
        fill="#FFFFFF"
        letterSpacing="0.06em"
      >
        22000:2018
      </text>

      {/* Food Safety Management System */}
      <text
        x="60"
        y="99"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="5.2"
        fontWeight="600"
        fill="#93C5FD"
        letterSpacing="0.06em"
      >
        FOOD SAFETY SYSTEM CERTIFIED
      </text>
    </svg>
  );
}

export function MSMELogo({ className = "h-10 w-10", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="MSME India Logo"
      {...props}
    >
      {/* Background card with clean border */}
      <rect x="4" y="4" width="112" height="112" rx="20" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />

      {/* Tricolor Emblem with Industrial Gears / Lotus Synergy */}
      <g transform="translate(60, 36)">
        {/* Saffron Top Petal / Gear (Top) */}
        <circle cx="0" cy="-14" r="9" fill="#FF9933" />
        <path d="M-6 -6L-3 -14h6l3 8z" fill="#FF9933" />

        {/* Ashoka Blue Center Wheel */}
        <circle cx="0" cy="0" r="12" fill="#000080" />
        <circle cx="0" cy="0" r="8" fill="#FFFFFF" />
        <circle cx="0" cy="0" r="3" fill="#000080" />
        {/* Chakra 8 primary spoke lines */}
        <path d="M0 -8v16M-8 0h16M-5.6 -5.6l11.2 11.2M-5.6 5.6l11.2 -11.2" stroke="#000080" strokeWidth="1" />

        {/* Emerald Green Base Petal / Enterprise (Bottom) */}
        <circle cx="-13" cy="8" r="8" fill="#138808" />
        <circle cx="13" cy="8" r="8" fill="#138808" />
      </g>

      {/* Bold MSME Wordmark */}
      <text
        x="60"
        y="78"
        textAnchor="middle"
        fontFamily="'Montserrat', 'Inter', sans-serif"
        fontSize="18"
        fontWeight="900"
        fill="#071A33"
        letterSpacing="0.1em"
      >
        MSME
      </text>

      {/* Hindi Subtitle */}
      <text
        x="60"
        y="89"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="5.5"
        fontWeight="700"
        fill="#FF9933"
        letterSpacing="0.04em"
      >
        सूक्ष्म, लघु एवं मध्यम उद्यम
      </text>

      {/* Udyam Registration Tag */}
      <text
        x="60"
        y="99"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="5.2"
        fontWeight="700"
        fill="#138808"
        letterSpacing="0.05em"
      >
        UDYAM REGISTRATION · GOVT. OF INDIA
      </text>
    </svg>
  );
}

// Master component mapping certification code to exact logo
export function CertLogo({
  code,
  className = "h-12 w-12",
}: {
  code: string;
  className?: string;
}) {
  const normalized = code.trim().toUpperCase();

  switch (normalized) {
    case "DGFT":
    case "IEC":
      return <DGFTLogo className={className} />;
    case "APEDA":
      return <APEDALogo className={className} />;
    case "SPICES":
    case "SPICES BOARD":
    case "SPICE BOARD":
      return <SpicesBoardLogo className={className} />;
    case "FSSAI":
      return <FSSAILogo className={className} />;
    case "INDIA ORGANIC":
    case "JAIVIK BHARAT":
    case "ORGANIC":
    case "NPOP":
      return <IndiaOrganicLogo className={className} />;
    case "ISO":
    case "ISO 22000":
    case "ISO 22000:2018":
      return <ISOLogo className={className} />;
    case "MSME":
    case "UDYAM":
      return <MSMELogo className={className} />;
    default:
      return <DGFTLogo className={className} />;
  }
}
