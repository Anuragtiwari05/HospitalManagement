import { NextResponse } from "next/server";
import connectDB from "@/dbconfig/dbconfig";
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

// GET: list all hospitals
export async function GET(req: Request) {
  try {
    await connectDB();
    const hospitals = await Hospital.find().populate("user", "name email");
    return NextResponse.json(hospitals);
  } catch (err) {
    console.error("GET Hospitals Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST: create hospital (HOSPITAL user only)
export async function POST(req: Request) {
  try {
    await connectDB();
    const payload: any = await verifyToken(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (payload.role !== "HOSPITAL") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, address, phone, services, consultationFee } = body;
    if (!name || !address || !phone) {
      return NextResponse.json({ error: "Name, address, and phone are required" }, { status: 400 });
    }

    // Check if hospital already exists for this user
    const existing = await Hospital.findOne({ user: payload.id });
    if (existing) return NextResponse.json({ error: "Hospital already exists for this user" }, { status: 400 });

    const hospital = await Hospital.create({
      user: payload.id,
      name,
      address,
      phone,
      services: services || [],
      consultationFee: consultationFee || 0,
    });

    return NextResponse.json({ message: "Hospital created successfully", hospital });
  } catch (err) {
    console.error("POST Hospital Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
