import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    public_id: {
      type: String,
      required: true,
      unique: true,
    },

    secure_url: {
      type: String,
      required: true,
      unique: true,
    },

    resource_type: {
      type: String,
    },

    language: {
      type: String,
    },

    duration: {
      type: Number,
    },

    bytes: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);

export default Video;
