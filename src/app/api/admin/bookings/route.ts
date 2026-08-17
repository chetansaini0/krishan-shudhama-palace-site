import { NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { requireAdmin } from "@/lib/admin-api";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!isDbConfigured()) {
    return NextResponse.json({ bookings: [] });
  }
  await connectDB();
  const bookings = await BookingModel.find()
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  return NextResponse.json({
    bookings: bookings.map((b) => {
      const doc = b as typeof b & { createdAt?: Date };
      return {
        id: String(b._id),
        roomSlug: b.roomSlug,
        guestName: b.guestName,
        email: b.email,
        phone: b.phone,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        guests: b.guests,
        nights: b.nights,
        totalAmount: b.totalAmount,
        status: b.status,
        paymentStatus: b.paymentStatus ?? "unpaid",
        razorpayPaymentId: b.razorpayPaymentId,
        refundId: b.refundId,
        createdAt: doc.createdAt,
      };
    }),
  });
}
