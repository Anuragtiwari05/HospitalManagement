import { NextResponse } from "next/server";
import connectDB from "@/dbconfig/dbconfig";
import Doctor from "@/models/doctor.model";
import Hospital from "@/models/hospital.model";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

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

// PATCH: update doctor (hospital only)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const payload: any = await verifyToken(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const doctor = await Doctor.findById(params.id);
    if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });

    const hospital = await Hospital.findById(doctor.hospital);
    if (!hospital || hospital.user.toString() !== payload.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const updateData: any = {};
    if (body.name) updateData.name = body.name;
    if (body.specialization) updateData.specialization = body.specialization;
    if (body.timings) updateData.timings = body.timings;
    if (body.fee) updateData.fee = body.fee;

    const updatedDoctor = await Doctor.findByIdAndUpdate(params.id, updateData, { new: true });

    return NextResponse.json({ message: "Doctor updated", doctor: updatedDoctor });
  } catch (err) {
    console.error("PATCH Doctor Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE: remove doctor (hospital only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const payload: any = await verifyToken(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const doctor = await Doctor.findById(params.id);
    if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });

    const hospital = await Hospital.findById(doctor.hospital);
    if (!hospital || hospital.user.toString() !== payload.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Doctor.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    console.error("DELETE Doctor Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
