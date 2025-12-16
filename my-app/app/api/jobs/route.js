import Job from "@/models/job.model.js";
import Video from "@/models/video.model.js";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect } from "@/db";
import { getAuthUser } from "@/lib/getAuthUser";
import { inngest } from "@/lib/inngest";

connect();

// start translation job
export async function POST(req) {
  try {
    // get the body
    const { videoId, targetLanguage } = await req.body;

    // protected route
    const authResult = await getAuthUser();
    if (authResult.error) return authResult.error;
    const { user } = authResult;

    // get the video
    const video = await Video.findOne({
      _id: new mongoose.Types.ObjectId(videoId),
      user: user._id,
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const newJob = await Job.create({
      video: video._id,
      user: user._id,
      targetLanguage: targetLanguage,
      status: "pending",
    });

    if (!newJob) {
      return NextResponse.json(
        { error: "Failed to create job" },
        { status: 500 }
      );
    }

    // sending the job to inngest
    await inngest.send({
      name: "translation/start",
      data: {
        ...newJob
      }
    })

    return NextResponse.json(
      { message: "Translation job created", data: newJob },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "error starting the translation process" },
      { status: 500 }
    );
  }
}

// get jobs for user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const limit = Number(searchParams.get("limit") || 10);
    const page = Number(searchParams.get("page") || 1);
    const sort = searchParams.get("sort") === "asc" ? -1 : 1;

    const skipBy = limit * (page - 1);

    // protected route
    const authResult = await getAuthUser();
    if (authResult.error) return authResult.error;
    const { user } = authResult;

    // TODO: create index for efficient search
    const jobs = await Job.find({ user: user._id })
      .sort({ createdAt: sort })
      .skip(skipBy)
      .limit(limit);

    if (!jobs || jobs.length === 0) {
      return NextResponse.json(
        { message: "No jobs found", data: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "jobs fetched successfully", data: jobs },
      { status: 200 }
    );
  } catch (error) {
    console.log("error occured while fetching jobs: ", error);
    return NextResponse.json(
      { error: "error occured while fetching jobs" },
      { status: 500 }
    );
  }
}
