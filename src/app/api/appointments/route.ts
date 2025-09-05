import { NextResponse } from "next/server";
import connectDB from "@/dbconfig/dbconfig";
import Appointment from "@/models/appointment.model";
import Doctor from "@/models/doctor.model";
import Hospital from "@/models/hospital.model";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// JWT verification
async function verifyToken(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// GET: list appointments
export async function GET(req: Request) {
  try {
    await connectDB();
    const payload: any = await verifyToken(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const hospitalId = url.searchParams.get("hospitalId");

    let appointments;

    if (payload.role === "HOSPITAL") {
      // Hospital sees only their appointments
      const hospital = await Hospital.findOne({ user: payload.id });
      if (!hospital) return NextResponse.json({ error: "Hospital not found" }, { status: 404 });

      appointments = await Appointment.find({ hospital: hospital._id })
        .populate("user", "name email")
        .populate("doctor", "name specialization");
    } else if (payload.role === "USER") {
      // User sees only their appointments
      appointments = await Appointment.find({ user: payload.id })
        .populate("doctor", "name specialization")
        .populate("hospital", "name address");
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 403 });
    }

    return NextResponse.json(appointments);
  } catch (err) {
    console.error("GET Appointments Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST: user books appointment
export async function POST(req: Request) {
  try {
    await connectDB();
    const payload: any = await verifyToken(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (payload.role !== "USER") {
      return NextResponse.json({ error: "Only users can book appointments" }, { status: 403 });
    }

    const body = await req.json();
    const { hospitalId, doctorId, dateTime } = body;

    if (!hospitalId || !dateTime) {
      return NextResponse.json({ error: "hospitalId and dateTime are required" }, { status: 400 });
    }

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) return NextResponse.json({ error: "Hospital not found" }, { status: 404 });

    let doctor = null;
    if (doctorId) {
      doctor = await Doctor.findById(doctorId);
      if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const appointment = await Appointment.create({
      user: payload.id,
      hospital: hospitalId,
      doctor: doctor ? doctor._id : null,
      dateTime: new Date(dateTime),
      status: "pending",
    });

    return NextResponse.json({ message: "Appointment booked", appointment });
  } catch (err) {
    console.error("POST Appointment Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH: hospital updates appointment status
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const payload: any = await verifyToken(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (payload.role !== "HOSPITAL") {
      return NextResponse.json({ error: "Only hospitals can update appointments" }, { status: 403 });
    }

    const body = await req.json();
    const { appointmentId, status } = body;

    if (!appointmentId || !status) {
      return NextResponse.json({ error: "appointmentId and status are required" }, { status: 400 });
    }

    const hospital = await Hospital.findOne({ user: payload.id });
    if (!hospital) return NextResponse.json({ error: "Hospital not found" }, { status: 404 });

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });

    if (appointment.hospital.toString() !== hospital._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    appointment.status = status;
    await appointment.save();

    return NextResponse.json({ message: "Appointment status updated", appointment });
  } catch (err) {
    console.error("PATCH Appointment Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
