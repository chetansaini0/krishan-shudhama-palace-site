"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  readCookieConsent,
  subscribeCookieConsent,
  writeCookieConsent,
} from "@/lib/cookie-consent";

export function CookieConsent() {
  const consent = useSyncExternalStore(
    subscribeCookieConsent,
    readCookieConsent,
    () => null,
  );

  if (consent !== null) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[110] border-t border-ivory/10 bg-navy/95 px-4 py-4 shadow-[0_-12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md sm:px-6"
      role="dialog"
      aria-labelledby="ksp-cookie-title"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p id="ksp-cookie-title" className="text-sm font-medium text-ivory">
            We value your privacy
          </p>
          <p className="mt-1 text-sm text-ivory/60">
            We use essential cookies for booking and security. Analytics load only
            with your consent.{" "}
            <Link href="/cookies" className="text-gold underline-offset-2 hover:underline">
              Cookie policy
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => writeCookieConsent("declined")}
            className="rounded-full border border-ivory/20 px-4 py-2 text-sm text-ivory/80 transition hover:border-ivory/40 hover:text-ivory"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => writeCookieConsent("accepted")}
            className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-navy transition hover:bg-gold/90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
