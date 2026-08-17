import { NextResponse } from "next/server";
import { z } from "zod";
import { isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";
import { enforceSameOrigin } from "@/lib/csrf";
import { refundPaidBooking } from "@/lib/payments";

const Body = z.object({
  reason: z.string().max(200).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const csrf = enforceSameOrigin(req);
  if (csrf) return csrf;

  const denied = await requireAdmin();
  if (denied) return denied;

  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const json = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { id } = await params;
  const result = await refundPaidBooking({
    bookingId: id,
    reason: parsed.data.reason,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    ok: true,
    refundId: result.refundId,
    status: result.status,
  });
}
