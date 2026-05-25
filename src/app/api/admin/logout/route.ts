import { NextResponse } from "next/server";
import { enforceSameOrigin } from "@/lib/csrf";

export async function POST(req: Request) {
  const csrf = enforceSameOrigin(req);
  if (csrf) return csrf;

  const res = NextResponse.json({ ok: true });
  res.cookies.set("ksp_admin", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
