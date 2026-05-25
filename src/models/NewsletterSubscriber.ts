import mongoose, { Schema, type Model, type Types } from "mongoose";

export type NewsletterSubscriberDocument = {
  _id: Types.ObjectId;
  email: string;
  active: boolean;
};

const NewsletterSubscriberSchema = new Schema<NewsletterSubscriberDocument>(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const NewsletterSubscriberModel: Model<NewsletterSubscriberDocument> =
  mongoose.models.NewsletterSubscriber ??
  mongoose.model<NewsletterSubscriberDocument>(
    "NewsletterSubscriber",
    NewsletterSubscriberSchema,
  );
