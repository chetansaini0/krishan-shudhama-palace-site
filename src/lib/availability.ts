import { connectDB, isDbConfigured } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { parseISO } from "date-fns";

/**
 * Returns true if the room is free for [checkIn, checkOut) — checkout exclusive.
 */
export async function isRoomAvailable(
  roomSlug: string,
  checkInISO: string,
  checkOutISO: string,
  excludeBookingId?: string,
): Promise<boolean> {
  if (!isDbConfigured()) {
    // Never permit optimistic availability in production without persistence.
    if (process.env.NODE_ENV === "production") return false;
    return true;
  }
  await connectDB();
  const checkIn = parseISO(checkInISO);
  const checkOut = parseISO(checkOutISO);
  const now = new Date();

  const overlap = await BookingModel.findOne({
    roomSlug,
    $or: [
      { status: "confirmed" },
      { status: "pending", pendingExpiresAt: { $gt: now } },
    ],
    ...(excludeBookingId ? { _id: { $ne: excludeBookingId } } : {}),
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  }).lean();

  return !overlap;
}
