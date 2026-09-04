import { connectDB, isDbConfigured } from "@/lib/db";
import { RoomModel } from "@/models/Room";
import { STATIC_ROOMS, type RoomPublic } from "@/data/static-rooms";

const STATIC_BY_SLUG = Object.fromEntries(STATIC_ROOMS.map((r) => [r.slug, r]));
let catalogSynced = false;

function sameNumbers(a: string[] | undefined, b: string[] | undefined): boolean {
  const left = a ?? [];
  const right = b ?? [];
  return left.length === right.length && left.every((n, i) => n === right[i]);
}

/** Keep catalog prices and availability flags aligned with static source data. */
function applyCatalogOverrides(room: RoomPublic): RoomPublic {
  const ref = STATIC_BY_SLUG[room.slug];
  if (!ref) return room;
  return {
    ...room,
    basePrice: ref.basePrice,
    inventory: ref.inventory,
    roomNumbers: ref.roomNumbers ?? room.roomNumbers ?? [],
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
      catalogSynced = true;
    }
    let docs = await RoomModel.find({ active: true }).lean();
    if (!catalogSynced) {
      for (const ref of STATIC_ROOMS) {
        const current = docs.find((d) => d.slug === ref.slug);
        if (
          !current ||
          current.inventory !== ref.inventory ||
          !sameNumbers(current.roomNumbers, ref.roomNumbers) ||
          Boolean(current.comingSoon) !== Boolean(ref.comingSoon)
        ) {
          await RoomModel.updateOne(
            { slug: ref.slug },
            {
              $set: {
                inventory: ref.inventory,
                roomNumbers: ref.roomNumbers ?? [],
                comingSoon: ref.comingSoon ?? false,
              },
            },
            { upsert: false },
          );
        }
      }
      catalogSynced = true;
      docs = await RoomModel.find({ active: true }).lean();
    }
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
          roomNumbers: d.roomNumbers ?? [],
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

/** Guest-facing catalog — excludes rooms marked comingSoon. */
export function getPublicRooms(rooms: RoomPublic[]): RoomPublic[] {
  return rooms.filter((r) => !r.comingSoon);
}

export function getBookableRooms(rooms: RoomPublic[]): RoomPublic[] {
  return rooms.filter((r) => !r.comingSoon);
}
