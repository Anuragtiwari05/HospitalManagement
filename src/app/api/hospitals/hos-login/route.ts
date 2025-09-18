import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/dbconfig/dbconfig";
import Hospital from "@/models/hospital.model";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // keep strong secret in .env.local

export async function POST(req: Request) {
  try {
    await connectDB();

    const { loginId, name, email, licenseNumber } = await req.json();

    // Basic validation
    if (!loginId || !name || !email || !licenseNumber) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Find hospital by loginId
    const hospital = await Hospital.findOne({ loginId });

    if (
      !hospital ||
      hospital.name !== name ||
      hospital.email !== email ||
      hospital.licenseNumber !== licenseNumber
    ) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create JWT token
    const payload = { id: hospital._id, role: "HOSPITAL" };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json({
      message: "Hospital login successful",
      token,
      hospital: {
        id: hospital._id,
        name: hospital.name,
        email: hospital.email,
        loginId: hospital.loginId,
        role: "HOSPITAL",
      },
    });

  } catch (err) {
    console.error("Hospital Login Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
