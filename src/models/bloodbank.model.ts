import mongoose, { Schema, Document } from "mongoose";

export interface IBloodBank extends Document {
  hospital: mongoose.Types.ObjectId; // reference to Hospital
  bloodType: string;                // e.g., "A+", "O-", "B+" etc.
  unitsAvailable: number;           // number of units available
  createdAt: Date;
  updatedAt: Date;
}

const BloodBankSchema: Schema<IBloodBank> = new Schema(
  {
    hospital: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
    bloodType: { type: String, required: true },
    unitsAvailable: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.BloodBank ||
  mongoose.model<IBloodBank>("BloodBank", BloodBankSchema);
