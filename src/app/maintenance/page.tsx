import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-url";

function errorHost(): string {
  try {
    return new URL(siteUrl()).hostname;
  } catch {
    return "this site";
  }
}

export const metadata: Metadata = {
  title: { absolute: "503 Service Unavailable" },
  description: "The server is temporarily unable to handle this request.",
  applicationName: undefined,
  keywords: [],
  openGraph: undefined,
  twitter: undefined,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  other: {
    robots: "noindex,nofollow",
  },
};

/**
 * Lock screen shown for every public URL while MAINTENANCE_MODE=true.
 * Styled as a generic HTTP 503 so it reads as a technical outage, not a brand page.
 */
export default function MaintenancePage() {
  const host = errorHost();

  return (
    <div className="tech-error">
      <div className="tech-error__inner">
        <h1 className="tech-error__title">This page isn’t working</h1>
        <p className="tech-error__lead">
          {host} is currently unable to handle this request.
        </p>
        <p className="tech-error__code">HTTP ERROR 503</p>
      </div>
    </div>
  );
}
