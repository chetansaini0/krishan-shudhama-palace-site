import mongoose, { Schema, type Model, type Types } from "mongoose";

export type OfferDocument = {
  _id: Types.ObjectId;
  title: string;
  description: string;
  code: string;
  discountPercent: number;
  validUntil: Date;
  active: boolean;
};

const OfferSchema = new Schema<OfferDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    discountPercent: { type: Number, required: true },
    validUntil: { type: Date, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const OfferModel: Model<OfferDocument> =
  mongoose.models.Offer ?? mongoose.model<OfferDocument>("Offer", OfferSchema);
