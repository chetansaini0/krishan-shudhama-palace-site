import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { JsonLd } from "@/components/seo/JsonLd";
import { Analytics } from "@/components/seo/Analytics";
import { HOTEL } from "@/lib/constants";
import { ClientEnhancements } from "@/components/layout/ClientEnhancements";
import { metadataBaseUrl } from "@/lib/site-url";
import { SEO_KEYWORDS } from "@/lib/seo";
import { isMaintenanceMode } from "@/lib/maintenance";

const locked = isMaintenanceMode();

export const viewport: Viewport = locked
  ? {
      width: "device-width",
      initialScale: 1,
      themeColor: "#ffffff",
    }
  : {
      width: "device-width",
      initialScale: 1,
      viewportFit: "cover",
      themeColor: "#0a1628",
    };

export const metadata: Metadata = locked
  ? {
      metadataBase: metadataBaseUrl(),
      title: { absolute: "503 Service Unavailable" },
      description: "The server is temporarily unable to handle this request.",
      robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false, noimageindex: true },
      },
      icons: {
        icon: [
          { url: "/brand-favicon.ico", sizes: "48x48" },
          { url: "/brand-favicon-32.png", type: "image/png", sizes: "32x32" },
        ],
        shortcut: "/brand-favicon.ico",
      },
    }
  : {
      metadataBase: metadataBaseUrl(),
      alternates: { canonical: "/" },
      applicationName: HOTEL.name,
      category: "travel",
      icons: {
        icon: [
          { url: "/brand-favicon.ico", sizes: "48x48" },
          { url: "/brand-favicon.png", type: "image/png", sizes: "512x512" },
          { url: "/brand-favicon-32.png", type: "image/png", sizes: "32x32" },
          { url: "/brand-favicon-48.png", type: "image/png", sizes: "48x48" },
          { url: "/icons/brand-icon-192.png", type: "image/png", sizes: "192x192" },
          { url: "/icons/brand-icon-512.png", type: "image/png", sizes: "512x512" },
        ],
        apple: "/icons/brand-apple-touch-icon.png",
        shortcut: "/brand-favicon.ico",
      },
      title: {
        default: `Best Hotel in Khatoo Near Khatu Shyam Ji | ${HOTEL.name}`,
        template: `%s · ${HOTEL.shortName}`,
      },
      description:
        "Book the best hotel in Khatoo (Khatu) near Khatu Shyam Temple — luxury rooms, pure veg dining, banquet hall & direct booking at Krishan Shudhama Palace.",
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-video-preview": -1,
          "max-snippet": -1,
        },
      },
      keywords: [...SEO_KEYWORDS],
      openGraph: {
        title: HOTEL.name,
        description: HOTEL.description,
        type: "website",
        locale: "en_IN",
        siteName: HOTEL.name,
        url: "/",
        images: [{ url: "/images/our-story-room.png", width: 1200, height: 630, alt: HOTEL.name }],
      },
      twitter: {
        card: "summary_large_image",
        title: HOTEL.name,
        description: HOTEL.description,
        images: ["/images/our-story-room.png"],
      },
      verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      },
    };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locked = isMaintenanceMode();

  return (
    <html lang={locked ? "en" : "en-IN"} className={locked ? "maintenance-lock" : undefined}>
      <body className={locked ? undefined : "min-h-screen w-full min-w-0 antialiased"}>
        {locked ? (
          <main id="main-content">{children}</main>
        ) : (
          <>
            <a
              href="#main-content"
              className="sr-only z-[120] rounded bg-navy px-4 py-2 text-sm font-medium text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            >
              Skip to content
            </a>
            <ClientEnhancements />
            <Analytics />
            <JsonLd />
            <Header />
            <main id="main-content" className="min-h-[70vh] w-full min-w-0">
              {children}
            </main>
            <Footer />
            <FloatingActions />
          </>
        )}
      </body>
    </html>
  );
}
