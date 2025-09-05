import { NextResponse } from "next/server";
import connectDB from "@/dbconfig/dbconfig";
import Review from "@/models/review.model";
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

// GET: get all reviews for a hospital
export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const hospitalId = url.searchParams.get("hospitalId");

    if (!hospitalId) {
      return NextResponse.json({ error: "hospitalId is required" }, { status: 400 });
    }

    const reviews = await Review.find({ hospital: hospitalId }).populate("user", "name email").sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (err) {
    console.error("GET Reviews Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST: create a review (user only)
export async function POST(req: Request) {
  try {
    await connectDB();
    const payload: any = await verifyToken(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Only USER role can leave review
    if (payload.role !== "USER") {
      return NextResponse.json({ error: "Only patients can leave reviews" }, { status: 403 });
    }

    const body = await req.json();
    const { hospitalId, rating, comment } = body;

    if (!hospitalId || rating === undefined || !comment) {
      return NextResponse.json({ error: "hospitalId, rating and comment are required" }, { status: 400 });
    }

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) return NextResponse.json({ error: "Hospital not found" }, { status: 404 });

    const review = await Review.create({
      hospital: hospitalId,
      user: payload.id,
      rating,
      comment,
    });

    return NextResponse.json({ message: "Review added successfully", review });
  } catch (err) {
    console.error("POST Review Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
