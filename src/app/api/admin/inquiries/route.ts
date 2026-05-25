import { NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/db";
import { EventInquiryModel } from "@/models/EventInquiry";
import { requireAdmin } from "@/lib/admin-api";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!isDbConfigured()) {
    return NextResponse.json({ inquiries: [] });
  }
  await connectDB();
  const inquiries = await EventInquiryModel.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return NextResponse.json({
    inquiries: inquiries.map((i) => {
      const doc = i as typeof i & { createdAt?: Date };
      return {
        id: String(i._id),
        name: i.name,
        email: i.email,
        phone: i.phone,
        eventType: i.eventType,
        guestCount: i.guestCount,
        eventDate: i.eventDate,
        message: i.message,
        status: i.status,
        quotedAmount: i.quotedAmount,
        adminNotes: i.adminNotes,
        createdAt: doc.createdAt,
      };
    }),
  });
}
