import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  user: mongoose.Types.ObjectId;      // reference to User (patient)
  doctor: mongoose.Types.ObjectId;    // reference to Doctor
  hospital: mongoose.Types.ObjectId;  // reference to Hospital
  date: Date;                         // appointment date/time
  status: "PENDING" | "CONFIRMED" | "CANCELLED"; // appointment status
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema: Schema<IAppointment> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    hospital: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);
