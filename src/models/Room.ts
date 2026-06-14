import mongoose, { Schema, type Model, type Types } from "mongoose";
import type { RoomPublic } from "@/data/static-rooms";

export type RoomDocument = {
  _id: Types.ObjectId;
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
  active: boolean;
  comingSoon?: boolean;
};

const RoomSchema = new Schema<RoomDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["deluxe", "suite", "executive"],
      required: true,
    },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    basePrice: { type: Number, required: true },
    weekendMultiplier: { type: Number, default: 1 },
    maxGuests: { type: Number, required: true },
    sizeSqFt: { type: Number },
    inventory: { type: Number, default: 1, min: 0 },
    active: { type: Boolean, default: true },
    comingSoon: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const RoomModel: Model<RoomDocument> =
  mongoose.models.Room ?? mongoose.model<RoomDocument>("Room", RoomSchema);

export function roomDocToPublic(doc: RoomDocument): RoomPublic {
  return {
    slug: doc.slug,
    name: doc.name,
    category: doc.category,
    tagline: doc.tagline,
    description: doc.description,
    images: doc.images,
    amenities: doc.amenities,
    basePrice: doc.basePrice,
    weekendMultiplier: doc.weekendMultiplier,
    maxGuests: doc.maxGuests,
    sizeSqFt: doc.sizeSqFt,
    inventory: doc.inventory ?? 1,
    comingSoon: doc.comingSoon ?? false,
  };
}
