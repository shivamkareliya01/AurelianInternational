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

export function SpicesBoardLogo({ className = "h-10 w-10", alt = "Spices Board India Logo", ...props }: { className?: string; alt?: string } & React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/certifications/spices-board.png"
      alt={alt}
      className={className}
      loading="lazy"
      {...props}
    />
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

export function ISOLogo({ className = "h-10 w-10", alt = "ISO Certified Company Logo", ...props }: { className?: string; alt?: string } & React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/certifications/iso.png"
      alt={alt}
      className={className}
      loading="lazy"
      {...props}
    />
  );
}

export function MSMELogo({ className = "h-10 w-10", alt = "MSME Micro Small and Medium Enterprises Logo", ...props }: { className?: string; alt?: string } & React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/certifications/msme.png"
      alt={alt}
      className={className}
      loading="lazy"
      {...props}
    />
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
