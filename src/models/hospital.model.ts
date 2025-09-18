import mongoose, { Schema, Document } from "mongoose";

export interface IHospital extends Document {
  loginId: string;                 // unique login ID for hospital
  name: string;                     // hospital name
  address: string;                  // full address
  phone: string;                    // contact number
  email: string;                    // contact email
  licenseNumber: string;            // official license number
  services?: string[];              // optional services, e.g., Cardiology
  consultationFee?: number;         // optional average consultation fee
  rating?: number;                  // optional average rating
  createdAt: Date;
  updatedAt: Date;
}

const HospitalSchema: Schema<IHospital> = new Schema(
  {
    loginId: { type: String, required: true, unique: true },   // new field for login
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    services: [{ type: String }],
    consultationFee: { type: Number },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Hospital ||
  mongoose.model<IHospital>("Hospital", HospitalSchema);
