import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/dbconfig/dbconfig";
import User from "@/models/user.model";
import Hospital from "@/models/hospital.model";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password, role, hospitalName, address, phone, services } =
      await req.json();

    // Basic validation
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!["USER", "HOSPITAL", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // If role is HOSPITAL, create hospital document
    if (role === "HOSPITAL") {
      if (!hospitalName || !address || !phone) {
        return NextResponse.json(
          { error: "Hospital name, address, and phone are required" },
          { status: 400 }
        );
      }

      await Hospital.create({
        user: user._id,
        name: hospitalName,
        address,
        phone,
        services: services || [],
      });
    }

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
