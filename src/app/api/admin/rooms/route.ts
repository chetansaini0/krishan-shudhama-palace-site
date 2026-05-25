import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB, isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";
import { RoomModel } from "@/models/Room";
import { enforceSameOrigin } from "@/lib/csrf";

const Create = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(2),
  category: z.enum(["deluxe", "suite", "executive"]),
  tagline: z.string().min(2),
  description: z.string().min(20),
  images: z.array(z.string().url()).min(1),
  amenities: z.array(z.string().min(1)).min(1),
  basePrice: z.number().positive(),
  weekendMultiplier: z.number().min(1).max(3),
  maxGuests: z.number().int().min(1).max(20),
  sizeSqFt: z.number().positive().optional(),
  active: z.boolean().optional(),
});

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "MongoDB required for room management", rooms: [] },
      { status: 503 },
    );
  }

  await connectDB();
  const rooms = await RoomModel.find().sort({ name: 1 }).lean();
  return NextResponse.json({
    rooms: rooms.map((r) => ({
      id: String(r._id),
      slug: r.slug,
      name: r.name,
      category: r.category,
      tagline: r.tagline,
      description: r.description,
      images: r.images,
      amenities: r.amenities,
      basePrice: r.basePrice,
      weekendMultiplier: r.weekendMultiplier,
      maxGuests: r.maxGuests,
      sizeSqFt: r.sizeSqFt,
      active: r.active,
    })),
  });
}

export async function POST(req: Request) {
  const csrf = enforceSameOrigin(req);
  if (csrf) return csrf;

  const denied = await requireAdmin();
  if (denied) return denied;

  if (!isDbConfigured()) {
    return NextResponse.json({ error: "MongoDB required" }, { status: 503 });
  }

  const json = await req.json().catch(() => null);
  const parsed = Create.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  await connectDB();
  const exists = await RoomModel.findOne({ slug: parsed.data.slug });
  if (exists) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const doc = await RoomModel.create({
    ...parsed.data,
    active: parsed.data.active ?? true,
  });

  return NextResponse.json({
    room: { id: String(doc._id), slug: doc.slug },
  });
}
