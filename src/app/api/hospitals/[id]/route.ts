import { NextResponse } from "next/server";
import connectDB from "@/dbconfig/dbconfig";
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

// GET: get hospital details by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const hospital = await Hospital.findById(params.id).populate("user", "name email");
    if (!hospital) return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
    return NextResponse.json(hospital);
  } catch (err) {
    console.error("GET Hospital Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH: update hospital info (hospital user only)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const payload: any = await verifyToken(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const hospital = await Hospital.findById(params.id);
    if (!hospital) return NextResponse.json({ error: "Hospital not found" }, { status: 404 });

    // Only the owner hospital user can update
    if (hospital.user.toString() !== payload.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const updateData: any = {};
    if (body.name) updateData.name = body.name;
    if (body.address) updateData.address = body.address;
    if (body.phone) updateData.phone = body.phone;
    if (body.services) updateData.services = body.services;
    if (body.consultationFee !== undefined) updateData.consultationFee = body.consultationFee;

    const updatedHospital = await Hospital.findByIdAndUpdate(params.id, updateData, { new: true });

    return NextResponse.json({ message: "Hospital updated", hospital: updatedHospital });
  } catch (err) {
    console.error("PATCH Hospital Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE: delete hospital (hospital user only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const payload: any = await verifyToken(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const hospital = await Hospital.findById(params.id);
    if (!hospital) return NextResponse.json({ error: "Hospital not found" }, { status: 404 });

    // Only owner can delete
    if (hospital.user.toString() !== payload.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Hospital.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Hospital deleted successfully" });
  } catch (err) {
    console.error("DELETE Hospital Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
