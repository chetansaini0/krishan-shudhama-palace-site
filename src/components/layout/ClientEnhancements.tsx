"use client";

import { CookieConsent } from "@/components/layout/CookieConsent";
import { OfferPopup } from "@/components/marketing/OfferPopup";

export function ClientEnhancements() {
  return (
    <>
      <OfferPopup />
      <CookieConsent />
    </>
  );
}
