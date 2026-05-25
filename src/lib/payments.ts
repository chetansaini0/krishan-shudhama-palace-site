import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { BookingModel, type BookingDocument } from "@/models/Booking";
import { notifyBookingConfirmed } from "@/lib/notifications";
import { rupeesToPaise } from "@/lib/pricing";

export function verifyRazorpayCheckoutSignature(input: {
  orderId: string;
  paymentId: string;
  signature: string;
  keySecret: string;
}): boolean {
  const payload = `${input.orderId}|${input.paymentId}`;
  const expected = crypto
    .createHmac("sha256", input.keySecret)
    .update(payload)
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");
  const gotBuf = Buffer.from(input.signature, "utf8");
  return (
    expectedBuf.length === gotBuf.length &&
    crypto.timingSafeEqual(expectedBuf, gotBuf)
  );
}

export function verifyRazorpayWebhookSignature(input: {
  rawBody: string;
  signature: string;
  webhookSecret: string;
}): boolean {
  const expected = crypto
    .createHmac("sha256", input.webhookSecret)
    .update(input.rawBody)
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");
  const gotBuf = Buffer.from(input.signature, "utf8");
  return (
    expectedBuf.length === gotBuf.length &&
    crypto.timingSafeEqual(expectedBuf, gotBuf)
  );
}

export async function finalizePaidBooking(input: {
  bookingId: string;
  orderId: string;
  paymentId: string;
  signature?: string;
  amountPaise?: number;
  currency?: string;
  source: "verify" | "webhook";
}): Promise<
  | { ok: true; status: BookingDocument["status"]; idempotent: boolean }
  | { ok: false; status: number; error: string }
> {
  await connectDB();
  const booking = await BookingModel.findById(input.bookingId);
  if (!booking) {
    return { ok: false, status: 404, error: "Booking not found" };
  }
  if (booking.razorpayOrderId && booking.razorpayOrderId !== input.orderId) {
    return { ok: false, status: 400, error: "Booking mismatch" };
  }

  if (typeof input.amountPaise === "number") {
    const expectedAmount = rupeesToPaise(booking.totalAmount);
    if (expectedAmount !== input.amountPaise) {
      return { ok: false, status: 400, error: "Amount mismatch" };
    }
  }
  if (
    typeof input.currency === "string" &&
    booking.currency &&
    input.currency !== booking.currency
  ) {
    return { ok: false, status: 400, error: "Currency mismatch" };
  }

  const alreadyConfirmed =
    booking.status === "confirmed" &&
    booking.razorpayPaymentId === input.paymentId;
  if (alreadyConfirmed) {
    return { ok: true, status: booking.status, idempotent: true };
  }

  booking.razorpayOrderId = input.orderId;
  booking.razorpayPaymentId = input.paymentId;
  if (input.signature) booking.razorpaySignature = input.signature;
  booking.status = "confirmed";
  booking.paymentStatus = "captured";
  booking.paymentVerifiedAt = new Date();
  booking.pendingExpiresAt = undefined;
  await booking.save();

  if (!booking.notificationsSentAt) {
    void notifyBookingConfirmed(booking);
    booking.notificationsSentAt = new Date();
    await booking.save();
  }

  return { ok: true, status: booking.status, idempotent: false };
}
