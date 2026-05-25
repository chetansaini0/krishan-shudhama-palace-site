import { NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/db";
import { OfferModel } from "@/models/Offer";

const FALLBACK = [
  {
    title: "Palace Escape — Weekend Indulgence",
    description: "Complimentary breakfast & late checkout on Friday arrivals.",
    code: "PALACE15",
    discountPercent: 15,
    validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
  },
];

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ offers: FALLBACK });
  }
  try {
    await connectDB();
    const count = await OfferModel.countDocuments();
    if (count === 0) {
      await OfferModel.insertMany(
        FALLBACK.map((o) => ({
          ...o,
          validUntil: new Date(o.validUntil),
          active: true,
        })),
      );
    }
    const offers = await OfferModel.find({ active: true })
      .sort({ validUntil: 1 })
      .lean();
    return NextResponse.json({
      offers: offers.map((o) => ({
        title: o.title,
        description: o.description,
        code: o.code,
        discountPercent: o.discountPercent,
        validUntil: o.validUntil,
      })),
    });
  } catch {
    return NextResponse.json({ offers: FALLBACK });
  }
}
