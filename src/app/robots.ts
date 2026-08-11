import type { MetadataRoute } from "next";
import { isMaintenanceMode } from "@/lib/maintenance";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();

  if (isMaintenanceMode()) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
      host: base,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/maintenance"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
