import mongoose, { Schema, Document } from "mongoose";

export interface IHospital extends Document {
  user: mongoose.Types.ObjectId; // reference to User (hospital admin)
  name: string;                  // hospital name
  address: string;               // full address
  phone: string;                 // contact number
  services: string[];            // e.g., Cardiology, Orthopedics
  consultationFee?: number;      // average consultation fee
  rating?: number;               // average rating (from reviews)
  createdAt: Date;
  updatedAt: Date;
}

const HospitalSchema: Schema<IHospital> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    services: [{ type: String }],
    consultationFee: { type: Number },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Hospital ||
  mongoose.model<IHospital>("Hospital", HospitalSchema);
