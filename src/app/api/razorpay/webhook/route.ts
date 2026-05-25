import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import {
  finalizePaidBooking,
  verifyRazorpayWebhookSignature,
} from "@/lib/payments";

type RazorpayWebhookPayload = {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        amount?: number;
        currency?: string;
        notes?: { bookingId?: string };
      };
    };
  };
};

export async function POST(req: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 503 },
    );
  }
  if (!isDbConfigured() && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Database is required in production for payment webhooks" },
      { status: 503 },
    );
  }
  if (!isDbConfigured()) return NextResponse.json({ ok: true, demo: true });

  const signature = req.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  const valid = verifyRazorpayWebhookSignature({
    rawBody,
    signature,
    webhookSecret,
  });
  if (!valid) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  let payload: RazorpayWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as RazorpayWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }

  const event = payload.event;
  if (event !== "payment.captured" && event !== "order.paid") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const payment = payload.payload?.payment?.entity;
  const bookingId = payment?.notes?.bookingId;
  const orderId = payment?.order_id;
  const paymentId = payment?.id;
  if (!bookingId || !orderId || !paymentId) {
    return NextResponse.json({ error: "Missing booking/payment metadata" }, { status: 400 });
  }

  const finalized = await finalizePaidBooking({
    bookingId,
    orderId,
    paymentId,
    amountPaise: payment.amount,
    currency: payment.currency,
    source: "webhook",
  });
  if (!finalized.ok) {
    return NextResponse.json({ error: finalized.error }, { status: finalized.status });
  }

  return NextResponse.json({
    ok: true,
    status: finalized.status,
    idempotent: finalized.idempotent,
  });
}
