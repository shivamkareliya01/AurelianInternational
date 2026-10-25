import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { BasketProvider } from "@/lib/basket";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingActions, PageLoader } from "@/components/site/FloatingActions";
import { Toaster } from "@/components/ui/sonner";
import { site } from "@/data/site";
import { company } from "@/config/company";

import { Logo } from "@/components/site/Logo";
import { btn } from "@/components/site/primitives";
import { cn } from "@/lib/utils";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#040E1F] px-4 py-20 text-[#F4F1EA]">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-8">
          <Logo size="lg" variant="stacked" />
        </div>
        <h1 className="font-display text-7xl font-bold text-[#F2C86E]">404</h1>
        <h2 className="mt-4 font-display text-2xl font-semibold text-[#F4F1EA]">Page Not Found</h2>
        <p className="mt-2 text-sm text-[#D9DDE3]">
          The export category or page you are looking for does not exist or has been relocated.
        </p>
        <div className="mt-8">
          <Link to="/" className={cn(btn.gold, "px-8 py-3")}>
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#040E1F] px-4 py-20 text-[#F4F1EA]">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-8">
          <Logo size="lg" variant="stacked" />
        </div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-[#F4F1EA]">
          This Page Didn't Load
        </h1>
        <p className="mt-2 text-sm text-[#D9DDE3]">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className={cn(btn.gold, "px-6 py-2.5")}
          >
            Try Again
          </button>
          <Link to="/" className={cn(btn.outline, "px-6 py-2.5")}>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#071A33" },
      { title: `${site.name} — Import Export Company India | Vegetables, Spices, Tiles & Agro Commodities` },
      {
        name: "description",
        content:
          "Aurelian International is a leading Indian import export company based in Gujarat. Direct manufacturer & exporter of Ceramic Tiles, Indian Spices, Fresh Vegetables, Basmati Rice, and Dehydrated Powders worldwide.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: site.name },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: `${site.url}/og-image.png` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${site.url}/og-image.png` },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "author", content: site.name },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { rel: "icon", href: "/favicon.png", type: "image/png", sizes: "192x192" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;600&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${site.url}/#organization`,
              name: site.name,
              alternateName: "Aurelian International Import Export",
              url: site.url,
              logo: `${site.url}/brand/aurelian-symbol-gold.svg`,
              image: `${site.url}/og-image.png`,
              email: site.email,
              telephone: site.phone,
              address: company.schemaAddress,
              description:
                "Leading Indian export merchant house supplying Basmati rice, premium spices, dehydrated food powders, fresh produce, and vitrified ceramic tiles to global markets.",
              knowsAbout: [
                "Import Export Company India",
                "Ceramic Tiles Exporter Morbi",
                "Glazed Vitrified Tiles (GVT/PGVT)",
                "Indian Spices Exporter (Turmeric, Red Chilli, Cumin, Cinnamon)",
                "Fresh Vegetables Exporter (Nashik Red Onion, Potato, Tomato, Garlic)",
                "1121 Basmati Rice Exporter India",
                "Dehydrated Onion and Garlic Powder Manufacturer",
                "Agricultural Commodities Export from India"
              ],
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: site.phone,
                  contactType: "sales",
                  areaServed: "Worldwide",
                  availableLanguage: ["English", "Hindi", "Gujarati"],
                },
              ],
            },
            {
              "@type": "WebSite",
              "@id": `${site.url}/#website`,
              url: site.url,
              name: site.name,
              publisher: {
                "@id": `${site.url}/#organization`,
              },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    let timer: number | undefined;
    const handleScroll = () => {
      document.body.classList.add("is-scrolling");
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        document.body.classList.remove("is-scrolling");
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <BasketProvider>
        <PageLoader />
        <Navbar />
        <main className="min-w-0 w-full overflow-x-clip pb-16 md:pb-0">
          <Outlet />
        </main>
        <Footer />
        <FloatingActions />
        <Toaster />
      </BasketProvider>
    </QueryClientProvider>
  );
}
