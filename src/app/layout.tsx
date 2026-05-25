import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { JsonLd } from "@/components/seo/JsonLd";
import { HOTEL } from "@/lib/constants";
import { ClientEnhancements } from "@/components/layout/ClientEnhancements";

function metadataBaseUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw.includes("://") ? raw : `https://${raw}`);
    } catch {
      /* fall through */
    }
  }
  if (process.env.NODE_ENV === "production") {
    console.warn("NEXT_PUBLIC_SITE_URL is missing; falling back to localhost metadata base.");
  }
  return new URL("http://localhost:3000");
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a1628",
};

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl(),
  alternates: { canonical: "/" },
  icons: {
    icon: "/logo-light.png",
    apple: "/logo-light.png",
    shortcut: "/logo-light.png",
  },
  title: {
    default: `${HOTEL.name} — Luxury Stay & Events`,
    template: `%s · ${HOTEL.shortName}`,
  },
  description: HOTEL.description,
  keywords: [
    "luxury hotel",
    "Khatu Shyam",
    "Khatu Shyam Ji hotel",
    "temple stay Rajasthan",
    "banquet hall",
    "wedding venue",
    HOTEL.name,
    "direct booking",
  ],
  openGraph: {
    title: HOTEL.name,
    description: HOTEL.description,
    type: "website",
    locale: "en_IN",
    siteName: HOTEL.name,
    images: [{ url: HOTEL.heroVideoPoster, width: 1200, height: 630, alt: HOTEL.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOTEL.name,
    description: HOTEL.description,
    images: [HOTEL.heroVideoPoster],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen w-full min-w-0 antialiased"
      >
        <a
          href="#main-content"
          className="sr-only z-[120] rounded bg-navy px-4 py-2 text-sm font-medium text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <ClientEnhancements />
        <JsonLd />
        <Header />
        <main id="main-content" className="min-h-[70vh] w-full min-w-0">
          {children}
        </main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
