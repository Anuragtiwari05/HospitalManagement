import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/dbconfig/dbconfig";
import User from "@/models/user.model";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create patient user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "USER", // hardcoded, cannot choose role
    });

    return NextResponse.json(
      {
        message: "Patient registered successfully",
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
