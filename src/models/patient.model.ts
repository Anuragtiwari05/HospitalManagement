import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
  name: string;                          // Patient full name
  age: number;                           // Age
  gender: "male" | "female" | "other";   // Gender
  contact: string;                       // Phone number
  email?: string;                        // Optional email
  address?: string;                      // Optional address
  hospital: mongoose.Types.ObjectId;     // Reference to Hospital
  doctor?: mongoose.Types.ObjectId;      // Reference to Doctor
  medicalHistory: {
    condition: string;                   // e.g., Diabetes, Hypertension
    treatment: string;                   // e.g., Insulin, Medication
    startDate?: Date;                    // when treatment started
    endDate?: Date;                      // when treatment ended
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema: Schema<IPatient> = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    contact: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    hospital: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
    medicalHistory: [
      {
        condition: { type: String, required: true },
        treatment: { type: String, required: true },
        startDate: { type: Date },
        endDate: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Patient ||
  mongoose.model<IPatient>("Patient", PatientSchema);
