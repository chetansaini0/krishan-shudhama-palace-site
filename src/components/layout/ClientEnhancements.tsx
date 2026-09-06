"use client";

import dynamic from "next/dynamic";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { OfferPopup } from "@/components/marketing/OfferPopup";

const SmoothScroll = dynamic(
  () => import("@/components/effects/SmoothScroll").then((m) => m.SmoothScroll),
  { ssr: false },
);

export function ClientEnhancements() {
  return (
    <>
      <SmoothScroll />
      <OfferPopup />
      <CookieConsent />
    </>
  );
}
