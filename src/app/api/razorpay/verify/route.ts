import { NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";
import { isDbConfigured } from "@/lib/db";
import { getClientIp } from "@/lib/request";
import { checkRateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/csrf";
import {
  finalizePaidBooking,
  verifyRazorpayCheckoutSignature,
} from "@/lib/payments";

const Body = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  bookingId: z.string(),
});

export async function POST(req: Request) {
  const csrf = enforceSameOrigin(req);
  if (csrf) return csrf;

  const ip = getClientIp(req);
  const gate = checkRateLimit(`razorpay-verify:${ip}`, 20, 60_000);
  if (!gate.ok) {
    return NextResponse.json(
      { error: "Too many verification attempts. Please retry shortly." },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } },
    );
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Gateway not configured" }, { status: 503 });
  }

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } =
    parsed.data;

  const validSig = verifyRazorpayCheckoutSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
    keySecret,
  });

  if (!validSig) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (!isDbConfigured() && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Database is required in production for payment verification" },
      { status: 503 },
    );
  }
  if (!isDbConfigured()) return NextResponse.json({ ok: true, demo: true });

  try {
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const payment = await rzp.payments.fetch(razorpay_payment_id);
    if (payment.status !== "captured") {
      return NextResponse.json({ error: "Payment is not captured yet" }, { status: 409 });
    }
    if (payment.order_id !== razorpay_order_id) {
      return NextResponse.json({ error: "Payment order mismatch" }, { status: 400 });
    }

    const finalized = await finalizePaidBooking({
      bookingId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amountPaise:
        typeof payment.amount === "number" ? payment.amount : Number(payment.amount),
      currency: String(payment.currency),
      source: "verify",
    });
    if (!finalized.ok) {
      return NextResponse.json({ error: finalized.error }, { status: finalized.status });
    }

    return NextResponse.json({
      ok: true,
      status: finalized.status,
      idempotent: finalized.idempotent,
    });
  } catch (error) {
    console.error("[razorpay verify] unexpected error", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
