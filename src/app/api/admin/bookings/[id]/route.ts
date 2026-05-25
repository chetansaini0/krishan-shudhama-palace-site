import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB, isDbConfigured } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { requireAdmin } from "@/lib/admin-api";
import { enforceSameOrigin } from "@/lib/csrf";

const Patch = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "failed"]),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const csrf = enforceSameOrigin(req);
  if (csrf) return csrf;

  const denied = await requireAdmin();
  if (denied) return denied;

  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const json = await req.json().catch(() => null);
  const parsed = Patch.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  await connectDB();
  const { id } = await params;
  const booking = await BookingModel.findByIdAndUpdate(
    id,
    { status: parsed.data.status },
    { new: true },
  );
  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, status: booking.status });
}
