/** Shared site URL helper for metadata, sitemap, robots, and JSON-LD. */
export function siteUrl(fallback = "http://localhost:3000"): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return fallback;
  return raw.includes("://") ? raw : `https://${raw}`;
}

export function metadataBaseUrl(): URL {
  try {
    return new URL(siteUrl());
  } catch {
    return new URL("http://localhost:3000");
  }
}
