import Video from "@/models/video.model.js";
import { connect } from "@/db/index.js";
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";

connect();

export async function POST(req) {
  try {
    // user auth
    const authResult = await getAuthUser();
    if (authResult.error) return authResult.error;
    const { user } = authResult;

    // Extract request body
    const { title, public_id, secure_url, resource_type, duration, bytes } =
      await req.json();

    if (!public_id || !secure_url || !title) {
      return NextResponse.json(
        { error: "Missing required video information" },
        { status: 400 }
      );
    }

    // Create new video document
    const newVideo = await Video.create({
      user: user._id,
      title: title,
      public_id: public_id,
      secure_url: secure_url,
      resource_type: resource_type,
      duration: duration,
      bytes: bytes,
    });

    return NextResponse.json(
      { message: "Video uploaded successfully", video: newVideo },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    // get the query params
    const { searchParams } = new URL(req.url);

    const limit = Number(searchParams.get("limit") || "10");
    const page = Number(searchParams.get("page") || "1");
    const sort = searchParams === "asc" ? 1 : -1;

    const skipBy = limit * (page - 1);

    // protected route
    const authResult = await getAuthUser();
    if (authResult.error) return authResult.error;
    const { user } = authResult;

    const videos = await Video.find({ user: user._id })
      .sort({ createdAt: sort })
      .skip(skipBy)
      .limit(limit);

    if (!videos || videos.length === 0) {
      return NextResponse.json(
        { error: "User videos not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ videos }, { status: 200 });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
