import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetLanguage: {
      type: String,
      required: true,
    },
    
    sourceLanguage: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "QUEUED",
        "EXTRACTING_AUDIO",
        "TRANSLATING",
        "MUXING",
        "COMPLETED",
        "FAILED",
      ],
      default: "QUEUED",
    },
    secure_url: {
      type: String,
    },
    public_id: {
      type: String,
    },
  },
  { timestamps: true }
);

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

export default Job;
