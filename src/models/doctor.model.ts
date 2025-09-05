import mongoose, { Schema, Document } from "mongoose";

export interface IDoctor extends Document {
  hospital: mongoose.Types.ObjectId; // reference to Hospital
  name: string;                     // Doctor name
  specialization: string;           // e.g., Cardiology, Neurology
  timings: string;                  // e.g., "09:00 - 17:00"
  fee: number;                      // consultation fee
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema: Schema<IDoctor> = new Schema(
  {
    hospital: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    timings: { type: String, required: true },
    fee: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Doctor ||
  mongoose.model<IDoctor>("Doctor", DoctorSchema);
