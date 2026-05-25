import mongoose, { Schema, type Model, type Types } from "mongoose";

export type ContactInquiryDocument = {
  _id: Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  message: string;
  source?: string;
  status: "new" | "closed";
};

const ContactInquirySchema = new Schema<ContactInquiryDocument>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    email: { type: String, index: true },
    message: { type: String, required: true },
    source: { type: String, default: "website" },
    status: { type: String, enum: ["new", "closed"], default: "new", index: true },
  },
  { timestamps: true },
);

export const ContactInquiryModel: Model<ContactInquiryDocument> =
  mongoose.models.ContactInquiry ??
  mongoose.model<ContactInquiryDocument>("ContactInquiry", ContactInquirySchema);
