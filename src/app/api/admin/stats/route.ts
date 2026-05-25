import { NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { EventInquiryModel } from "@/models/EventInquiry";
import { RoomModel } from "@/models/Room";
import { requireAdmin } from "@/lib/admin-api";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!isDbConfigured()) {
    return NextResponse.json({
      rooms: 0,
      bookings: 0,
      confirmed: 0,
      pendingInquiries: 0,
    });
  }

  await connectDB();
  const [rooms, bookings, confirmed, pendingInquiries] = await Promise.all([
    RoomModel.countDocuments({ active: true }),
    BookingModel.countDocuments(),
    BookingModel.countDocuments({ status: "confirmed" }),
    EventInquiryModel.countDocuments({ status: "new" }),
  ]);

  return NextResponse.json({
    rooms,
    bookings,
    confirmed,
    pendingInquiries,
  });
}
