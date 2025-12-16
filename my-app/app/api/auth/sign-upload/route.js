import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
import { connect } from "@/db";

connect();

export async function POST(req) {
  try {
    // protected route
    const authResult = await getAuthUser();
    if (authResult.error) return authResult.error;

    const timestamp = Math.round(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: "videos",
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error("Sign upload error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}
