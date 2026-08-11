import type { Metadata } from "next";
import { HOTEL } from "@/lib/constants";

export const metadata: Metadata = {
  title: { absolute: "Website Temporarily Unavailable" },
  description: "This website has been temporarily disabled. Please contact the website owner for more information.",
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
 * No navigation, footer, or links — crawlers receive noindex via metadata + headers.
 */
export default function MaintenancePage() {
  return (
    <div className="maintenance-screen">
      <div className="maintenance-screen__glow" aria-hidden />
      <div className="maintenance-screen__inner">
        {/* eslint-disable-next-line @next/next/no-img-element -- lock page must not depend on the image optimizer */}
        <img
          src="/logo-light.png"
          alt={HOTEL.name}
          width={280}
          height={120}
          className="maintenance-screen__logo"
        />

        <div className="maintenance-screen__loader" role="status" aria-label="Unavailable">
          <span className="maintenance-screen__spinner" aria-hidden />
        </div>

        <h1 className="maintenance-screen__title">Website Temporarily Unavailable</h1>
        <p className="maintenance-screen__subtitle">
          This website has been temporarily disabled.
          <br />
          Please contact the website owner for more information.
        </p>
      </div>
    </div>
  );
}
