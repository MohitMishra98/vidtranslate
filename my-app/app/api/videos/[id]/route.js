import { getAuthUser } from "@/lib/getAuthUser";
import { connect } from "@/db";
import Video from "@/models/video.model";
import Job from "@/models/job.model.js";
import { NextResponse } from "next/server";
import { deleteVideoCloudinary } from "@/lib/deleteVideoCloudinary";

connect();

// delete video from db and cloudinary
// also delete all the related jobs
export async function DELETE(req, { params }) {
  try {
    console.log("job came")
    const { id } = await params;

    const authResult = await getAuthUser();
    if (authResult.error) return authResult.error;
    const { user } = authResult;

    const video = await Video.findOne({
      _id: id,
      user: user._id,
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const jobs = await Job.find({ video: video._id }).lean();

    // delete all job-related cloudinary videos
    await Promise.all(jobs.map((job) => job?.public_id ? deleteVideoCloudinary(job.public_id) : null));

    // delete jobs from DB
    await Job.deleteMany({ video: video._id });

    // delete main video from cloudinary
    await deleteVideoCloudinary(video.public_id);

    // delete main video from DB
    await Video.findByIdAndDelete(video._id);

    return NextResponse.json(
      {
        message: "Video and related jobs deleted successfully",
        data: [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "Error occurred while deleting the video" },
      { status: 500 }
    );
  }
}

// get video by id
export async function GET(req, {params}) {
  try {
    console.log("job came")
    const { id } = await params;

    // protected route
    const authResult = await getAuthUser();
    if (authResult.error) return authResult.error;
    const { user } = authResult;

    const video = await Video.findOne({ user: user._id, _id: id })

    if (!video) {
      return NextResponse.json(
        { error: "User videos not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "videos fetched successfully", data: video },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}