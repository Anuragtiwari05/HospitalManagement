import mongoose, { Schema, Document } from "mongoose";

export interface IHospitalRequest extends Document {
  name: string;                // hospital name
  address: string;             // full address
  phone: string;               // contact number
  licenseNumber: string;       // govt/official license for verification
  email: string;               // contact email
  status: "PENDING" | "APPROVED" | "REJECTED"; // request status
  createdAt: Date;
  updatedAt: Date;
}

const HospitalRequestSchema: Schema<IHospitalRequest> = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.models.HospitalRequest ||
  mongoose.model<IHospitalRequest>("HospitalRequest", HospitalRequestSchema);
