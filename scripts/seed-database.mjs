#!/usr/bin/env node
/**
 * Seed MongoDB with default rooms from static-rooms data.
 * Usage: MONGODB_URI="mongodb+srv://..." node scripts/seed-database.mjs
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Set MONGODB_URI environment variable.");
  process.exit(1);
}

const rooms = [
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
    active: true,
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
      "/images/our-story-room.png",
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
    active: true,
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
    active: true,
    comingSoon: true,
  },
];

const RoomSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: String,
    category: String,
    tagline: String,
    description: String,
    images: [String],
    amenities: [String],
    basePrice: Number,
    weekendMultiplier: Number,
    maxGuests: Number,
    sizeSqFt: Number,
    inventory: { type: Number, default: 1 },
    roomNumbers: [String],
    active: { type: Boolean, default: true },
    comingSoon: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Room = mongoose.models.Room ?? mongoose.model("Room", RoomSchema);

await mongoose.connect(MONGODB_URI);
for (const room of rooms) {
  await Room.findOneAndUpdate({ slug: room.slug }, room, { upsert: true, new: true });
  console.log(`✓ ${room.slug}`);
}
console.log("\nDone — 3 rooms seeded.");
await mongoose.disconnect();
