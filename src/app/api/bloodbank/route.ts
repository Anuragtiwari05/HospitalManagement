import { NextResponse } from "next/server";
import connectDB from "@/dbconfig/dbconfig";
import BloodBank from "@/models/bloodbank.model";
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
  } catch (err) {
    return null;
  }
}

// GET: get blood units for a hospital (hospitalId in query param)
export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const hospitalId = url.searchParams.get("hospitalId");

    if (!hospitalId) return NextResponse.json({ error: "hospitalId is required" }, { status: 400 });

    const bloodUnits = await BloodBank.find({ hospital: hospitalId });
    if (!bloodUnits || bloodUnits.length === 0) {
      return NextResponse.json({ error: "No blood records found" }, { status: 404 });
    }

    return NextResponse.json(bloodUnits);
  } catch (err) {
    console.error("GET BloodBank Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH: update blood units (hospital only)
export async function PATCH(req: Request) {
  try {
    await connectDB();

    // Verify JWT token
    const payload: any = await verifyToken(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { hospitalId, bloodType, unitsAvailable } = body;

    if (!hospitalId || !bloodType || unitsAvailable === undefined) {
      return NextResponse.json({ error: "hospitalId, bloodType, and unitsAvailable are required" }, { status: 400 });
    }

    // Only hospital owner can update
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital || hospital.user.toString() !== payload.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedBlood = await BloodBank.findOneAndUpdate(
      { hospital: hospitalId, bloodType },
      { unitsAvailable },
      { new: true, upsert: true }
    );

    return NextResponse.json({ message: "Blood units updated", blood: updatedBlood });
  } catch (err) {
    console.error("PATCH BloodBank Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
