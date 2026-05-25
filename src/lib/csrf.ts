import { NextResponse } from "next/server";

function normalizedSiteOrigin(req: Request): string | null {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    const withProtocol = configured.includes("://")
      ? configured
      : `https://${configured}`;
    try {
      return new URL(withProtocol).origin;
    } catch {
      return null;
    }
  }

  const host = req.headers.get("host");
  if (!host) return null;
  const proto =
    req.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * Basic CSRF mitigation for cookie-auth routes:
 * - Origin must match site origin.
 * - In local development only, missing Origin is tolerated.
 */
export function enforceSameOrigin(req: Request): NextResponse | null {
  const origin = req.headers.get("origin");
  const allowMissingOrigin = process.env.NODE_ENV !== "production";
  if (!origin) {
    if (allowMissingOrigin) return null;
    return NextResponse.json({ error: "Missing origin" }, { status: 403 });
  }
  const siteOrigin = normalizedSiteOrigin(req);
  if (!siteOrigin) return null;

  if (origin !== siteOrigin) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  return null;
}
