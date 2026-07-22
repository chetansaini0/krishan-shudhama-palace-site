const STORAGE_KEY = "ksp_cookie_consent";

export type CookieConsentValue = "accepted" | "declined";

type ConsentListener = () => void;

const listeners = new Set<ConsentListener>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function readCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "accepted" || value === "declined") return value;
  } catch {
    /* ignore storage errors */
  }
  return null;
}

export function writeCookieConsent(value: CookieConsentValue) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* ignore storage errors */
  }
  notify();
}

export function subscribeCookieConsent(listener: ConsentListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
