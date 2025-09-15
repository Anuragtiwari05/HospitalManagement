import { NextResponse } from "next/server";
import connectDB from "@/dbconfig/dbconfig";
import Patient from "@/models/patient.model";
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

// PATCH: update patient (hospital only)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const payload: any = await verifyToken(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const patient = await Patient.findById(params.id);
    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

    const hospital = await Hospital.findById(patient.hospital);
    if (!hospital || hospital.user.toString() !== payload.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const updateData: any = {};
    if (body.name) updateData.name = body.name;
    if (body.age) updateData.age = body.age;
    if (body.gender) updateData.gender = body.gender;
    if (body.contact) updateData.contact = body.contact;
    if (body.email) updateData.email = body.email;
    if (body.address) updateData.address = body.address;
    if (body.doctor) updateData.doctor = body.doctor;
    if (body.medicalHistory) updateData.medicalHistory = body.medicalHistory;

    const updatedPatient = await Patient.findByIdAndUpdate(params.id, updateData, { new: true });

    return NextResponse.json({ message: "Patient updated", patient: updatedPatient });
  } catch (err) {
    console.error("PATCH Patient Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE: remove patient (hospital only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const payload: any = await verifyToken(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const patient = await Patient.findById(params.id);
    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

    const hospital = await Hospital.findById(patient.hospital);
    if (!hospital || hospital.user.toString() !== payload.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Patient.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error("DELETE Patient Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
