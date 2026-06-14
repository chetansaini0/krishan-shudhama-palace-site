import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB, isDbConfigured } from "@/lib/db";
import { EventInquiryModel } from "@/models/EventInquiry";
import { getClientIp, isJsonRequest } from "@/lib/request";
import { checkRateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/csrf";

const Body = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  eventType: z.string().min(2),
  guestCount: z.number().int().min(1),
  eventDate: z.string().optional(),
  preferredDate: z.string().optional(),
  message: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
  notes: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
  website: z.string().optional(),
});

export async function POST(req: Request) {
  const csrf = enforceSameOrigin(req);
  if (csrf) return csrf;

  if (!isJsonRequest(req)) {
    return NextResponse.json({ error: "Expected JSON payload" }, { status: 415 });
  }

  const ip = getClientIp(req);
  const gate = checkRateLimit(`event-inquiry:${ip}`, 8, 60_000);
  if (!gate.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form fields" }, { status: 400 });
  }
  const d = parsed.data;
  if (d.website && d.website.trim().length > 0) {
    return NextResponse.json({
      ok: true,
      id: "filtered",
      message: "Received. Our events team will contact you shortly.",
    });
  }

  if (!isDbConfigured()) {
    console.info("[event inquiry demo]", d);
    return NextResponse.json({
      ok: true,
      id: "demo",
      message: "Received. Our events team will contact you shortly.",
    });
  }

  await connectDB();
  const doc = await EventInquiryModel.create({
    name: d.name,
    email: d.email,
    phone: d.phone,
    eventType: d.eventType,
    guestCount: d.guestCount,
    eventDate: d.eventDate
      ? new Date(d.eventDate)
      : d.preferredDate
        ? new Date(d.preferredDate)
        : undefined,
    message: d.message ?? d.notes ?? "Event inquiry submitted from website.",
    status: "new",
  });

  return NextResponse.json({
    ok: true,
    id: String(doc._id),
    message: "Thank you — our banquet specialists will reach out within 24 hours.",
  });
}
