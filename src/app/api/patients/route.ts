import { NextResponse } from "next/server";
import connectDB from "@/dbconfig/dbconfig";
import Patient from "@/models/patient.model";
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
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

// GET: list all patients (optionally filter by hospitalId query)
export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const hospitalId = url.searchParams.get("hospitalId");

    const query = hospitalId ? { hospital: hospitalId } : {};
    const patients = await Patient.find(query)
      .populate("hospital", "name address")
      .populate("doctor", "name specialization");

    return NextResponse.json(patients);
  } catch (err) {
    console.error("GET Patients Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST: add a patient (hospital only)
export async function POST(req: Request) {
  try {
    await connectDB();
    const payload: any = await verifyToken(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Only hospital users can add patients
    if (payload.role !== "HOSPITAL") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, age, gender, contact, email, address, doctor, medicalHistory } = body;
    if (!name || !age || !gender || !contact) {
      return NextResponse.json({ error: "Name, age, gender, and contact are required" }, { status: 400 });
    }

    // Get hospital of this user
    const hospital = await Hospital.findOne({ user: payload.id });
    if (!hospital) return NextResponse.json({ error: "Hospital not found" }, { status: 404 });

    const patient = await Patient.create({
      hospital: hospital._id,
      name,
      age,
      gender,
      contact,
      email,
      address,
      doctor,
      medicalHistory,
    });

    return NextResponse.json({ message: "Patient added successfully", patient });
  } catch (err) {
    console.error("POST Patient Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
