import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB, isDbConfigured } from "@/lib/db";
import { EventInquiryModel } from "@/models/EventInquiry";
import { requireAdmin } from "@/lib/admin-api";
import { enforceSameOrigin } from "@/lib/csrf";

const Patch = z.object({
  status: z.enum(["new", "quoted", "won", "lost"]).optional(),
  adminNotes: z.string().optional(),
  quotedAmount: z.number().optional(),
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
  const inquiry = await EventInquiryModel.findByIdAndUpdate(id, parsed.data, {
    new: true,
  });
  if (!inquiry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
