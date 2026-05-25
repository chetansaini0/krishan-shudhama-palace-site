import { connectDB, isDbConfigured } from "@/lib/db";
import { RoomModel } from "@/models/Room";
import { STATIC_ROOMS, type RoomPublic } from "@/data/static-rooms";

export async function getRooms(): Promise<RoomPublic[]> {
  if (!isDbConfigured()) {
    return STATIC_ROOMS;
  }
  try {
    await connectDB();
    const count = await RoomModel.countDocuments();
    if (count === 0) {
      await RoomModel.insertMany(
        STATIC_ROOMS.map((r) => ({
          ...r,
          active: true,
        })),
      );
    }
    const docs = await RoomModel.find({ active: true }).lean();
    if (docs.length === 0) return STATIC_ROOMS;
    return docs.map(
      (d): RoomPublic => ({
        slug: d.slug,
        name: d.name,
        category: d.category,
        tagline: d.tagline,
        description: d.description,
        images: d.images,
        amenities: d.amenities,
        basePrice: d.basePrice,
        weekendMultiplier: d.weekendMultiplier,
        maxGuests: d.maxGuests,
        sizeSqFt: d.sizeSqFt,
      }),
    );
  } catch {
    return STATIC_ROOMS;
  }
}

export async function getRoomBySlug(slug: string): Promise<RoomPublic | null> {
  const list = await getRooms();
  return list.find((r) => r.slug === slug) ?? null;
}
