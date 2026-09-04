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

export async function listOverlappingBookings(
  roomSlug: string,
  checkInISO: string,
  checkOutISO: string,
  excludeBookingId?: string,
): Promise<{ assignedRoomNumber?: string }[]> {
  if (!isDbConfigured()) return [];
  await connectDB();
  return BookingModel.find(overlapFilter(roomSlug, checkInISO, checkOutISO, excludeBookingId))
    .select("assignedRoomNumber")
    .lean();
}

/** First free physical room number for this category and stay. */
export async function assignRoomNumber(input: {
  roomSlug: string;
  roomNumbers: string[];
  checkIn: Date;
  checkOut: Date;
  excludeBookingId?: string;
}): Promise<string | undefined> {
  const numbers = input.roomNumbers.filter(Boolean);
  if (numbers.length === 0) return undefined;

  const overlapping = await listOverlappingBookings(
    input.roomSlug,
    input.checkIn.toISOString(),
    input.checkOut.toISOString(),
    input.excludeBookingId,
  );
  const taken = new Set(
    overlapping
      .map((b) => b.assignedRoomNumber)
      .filter((n): n is string => Boolean(n)),
  );
  const anonymous = overlapping.filter((b) => !b.assignedRoomNumber).length;
  const free = numbers.filter((n) => !taken.has(n));
  return free[anonymous];
}

export async function listRoomNumberStatus(
  roomSlug: string,
  roomNumbers: string[],
  checkIn: Date,
  checkOut: Date,
): Promise<{ number: string; booked: boolean }[]> {
  const overlapping = await listOverlappingBookings(
    roomSlug,
    checkIn.toISOString(),
    checkOut.toISOString(),
  );
  const taken = new Set(
    overlapping
      .map((b) => b.assignedRoomNumber)
      .filter((n): n is string => Boolean(n)),
  );
  let anonymousLeft = overlapping.filter((b) => !b.assignedRoomNumber).length;
  return roomNumbers.map((number) => {
    if (taken.has(number)) return { number, booked: true };
    if (anonymousLeft > 0) {
      anonymousLeft -= 1;
      return { number, booked: true };
    }
    return { number, booked: false };
  });
}
