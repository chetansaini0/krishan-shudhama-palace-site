import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

/** Returns null when authorized, otherwise an error Response. */
export async function requireAdmin(): Promise<NextResponse | null> {
  const c = await cookies();
  const t = c.get("ksp_admin")?.value;
  if (!t) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const v = await verifyAdminToken(t);
  if (!v) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
