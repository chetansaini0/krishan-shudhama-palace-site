import { NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";
import { connectDB, isDbConfigured } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { rupeesToPaise } from "@/lib/pricing";
import { getClientIp } from "@/lib/request";
import { checkRateLimit } from "@/lib/rate-limit";

const Body = z.object({
  bookingId: z.string().min(1),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const gate = checkRateLimit(`razorpay-order:${ip}`, 10, 60_000);
  if (!gate.ok) {
    return NextResponse.json(
      { error: "Too many payment requests. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } },
    );
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      {
        error: "Payment gateway not configured",
        hint: "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET",
      },
      { status: 503 },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!isDbConfigured() && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Database required in production for payments" },
      { status: 503 },
    );
  }
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Database required for payments" },
      { status: 503 },
    );
  }

  try {
    await connectDB();
    const booking = await BookingModel.findById(parsed.data.bookingId);
    if (!booking || booking.status !== "pending") {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    if (
      booking.pendingExpiresAt &&
      booking.pendingExpiresAt.getTime() <= Date.now()
    ) {
      booking.status = "failed";
      booking.paymentStatus = "failed";
      await booking.save();
      return NextResponse.json(
        { error: "Booking payment window expired. Please create a new booking." },
        { status: 409 },
      );
    }

    const amountPaise = rupeesToPaise(booking.totalAmount);
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await rzp.orders.create({
      amount: amountPaise,
      currency: booking.currency || "INR",
      receipt: String(booking._id).slice(-12),
      notes: {
        bookingId: String(booking._id),
        guest: booking.guestName,
      },
    });

    booking.razorpayOrderId = order.id;
    booking.pendingExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await booking.save();

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      bookingId: String(booking._id),
    });
  } catch (error) {
    console.error("[razorpay create-order] unexpected error", error);
    return NextResponse.json({ error: "Unable to create order" }, { status: 500 });
  }
}
