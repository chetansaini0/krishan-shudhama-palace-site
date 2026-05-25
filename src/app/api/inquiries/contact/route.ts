import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB, isDbConfigured } from "@/lib/db";
import { ContactInquiryModel } from "@/models/ContactInquiry";
import { getClientIp } from "@/lib/request";
import { checkRateLimit } from "@/lib/rate-limit";

const Body = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  message: z.string().min(10),
  email: z.string().email().optional(),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const gate = checkRateLimit(`contact:${ip}`, 10, 60_000);
  if (!gate.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  }

  if (isDbConfigured()) {
    await connectDB();
    await ContactInquiryModel.create({
      ...parsed.data,
      source: "website",
      status: "new",
    });
  } else {
    console.info("[contact inquiry demo]", parsed.data);
  }

  return NextResponse.json({
    ok: true,
    message: "Thank you for reaching out. Our concierge will respond shortly.",
  });
}
