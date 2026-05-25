import type { MetadataRoute } from "next";
import { getRooms } from "@/lib/rooms";

function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    if (process.env.NODE_ENV === "production") {
      console.warn("NEXT_PUBLIC_SITE_URL is missing; sitemap is using localhost fallback.");
    }
    return "http://localhost:3000";
  }
  return raw.includes("://") ? raw : `https://${raw}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const staticRoutes = [
    "",
    "/rooms",
    "/book",
    "/banquet",
    "/gallery",
    "/dining",
    "/location",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const rooms = await getRooms();
  const roomRoutes = rooms.map((room) => ({
    url: `${base}/rooms/${room.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...roomRoutes];
}
