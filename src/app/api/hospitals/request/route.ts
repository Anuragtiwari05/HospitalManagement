import { NextResponse } from "next/server";
import connectDB from "@/dbconfig/dbconfig";
import HospitalRequest from "@/models/hospitalRequest.model";

export async function POST(req: Request) {
  try {
    await connectDB();

    // Extract request body
    const { name, email, address, phone, licenseNumber } = await req.json();

    // Basic validation
    if (!name || !email || !address || !phone || !licenseNumber) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if a request with same license or email exists
    const existingRequest = await HospitalRequest.findOne({ 
      $or: [{ licenseNumber }, { email }] 
    });
    if (existingRequest) {
      return NextResponse.json({ error: "Hospital request with this license/email already exists" }, { status: 400 });
    }

    // Create new hospital request
    const request = await HospitalRequest.create({
      name,
      email,
      address,
      phone,
      licenseNumber,
      status: "PENDING",
    });

    return NextResponse.json({
      message: "Hospital registration request submitted successfully",
      requestId: request._id,
      status: request.status,
    }, { status: 201 });

  } catch (err) {
    console.error("Hospital Request Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
