import { connectDB, isDbConfigured } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { parseISO } from "date-fns";

function overlapFilter(
  roomSlug: string,
  checkInISO: string,
  checkOutISO: string,
  excludeBookingId?: string,
) {
  const checkIn = parseISO(checkInISO);
  const checkOut = parseISO(checkOutISO);
  const now = new Date();

  return {
    roomSlug,
    $or: [
      { status: "confirmed" as const },
      { status: "pending" as const, pendingExpiresAt: { $gt: now } },
    ],
    ...(excludeBookingId ? { _id: { $ne: excludeBookingId } } : {}),
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  };
}

/** Count bookings blocking inventory for [checkIn, checkOut). */
export async function countOverlappingBookings(
  roomSlug: string,
  checkInISO: string,
  checkOutISO: string,
  excludeBookingId?: string,
): Promise<number> {
  if (!isDbConfigured()) {
    if (process.env.NODE_ENV === "production") return Number.MAX_SAFE_INTEGER;
    return 0;
  }
  await connectDB();
  return BookingModel.countDocuments(
    overlapFilter(roomSlug, checkInISO, checkOutISO, excludeBookingId),
  );
}

/** Returns true if at least one unit is free for the date range. */
export async function isRoomAvailable(
  roomSlug: string,
  checkInISO: string,
  checkOutISO: string,
  inventory: number,
  excludeBookingId?: string,
): Promise<boolean> {
  if (inventory <= 0) return false;
  const booked = await countOverlappingBookings(
    roomSlug,
    checkInISO,
    checkOutISO,
    excludeBookingId,
  );
  return booked < inventory;
}

export async function getUnitsAvailable(
  roomSlug: string,
  checkInISO: string,
  checkOutISO: string,
  inventory: number,
  excludeBookingId?: string,
): Promise<number> {
  if (inventory <= 0) return 0;
  const booked = await countOverlappingBookings(
    roomSlug,
    checkInISO,
    checkOutISO,
    excludeBookingId,
  );
  return Math.max(0, inventory - booked);
}
