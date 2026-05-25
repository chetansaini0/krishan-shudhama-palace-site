import { NextResponse } from "next/server";
import { z } from "zod";
import { addDays, isBefore, isValid, parseISO, startOfDay } from "date-fns";
import mongoose from "mongoose";
import { connectDB, isDbConfigured } from "@/lib/db";
import { getRoomBySlug } from "@/lib/rooms";
import { computeStayTotalPaise } from "@/lib/pricing";
import { BookingModel } from "@/models/Booking";
import { getClientIp, isJsonRequest } from "@/lib/request";
import { checkRateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/csrf";

const Body = z.object({
  roomSlug: z.string().min(1).max(80),
  guestName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(8).max(24),
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
  const gate = checkRateLimit(`bookings:${ip}`, 15, 60_000);
  if (!gate.ok) {
    return NextResponse.json(
      { error: "Too many booking attempts. Please retry shortly." },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const data = parsed.data;
  const dateError = validateDateWindow(data.checkIn, data.checkOut);
  if (dateError) {
    return NextResponse.json({ error: dateError }, { status: 400 });
  }

  const room = await getRoomBySlug(data.roomSlug);
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }
  if (data.guests > room.maxGuests) {
    return NextResponse.json({ error: "Too many guests" }, { status: 400 });
  }
  const { nights, totalRupees } = computeStayTotalPaise(
    data.checkIn,
    data.checkOut,
    room.basePrice,
    room.weekendMultiplier,
  );
  if (nights <= 0) {
    return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  }

  if (!isDbConfigured() && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Booking persistence must be configured in production" },
      { status: 503 },
    );
  }
  if (!isDbConfigured()) {
    return NextResponse.json({
      bookingId: "demo-local",
      status: "pending",
      totalRupees,
      nights,
      message:
        "Database not configured — booking not persisted. Set MONGODB_URI for production.",
    });
  }

  try {
    await connectDB();
    const session = await mongoose.startSession();
    let bookingId = "";
    try {
      await session.withTransaction(async () => {
        const checkIn = new Date(data.checkIn);
        const checkOut = new Date(data.checkOut);
        const now = new Date();
        const overlap = await BookingModel.findOne({
          roomSlug: data.roomSlug,
          $or: [
            { status: "confirmed" },
            { status: "pending", pendingExpiresAt: { $gt: now } },
          ],
          checkIn: { $lt: checkOut },
          checkOut: { $gt: checkIn },
        })
          .session(session)
          .lean();
        if (overlap) {
          throw new Error("Room no longer available for these dates");
        }

        const booking = await BookingModel.create(
          [
            {
              roomSlug: data.roomSlug,
              guestName: data.guestName,
              email: data.email.toLowerCase(),
              phone: data.phone,
              checkIn,
              checkOut,
              guests: data.guests,
              nights,
              totalAmount: totalRupees,
              currency: "INR",
              status: "pending",
              paymentStatus: "unpaid",
              pendingExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
            },
          ],
          { session },
        );
        bookingId = String(booking[0]._id);
      });
    } finally {
      await session.endSession();
    }

    return NextResponse.json({
      bookingId,
      status: "pending",
      totalRupees,
      nights,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Room no longer available")) {
      return NextResponse.json(
        { error: "Room no longer available for these dates" },
        { status: 409 },
      );
    }
    console.error("[bookings] unexpected error", error);
    return NextResponse.json({ error: "Unable to create booking" }, { status: 500 });
  }
}
