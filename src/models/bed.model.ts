import mongoose, { Schema, Document } from "mongoose";

export interface IBed extends Document {
  hospital: mongoose.Types.ObjectId;  // reference to Hospital
  totalBeds: number;                  // total normal beds
  availableBeds: number;              // currently available beds
  icuBeds: number;                    // total ICU beds
  availableICUBeds: number;           // currently available ICU beds
  createdAt: Date;
  updatedAt: Date;
}

const BedSchema: Schema<IBed> = new Schema(
  {
    hospital: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
    totalBeds: { type: Number, default: 0 },
    availableBeds: { type: Number, default: 0 },
    icuBeds: { type: Number, default: 0 },
    availableICUBeds: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Bed || mongoose.model<IBed>("Bed", BedSchema);
