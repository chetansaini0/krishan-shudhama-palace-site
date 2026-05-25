import mongoose, { Schema, type Model, type Types } from "mongoose";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "failed";

export type BookingDocument = {
  _id: Types.ObjectId;
  roomSlug: string;
  guestName: string;
  email: string;
  phone: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  nights: number;
  totalAmount: number;
  currency: string;
  status: BookingStatus;
  pendingExpiresAt?: Date;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentStatus?: "unpaid" | "captured" | "failed";
  paymentVerifiedAt?: Date;
  notificationsSentAt?: Date;
  userId?: Types.ObjectId;
  notes?: string;
};

const BookingSchema = new Schema<BookingDocument>(
  {
    roomSlug: { type: String, required: true, index: true },
    guestName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    checkIn: { type: Date, required: true, index: true },
    checkOut: { type: Date, required: true, index: true },
    guests: { type: Number, required: true },
    nights: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "failed"],
      default: "pending",
      index: true,
    },
    pendingExpiresAt: { type: Date, index: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "captured", "failed"],
      default: "unpaid",
      index: true,
    },
    paymentVerifiedAt: { type: Date },
    notificationsSentAt: { type: Date },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
  },
  { timestamps: true },
);

BookingSchema.index({ roomSlug: 1, checkIn: 1, checkOut: 1 });
BookingSchema.index({ status: 1, pendingExpiresAt: 1 });
BookingSchema.index({ razorpayOrderId: 1 }, { unique: true, sparse: true });
BookingSchema.index({ razorpayPaymentId: 1 }, { unique: true, sparse: true });

export const BookingModel: Model<BookingDocument> =
  mongoose.models.Booking ??
  mongoose.model<BookingDocument>("Booking", BookingSchema);
