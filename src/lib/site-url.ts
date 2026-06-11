/** Shared site URL helper for metadata, sitemap, robots, and JSON-LD. */
export function siteUrl(fallback = "http://localhost:3000"): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.includes("://") ? configured : `https://${configured}`;
  }

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    return `https://${vercelHost}`;
  }

  return fallback;
}

export function metadataBaseUrl(): URL {
  try {
    return new URL(siteUrl());
  } catch {
    return new URL("http://localhost:3000");
  }
}
