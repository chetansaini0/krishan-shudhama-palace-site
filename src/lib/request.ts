import type { NextRequest } from "next/server";

export function getClientIp(req: Request | NextRequest): string {
  const hdr = req.headers.get("x-forwarded-for");
  if (hdr) {
    return hdr.split(",")[0]?.trim() || "unknown";
  }
  return req.headers.get("x-real-ip") || "unknown";
}
