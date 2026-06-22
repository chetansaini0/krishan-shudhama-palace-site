import { NextResponse } from "next/server";
import { z } from "zod";
import { hotelOpsEmail } from "@/lib/hotel-email";
import bcrypt from "bcryptjs";
import { createAdminToken } from "@/lib/auth";
import { getClientIp } from "@/lib/request";
import { checkRateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/csrf";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const csrf = enforceSameOrigin(req);
  if (csrf) return csrf;

  const ip = getClientIp(req);
  const gate = checkRateLimit(`admin-login:${ip}`, 5, 60_000);
  if (!gate.ok) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait and try again." },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const adminEmail = hotelOpsEmail();
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const plain = process.env.ADMIN_PASSWORD;
  const isProd = process.env.NODE_ENV === "production";

  if (!adminEmail) {
    return NextResponse.json(
      { error: "Admin not configured (hotel email)" },
      { status: 503 },
    );
  }

  if (parsed.data.email !== adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isProd && !hash) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD_HASH is required in production" },
      { status: 503 },
    );
  }

  let ok = false;
  if (hash) {
    ok = await bcrypt.compare(parsed.data.password, hash);
  } else if (!isProd && plain) {
    ok = parsed.data.password === plain;
  } else {
    return NextResponse.json(
      { error: "Set ADMIN_PASSWORD_HASH (or ADMIN_PASSWORD for local dev only)" },
      { status: 503 },
    );
  }

  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await createAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set("ksp_admin", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 48,
  });
  return res;
}
