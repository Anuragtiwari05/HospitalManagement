import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "USER" | "HOSPITAL" | "ADMIN";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define schema
const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["USER", "HOSPITAL", "ADMIN"],
      default: "USER",
    },
    phone: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

// Prevent duplicate model compilation (Next.js hot reload issue)
export default (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
