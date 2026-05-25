import mongoose, { Schema, type Model, type Types } from "mongoose";

export type EventInquiryStatus = "new" | "quoted" | "won" | "lost";

export type EventInquiryDocument = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  guestCount: number;
  eventDate?: Date;
  message: string;
  status: EventInquiryStatus;
  adminNotes?: string;
  quotedAmount?: number;
};

const EventInquirySchema = new Schema<EventInquiryDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    eventType: { type: String, required: true },
    guestCount: { type: Number, required: true },
    eventDate: { type: Date },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "quoted", "won", "lost"],
      default: "new",
      index: true,
    },
    adminNotes: { type: String },
    quotedAmount: { type: Number },
  },
  { timestamps: true },
);

export const EventInquiryModel: Model<EventInquiryDocument> =
  mongoose.models.EventInquiry ??
  mongoose.model<EventInquiryDocument>("EventInquiry", EventInquirySchema);
