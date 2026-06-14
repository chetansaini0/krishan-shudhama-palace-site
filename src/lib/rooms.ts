import { connectDB, isDbConfigured } from "@/lib/db";
import { RoomModel } from "@/models/Room";
import { STATIC_ROOMS, type RoomPublic } from "@/data/static-rooms";

const STATIC_BY_SLUG = Object.fromEntries(STATIC_ROOMS.map((r) => [r.slug, r]));

/** Keep catalog prices and availability flags aligned with static source data. */
function applyCatalogOverrides(room: RoomPublic): RoomPublic {
  const ref = STATIC_BY_SLUG[room.slug];
  if (!ref) return room;
  return {
    ...room,
    basePrice: ref.basePrice,
    inventory: ref.inventory,
    comingSoon: ref.comingSoon ?? false,
  };
}

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
          comingSoon: r.comingSoon ?? false,
        })),
      );
    }
    const docs = await RoomModel.find({ active: true }).lean();
    if (docs.length === 0) return STATIC_ROOMS;
    return docs.map(
      (d): RoomPublic =>
        applyCatalogOverrides({
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
          inventory: d.inventory ?? 1,
          comingSoon: d.comingSoon ?? false,
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

export function getBookableRooms(rooms: RoomPublic[]): RoomPublic[] {
  return rooms.filter((r) => !r.comingSoon);
}
