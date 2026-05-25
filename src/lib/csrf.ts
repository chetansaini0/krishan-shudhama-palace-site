import { NextResponse } from "next/server";

function normalizeOrigin(raw: string): string | null {
  const cleaned = raw.trim();
  if (!cleaned) return null;
  const withProtocol = cleaned.includes("://") ? cleaned : `https://${cleaned}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

function requestHostOrigin(req: Request): string | null {
  const host = req.headers.get("host");
  if (!host) return null;
  const proto =
    req.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}

function allowedOrigins(req: Request): Set<string> {
  const allowed = new Set<string>();

  // Always allow request host origin so preview/custom domains and mobile access work.
  const requestOrigin = requestHostOrigin(req);
  if (requestOrigin) allowed.add(requestOrigin);

  const configuredSite = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredSite) {
    const normalized = normalizeOrigin(configuredSite);
    if (normalized) allowed.add(normalized);
  }

  // Optional extra allow-list for multi-domain deployments.
  const extra = process.env.ALLOWED_ORIGINS?.split(",") ?? [];
  for (const item of extra) {
    const normalized = normalizeOrigin(item);
    if (normalized) allowed.add(normalized);
  }

  return allowed;
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
  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin) {
    return NextResponse.json({ error: "Invalid origin format" }, { status: 403 });
  }
  const allowed = allowedOrigins(req);
  if (allowed.size > 0 && !allowed.has(normalizedOrigin)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  return null;
}
