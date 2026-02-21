import { NextResponse } from "next/server";
import { connect } from "@/db";
import Job from "@/models/job.model.js";
import mongoose from "mongoose";
import { getAuthUser } from "@/lib/getAuthUser";
import { deleteVideoCloudinary } from "@/lib/deleteVideoCloudinary";
import Video from "@/models/video.model.js";

connect();

// get job status
export async function GET(req, { params }) {
  try {
    const { id } = await params;

    // protected route
    const authResult = await getAuthUser();
    if (authResult.error) return authResult.error;

    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    const job = await Job.findById(id).populate("video");

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Job fetched successfully", job: job },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// delete the job
export async function DELETE(req, { params }) {
  try {
    // get the params
    const { id } = await params;

    // protected route
    const authResult = await getAuthUser();
    if (authResult.error) return authResult.error;
    const { user } = authResult;

    // get the job
    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json({ error: "job not found" }, { status: 404 });
    }

    if (!job.user.equals(user._id)) {
      return NextResponse.json(
        { error: "user does not own the job" },
        { status: 401 }
      );
    }

    // delete video from cloudinary

    //TODO: remove this comment
    await deleteVideoCloudinary(job.public_id);

    // delete from db
    await Job.findByIdAndDelete(job._id);

    return NextResponse.json(
      { message: "job deleted successfully", data: [] },
      { status: 200 }
    );
  } catch (error) {
    console.log("error deleting the job", error);
    return NextResponse.json(
      { error: "error deleting the job" },
      { status: 500 }
    );
  }
}
