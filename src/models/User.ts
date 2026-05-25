import mongoose, { Schema, type Model, type Types } from "mongoose";

export type UserDocument = {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  phone?: string;
  name?: string;
};

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    name: { type: String },
  },
  { timestamps: true },
);

export const UserModel: Model<UserDocument> =
  mongoose.models.User ?? mongoose.model<UserDocument>("User", UserSchema);
