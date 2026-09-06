/**
 * Prefer local property photography under /public/images.
 * Remote URLs remain only as documented fallbacks for env overrides.
 */
export const SPIRITUAL_IMAGES = {
  lampsWarmth: "/images/gallery/gallery-dining-hall-mural.png",
  indiaHeritageFacade: "/images/gallery/gallery-dining-hall-rows.png",
  palaceSuiteDetail: "/images/rooms/royal-suite-main.png",
  refinedLobby: "/images/story/discover-restaurant.png",
  resortEvening: "/images/banquet/banquet-hall-main.png",
  calmBedroom: "/images/rooms/deluxe-king-main.png",
  hospitalityLobby: "/images/dining/dining-section-main.png",
  luxuryInterior: "/images/our-story-room.png",
} as const;

/** Self-host clips under /public/video when available; keep empty until then. */
export const SPIRITUAL_VIDEOS = {
  cinematicParticles: "",
  forestPathVertical: "",
  resortPool: "",
  devotionalGarland: "",
} as const;
