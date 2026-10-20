import type { SVGProps } from "react";

// Official vector logos for India statutory export & food compliance authorities

export function DGFTLogo({ className = "h-10 w-10", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Directorate General of Foreign Trade (DGFT) Logo"
      {...props}
    >
      {/* Outer gold-rimmed medallion */}
      <circle cx="60" cy="60" r="56" fill="#071A33" stroke="#C9973F" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="50" fill="none" stroke="#C9973F" strokeWidth="0.8" strokeDasharray="2 2" />

      {/* Ashoka Lion Capital Motif in Gold */}
      <g fill="#F2C86E">
        {/* Central Lion Head */}
        <path d="M60 22c-3.2 0-5.8 2.2-6 5.2-.2 2.6 1.4 4.8 3.8 5.6v2.2h4.4V33c2.4-.8 4-3 3.8-5.6-.2-3-2.8-5.2-6-5.2z" />
        {/* Left Lion Head */}
        <path d="M49 26c-2.8 0-5 2-5.2 4.6-.2 2.2 1.2 4.2 3.2 5v2h3.5v-2c2.2-.8 3.5-2.8 3.3-5-.2-2.6-2-4.6-4.8-4.6z" />
        {/* Right Lion Head */}
        <path d="M71 26c-2.8 0-4.6 2-4.8 4.6-.2 2.2 1.1 4.2 3.3 5v2h3.5v-2c2-.8 3.4-2.8 3.2-5-.2-2.6-2.4-4.6-5.2-4.6z" />
        {/* Mane and Chest Details */}
        <path d="M52 38h16v6h-16z" opacity="0.9" />
        <path d="M47 44h26v4H47z" />
        {/* Abacus Base with Ashoka Chakra Wheel */}
        <rect x="42" y="49" width="36" height="5" rx="1.5" fill="#E5B25D" />
        <circle cx="60" cy="51.5" r="2" fill="#071A33" />
        {/* Sarnath Lotus Petals */}
        <path d="M44 55c4 4 12 5 16 5s12-1 16-5c-2 6-8 8-16 8s-14-2-16-8z" fill="#C9973F" />
      </g>

      {/* Ribbon with DGFT text */}
      <rect x="30" y="68" width="60" height="18" rx="4" fill="#C9973F" />
      <text
        x="60"
        y="81.5"
        textAnchor="middle"
        fontFamily="'Montserrat', 'Inter', sans-serif"
        fontSize="11"
        fontWeight="800"
        fill="#071A33"
        letterSpacing="0.12em"
      >
        DGFT
      </text>

      {/* Subtext around perimeter */}
      <text
        x="60"
        y="96"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="6.2"
        fontWeight="600"
        fill="#D9DDE3"
        letterSpacing="0.08em"
      >
        GOVT. OF INDIA
      </text>
      <text
        x="60"
        y="104"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="5"
        fontWeight="500"
        fill="#C9973F"
        letterSpacing="0.05em"
      >
        MINISTRY OF COMMERCE
      </text>
    </svg>
  );
}

export function APEDALogo({ className = "h-10 w-10", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="APEDA Logo"
      {...props}
    >
      {/* Background card with crisp border */}
      <rect x="4" y="4" width="112" height="112" rx="20" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />

      {/* APEDA stylized dual agricultural sprouts / foliage */}
      <g transform="translate(18, 14)">
        {/* Left Sprout (Deep emerald green) */}
        <path
          d="M30 42C18 38 12 24 16 12c3 10 10 18 20 22 4 1.6 7 4.2 9 8-6 1-11 0-15 0z"
          fill="#15803D"
        />
        {/* Right Sprout (Bright leaf green) */}
        <path
          d="M54 42c12-4 18-18 14-30-3 10-10 18-20 22-4 1.6-7 4.2-9 8 6 1 11 0 15 0z"
          fill="#22C55E"
        />
        {/* Central rising golden wheat grain / sun disc */}
        <circle cx="42" cy="18" r="7" fill="#F59E0B" />
        <path d="M42 25v16" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
        {/* Base Harvest Arc */}
        <path
          d="M24 45c12 5 24 5 36 0"
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* Distinctive APEDA Brand Wordmark */}
      <text
        x="60"
        y="78"
        textAnchor="middle"
        fontFamily="'Montserrat', 'Inter', sans-serif"
        fontSize="17"
        fontWeight="900"
        fill="#15803D"
        letterSpacing="0.04em"
      >
        apeda
      </text>

      {/* Micro Authority Subtitle */}
      <text
        x="60"
        y="91"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="5.5"
        fontWeight="700"
        fill="#1E293B"
        letterSpacing="0.05em"
      >
        AGRI EXPORT AUTHORITY
      </text>
      <text
        x="60"
        y="99"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="5"
        fontWeight="600"
        fill="#D97706"
        letterSpacing="0.06em"
      >
        GOVERNMENT OF INDIA
      </text>
    </svg>
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

export function FSSAILogo({ className = "h-10 w-10", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="FSSAI Logo"
      {...props}
    >
      {/* Background card with clean shadow profile */}
      <rect x="4" y="4" width="112" height="112" rx="20" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />

      {/* Famous FSSAI Swirl / Vortex Logo with 3 curved ribbons */}
      <g transform="translate(30, 14)">
        {/* Orange Food Ribbon */}
        <path
          d="M30 4c12 0 22 8 24 20-3-6-9-11-16-12-6-1-11 1-16 4 3-6 5-12 8-12z"
          fill="#EA580C"
        />
        {/* Emerald Green Agriculture Ribbon */}
        <path
          d="M54 24c4 11 0 24-10 30 2-7 1-14-3-19-4-5-9-7-15-7 7-2 14-2 20-2z"
          fill="#16A34A"
        />
        {/* Cyan/Blue Purity Water Ribbon */}
        <path
          d="M44 54c-11 5-24 1-28-9 5 4 12 5 18 2 5-3 8-7 10-13 1 7 0 14 0 20z"
          fill="#0284C7"
        />
        {/* Fourth connecting arc for visual balance */}
        <circle cx="30" cy="29" r="6" fill="#F97316" opacity="0.15" />
      </g>

      {/* Official fssai lower-case typography */}
      <text
        x="60"
        y="80"
        textAnchor="middle"
        fontFamily="'Arial Rounded MT Bold', 'Montserrat', sans-serif"
        fontSize="21"
        fontWeight="900"
        fill="#0369A1"
        letterSpacing="0.02em"
      >
        fssai
      </text>

      {/* Full title in clean caption typography */}
      <text
        x="60"
        y="92"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="5"
        fontWeight="700"
        fill="#1E293B"
        letterSpacing="0.04em"
      >
        FOOD SAFETY &amp; STANDARDS
      </text>
      <text
        x="60"
        y="100"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="4.8"
        fontWeight="600"
        fill="#EA580C"
        letterSpacing="0.05em"
      >
        CENTRAL LICENCE · GOVT OF INDIA
      </text>
    </svg>
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
      return <DGFTLogo className={className} />;
    case "APEDA":
      return <APEDALogo className={className} />;
    case "SPICES":
    case "SPICES BOARD":
    case "SPICE BOARD":
      return <SpicesBoardLogo className={className} />;
    case "FSSAI":
      return <FSSAILogo className={className} />;
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
