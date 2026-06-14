import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { getRooms } from "@/lib/rooms";
import { siteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const staticRoutes = [
    "",
    "/about",
    "/rooms",
    "/amenities",
    "/book",
    "/banquet",
    "/gallery",
    "/dining",
    "/location",
    "/contact",
    "/faq",
    "/blog",
    "/testimonials",
    "/privacy",
    "/terms",
    "/cancellation",
    "/cookies",
    "/disclaimer",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority:
      path === ""
        ? 1
        : ["/privacy", "/terms", "/cancellation", "/cookies", "/disclaimer"].includes(path)
          ? 0.3
          : 0.7,
  }));

  const rooms = await getRooms();
  const roomRoutes = rooms.map((room) => ({
    url: `${base}/rooms/${room.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...roomRoutes, ...blogRoutes];
}
