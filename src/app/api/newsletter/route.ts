import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB, isDbConfigured } from "@/lib/db";
import { NewsletterSubscriberModel } from "@/models/NewsletterSubscriber";
import { getClientIp } from "@/lib/request";
import { checkRateLimit } from "@/lib/rate-limit";

const Body = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const gate = checkRateLimit(`newsletter:${ip}`, 10, 60_000);
  if (!gate.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ ok: true, message: "Subscribed (demo mode)." });
  }

  await connectDB();
  await NewsletterSubscriberModel.updateOne(
    { email: parsed.data.email.toLowerCase() },
    { $set: { email: parsed.data.email.toLowerCase(), active: true } },
    { upsert: true },
  );

  return NextResponse.json({ ok: true, message: "Subscribed successfully." });
}
