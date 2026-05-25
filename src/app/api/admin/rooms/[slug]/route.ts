import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB, isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";
import { RoomModel } from "@/models/Room";
import { enforceSameOrigin } from "@/lib/csrf";

const Patch = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
    name: z.string().min(2).optional(),
    category: z.enum(["deluxe", "suite", "executive"]).optional(),
    tagline: z.string().min(2).optional(),
    description: z.string().min(20).optional(),
    images: z.array(z.string().url()).min(1).optional(),
    amenities: z.array(z.string().min(1)).min(1).optional(),
    basePrice: z.number().positive().optional(),
    weekendMultiplier: z.number().min(1).max(3).optional(),
    maxGuests: z.number().int().min(1).max(20).optional(),
    sizeSqFt: z.union([z.number().positive(), z.null()]).optional(),
    active: z.boolean().optional(),
  })
  .strict();

type Params = { params: Promise<{ slug: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const csrf = enforceSameOrigin(req);
  if (csrf) return csrf;

  const denied = await requireAdmin();
  if (denied) return denied;

  if (!isDbConfigured()) {
    return NextResponse.json({ error: "MongoDB required" }, { status: 503 });
  }

  const { slug } = await params;
  const json = await req.json().catch(() => null);
  const parsed = Patch.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  await connectDB();
  const doc = await RoomModel.findOne({ slug });
  if (!doc) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const data = parsed.data;
  if (data.slug !== undefined && data.slug !== slug) {
    const clash = await RoomModel.findOne({ slug: data.slug });
    if (clash) {
      return NextResponse.json({ error: "Target slug already in use" }, { status: 409 });
    }
    doc.slug = data.slug;
  }
  if (data.name !== undefined) doc.name = data.name;
  if (data.category !== undefined) doc.category = data.category;
  if (data.tagline !== undefined) doc.tagline = data.tagline;
  if (data.description !== undefined) doc.description = data.description;
  if (data.images !== undefined) doc.images = data.images;
  if (data.amenities !== undefined) doc.amenities = data.amenities;
  if (data.basePrice !== undefined) doc.basePrice = data.basePrice;
  if (data.weekendMultiplier !== undefined) doc.weekendMultiplier = data.weekendMultiplier;
  if (data.maxGuests !== undefined) doc.maxGuests = data.maxGuests;
  if (data.active !== undefined) doc.active = data.active;

  if (data.sizeSqFt !== undefined) {
    if (data.sizeSqFt === null) {
      doc.set("sizeSqFt", undefined);
    } else {
      doc.sizeSqFt = data.sizeSqFt;
    }
  }

  await doc.save();

  return NextResponse.json({
    room: {
      id: String(doc._id),
      slug: doc.slug,
    },
  });
}

export async function DELETE(req: Request, { params }: Params) {
  const csrf = enforceSameOrigin(req);
  if (csrf) return csrf;

  const denied = await requireAdmin();
  if (denied) return denied;

  if (!isDbConfigured()) {
    return NextResponse.json({ error: "MongoDB required" }, { status: 503 });
  }

  const { slug } = await params;
  await connectDB();
  const doc = await RoomModel.findOneAndUpdate(
    { slug },
    { active: false },
    { new: true },
  );
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
