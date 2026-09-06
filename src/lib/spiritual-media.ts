/**
 * Hero / spiritual media. Defaults restore the original cinematic Unsplash + Pexels hero.
 * Override via NEXT_PUBLIC_HERO_POSTER_URL / NEXT_PUBLIC_HERO_VIDEO_URL when property media is ready.
 */
export const SPIRITUAL_IMAGES = {
  lampsWarmth:
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1400&auto=format&fit=crop",
  indiaHeritageFacade:
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1400&auto=format&fit=crop",
  palaceSuiteDetail:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400&auto=format&fit=crop",
  refinedLobby:
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1400&auto=format&fit=crop",
  resortEvening:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400&auto=format&fit=crop",
  calmBedroom:
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1400&auto=format&fit=crop",
  hospitalityLobby:
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1400&auto=format&fit=crop",
  luxuryInterior: "/images/our-story-room.png",
} as const;

/** Landscape preferred for hero; vertical clips work with object-cover in secondary blocks. */
export const SPIRITUAL_VIDEOS = {
  /** Soft floating light — calm, temple-adjacent mood */
  cinematicParticles:
    "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4",
  /** Forest path — contemplative, peaceful */
  forestPathVertical:
    "https://videos.pexels.com/video-files/2499611/2499611-hd_1080_1920_30fps.mp4",
  /** Pool / resort calm (fallback luxury backdrop) */
  resortPool:
    "https://videos.pexels.com/video-files/3214448/3214448-hd_1920_1080_25fps.mp4",
  /** Devotional / festive idol — vertical; ideal for gallery strip */
  devotionalGarland:
    "https://videos.pexels.com/video-files/28620291/12435078_1080_1920_30fps.mp4",
} as const;
