import { NextResponse } from "next/server";
import connectDB from "@/dbconfig/dbconfig";
import Bed from "@/models/bed.model";
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

// GET: get bed info for a hospital (hospitalId in query param)
export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const hospitalId = url.searchParams.get("hospitalId");

    if (!hospitalId) {
      return NextResponse.json({ error: "hospitalId is required" }, { status: 400 });
    }

    const bed = await Bed.findOne({ hospital: hospitalId });
    if (!bed) {
      return NextResponse.json({ error: "Bed info not found" }, { status: 404 });
    }

    return NextResponse.json(bed);
  } catch (err) {
    console.error("GET Bed Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH: update bed info (hospital only)
export async function PATCH(req: Request) {
  try {
    await connectDB();

    // Verify JWT token
    const payload: any = await verifyToken(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { hospitalId, totalBeds, availableBeds, icuBeds, availableICUBeds } = body;

    if (!hospitalId) {
      return NextResponse.json({ error: "hospitalId is required" }, { status: 400 });
    }

    // Only hospital owner can update
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital || hospital.user.toString() !== payload.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData: any = {};
    if (totalBeds !== undefined) updateData.totalBeds = totalBeds;
    if (availableBeds !== undefined) updateData.availableBeds = availableBeds;
    if (icuBeds !== undefined) updateData.icuBeds = icuBeds;
    if (availableICUBeds !== undefined) updateData.availableICUBeds = availableICUBeds;

    const updatedBed = await Bed.findOneAndUpdate(
      { hospital: hospitalId },
      updateData,
      { new: true, upsert: true }
    );

    return NextResponse.json({ message: "Bed info updated", bed: updatedBed });
  } catch (err) {
    console.error("PATCH Bed Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
