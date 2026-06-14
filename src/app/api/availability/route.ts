import { NextResponse } from "next/server";
import { z } from "zod";
import { addDays, isBefore, isValid, parseISO, startOfDay } from "date-fns";
import { getRoomBySlug } from "@/lib/rooms";
import { isRoomAvailable, getUnitsAvailable } from "@/lib/availability";
import { computeStayTotalPaise } from "@/lib/pricing";
import { getClientIp, isJsonRequest } from "@/lib/request";
import { checkRateLimit } from "@/lib/rate-limit";
import { isDbConfigured } from "@/lib/db";
import { enforceSameOrigin } from "@/lib/csrf";

const Body = z.object({
  roomSlug: z.string().min(1),
  checkIn: z.string().datetime({ offset: true }).or(z.string().date()),
  checkOut: z.string().datetime({ offset: true }).or(z.string().date()),
  guests: z.number().int().min(1).max(12),
});

function validateDateWindow(checkInRaw: string, checkOutRaw: string) {
  const checkIn = parseISO(checkInRaw);
  const checkOut = parseISO(checkOutRaw);
  if (!isValid(checkIn) || !isValid(checkOut)) return "Invalid date format";
  if (!isBefore(checkIn, checkOut)) return "Check-out must be after check-in";
  const today = startOfDay(new Date());
  if (isBefore(checkIn, today)) return "Check-in cannot be in the past";
  if (isBefore(addDays(today, 366), checkIn)) {
    return "Bookings are allowed up to 12 months in advance";
  }
  return null;
}

export async function POST(req: Request) {
  const csrf = enforceSameOrigin(req);
  if (csrf) return csrf;

  if (!isJsonRequest(req)) {
    return NextResponse.json({ error: "Expected JSON payload" }, { status: 415 });
  }

  const ip = getClientIp(req);
  const gate = checkRateLimit(`availability:${ip}`, 40, 60_000);
  if (!gate.ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please retry in a moment." },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { roomSlug, checkIn, checkOut, guests } = parsed.data;
  const dateError = validateDateWindow(checkIn, checkOut);
  if (dateError) {
    return NextResponse.json({ error: dateError }, { status: 400 });
  }
  if (!isDbConfigured() && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Availability requires database in production" },
      { status: 503 },
    );
  }
  const room = await getRoomBySlug(roomSlug);
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }
  if (room.comingSoon) {
    return NextResponse.json({ error: "This room is coming soon and cannot be booked yet" }, { status: 403 });
  }
  if (guests > room.maxGuests) {
    return NextResponse.json(
      { error: `Maximum ${room.maxGuests} guests for this room` },
      { status: 400 },
    );
  }
  const available = await isRoomAvailable(roomSlug, checkIn, checkOut, room.inventory);
  const unitsAvailable = available
    ? await getUnitsAvailable(roomSlug, checkIn, checkOut, room.inventory)
    : 0;
  const { nights, totalRupees } = computeStayTotalPaise(
    checkIn,
    checkOut,
    room.basePrice,
    room.weekendMultiplier,
  );
  if (nights <= 0) {
    return NextResponse.json(
      { error: "Invalid date range" },
      { status: 400 },
    );
  }
  return NextResponse.json({
    available,
    unitsAvailable,
    inventory: room.inventory,
    nights,
    totalRupees,
    currency: "INR",
    room: { slug: room.slug, name: room.name },
  });
}
