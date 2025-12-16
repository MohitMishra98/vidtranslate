import { getAuthUser } from "@/lib/getAuthUser";
import Job from "@/models/job.model.js";
import { connect } from "@/db";
import { NextResponse } from "next/server";

connect();

export async function POST(req, { params }) {
  try {
    // get the params
    const { id } = params;

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

    if (job.status !== "FAILED" && job.status !== "COMPLETED") {
      return NextResponse.json(
        {
          error: "job can only be retryed if completed or error",
        },
        { status: 400 }
      );
    }

    job.status = "QUEUED";
    job.secure_url = undefined;
    job.public_id = undefined;

    const savedJob = await job.save();
    
    // sending the job to inngest
    await inngest.send({
      name: "translation/start",
      data: {
        ...savedJob,
      },
    });

    return NextResponse.json(
      { message: "job retry scheduled successfully", data: [] },
      { status: 202 }
    );
  } catch (error) {
    console.log("error in job retry schedulling", error);
    return NextResponse.json(
      { error: "error in job retry schedulling" },
      { status: 500 }
    );
  }
}
