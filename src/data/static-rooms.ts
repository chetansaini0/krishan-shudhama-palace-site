import { SPIRITUAL_IMAGES } from "@/lib/spiritual-media";

export type RoomPublic = {
  slug: string;
  name: string;
  category: "deluxe" | "suite" | "executive";
  tagline: string;
  description: string;
  images: string[];
  amenities: string[];
  basePrice: number;
  weekendMultiplier: number;
  maxGuests: number;
  sizeSqFt?: number;
  inventory: number;
  /** Physical hotel room numbers for this category. */
  roomNumbers?: string[];
  comingSoon?: boolean;
};

export function isRoomBookable(room: RoomPublic): boolean {
  return !room.comingSoon;
}

export const STATIC_ROOMS: RoomPublic[] = [
  {
    slug: "deluxe-king",
    name: "Deluxe King",
    category: "deluxe",
    tagline: "Serene comfort with palace-inspired detailing",
    description:
      "Wake up to soft daylight over curated interiors. Deluxe King rooms blend handcrafted accents with whisper-quiet climate control for restorative stays.",
    images: [
      "/images/rooms/deluxe-king-main.png",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974&auto=format&fit=crop",
    ],
    amenities: [
      "King bed with premium linens",
      "Rain shower & luxury bath amenities",
      "Smart TV & high-speed Wi‑Fi",
      "In-room dining",
      "Daily housekeeping",
    ],
    basePrice: 1500,
    weekendMultiplier: 1.15,
    maxGuests: 2,
    sizeSqFt: 340,
    inventory: 6,
    roomNumbers: ["101", "102", "103", "104", "105", "106"],
  },
  {
    slug: "royal-suite",
    name: "Royal Suite",
    category: "suite",
    tagline: "Expansive living for elevated stays",
    description:
      "A separate living area, refined dining nook, and panoramic views create an unmistakably residential feel — ideal for extended visits and quiet evenings in.",
    images: [
      "/images/rooms/royal-suite-main.png",
      SPIRITUAL_IMAGES.luxuryInterior,
    ],
    amenities: [
      "Separate living & bedroom",
      "Butler-on-call (on request)",
      "Deep soaking tub",
      "Premium minibar",
      "Airport transfers (select packages)",
    ],
    basePrice: 2500,
    weekendMultiplier: 1.2,
    maxGuests: 4,
    sizeSqFt: 720,
    inventory: 2,
    roomNumbers: ["107", "108"],
  },
  {
    slug: "executive-club",
    name: "Executive Club",
    category: "executive",
    tagline: "Productivity-first layout with club privileges",
    description:
      "Designed for leaders on the move: ergonomic workspace, expedited service, and exclusive club lounge access for seamless business + leisure.",
    images: [
      "/images/rooms/executive-club-main.png",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop",
    ],
    amenities: [
      "Executive lounge access",
      "Ergonomic workstation",
      "Complimentary pressing (2 garments)",
      "Late checkout (subject to availability)",
      "Meeting room credit (packages)",
    ],
    basePrice: 0,
    weekendMultiplier: 1.18,
    maxGuests: 3,
    sizeSqFt: 420,
    inventory: 0,
    roomNumbers: [],
    comingSoon: true,
  },
];
