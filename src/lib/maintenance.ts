/**
 * Production maintenance / payment lock.
 * Toggle only via env — no code changes required:
 *   MAINTENANCE_MODE=true  → site locked (503)
 *   MAINTENANCE_MODE=false → site operates normally
 */
export const MAINTENANCE_RETRY_AFTER_SECONDS = 86400;

export const MAINTENANCE_ROBOTS_HEADER = "noindex, nofollow";

/** Paths that must remain reachable while the rest of the site is locked. */
export const MAINTENANCE_ALLOWLIST = [
  "/maintenance",
  "/favicon.ico",
  "/robots.txt",
] as const;

/**
 * True only when MAINTENANCE_MODE is the string "true" (case-insensitive).
 * Undefined, empty, "false", or any other value leaves the site online.
 */
export function isMaintenanceMode(): boolean {
  return process.env.MAINTENANCE_MODE?.trim().toLowerCase() === "true";
}

export function maintenanceResponseHeaders(): HeadersInit {
  return {
    "Retry-After": String(MAINTENANCE_RETRY_AFTER_SECONDS),
    "X-Robots-Tag": MAINTENANCE_ROBOTS_HEADER,
    "Cache-Control": "no-store, no-cache, must-revalidate",
  };
}

/** Static assets the maintenance page needs (logo, icons). Not rewritten. */
export function isMaintenanceStaticAsset(pathname: string): boolean {
  if (pathname.startsWith("/_next/static") || pathname.startsWith("/_next/image")) {
    return true;
  }
  return /\.(?:png|jpe?g|gif|webp|avif|svg|ico|woff2?)$/i.test(pathname);
}
