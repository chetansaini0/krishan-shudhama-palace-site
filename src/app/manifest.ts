import type { MetadataRoute } from "next";
import { HOTEL } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: HOTEL.name,
    short_name: HOTEL.shortName,
    description: HOTEL.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a1628",
    theme_color: "#0a1628",
    lang: "en-IN",
    categories: ["travel", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
