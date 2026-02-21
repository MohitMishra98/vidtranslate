import { inngest } from "@/lib/inngest.js";
import Video from "@/models/video.model.js";
import Job from "@/models/job.model.js";
import downloadCloudinaryVideo from "@/lib/downloadCloudinaryVideo";
import extractAudioFromVideo from "@/lib/extractAudioFormVideo";
import getTranscription from "@/lib/translation/getTranscription";
import getTranslatedTranscript from "@/lib/translation/translation";
import generateAudio from "@/lib/translation/speaking";
import mergeAudioAndVideo from "@/lib/mergeAudioVideo";
import uploadVideoToCloudinary from "@/lib/uploadVideoToCloudinary";
import fs from "fs";

export const startTranslation = inngest.createFunction(
  { id: "start-translation" },
  { event: "translation/start" },
  async ({ event, step }) => {
    console.log("started the transaltion job");

    // get the data from db
    console.log("getting data from db");
    const videoData = await step.run("get-data-db", async () => {
      const video = await Video.findById(event.data.video);
      return video;
    });

    // download the video to local storage
    console.log("downlaoding the video");
    const videoPath = await step.run("download-video", async () => {
      // save video with the id of job
      const outputPath = `tempFiles/videos/video${event.data._id}.mp4`;
      return await downloadCloudinaryVideo(videoData.secure_url, outputPath);
    });

    // extarct the audio from video
    console.log("extracting the audio");
    const audioPath = await step.run("extarct-audio", async () => {
      const inputPath = `tempFiles/videos/video${event.data._id}.mp4`;
      const outputPath = `tempFiles/audios/audio${event.data._id}.mp3`;
      return await extractAudioFromVideo(inputPath, outputPath);
    });

    // transcribe the audio
    console.log("Transcribing audio");
    const transcription = await step.run("transcribe-audio", async () => {
      const audioPath = `tempFiles/audios/audio${event.data._id}.mp3`;
      return await getTranscription(audioPath);
    });

    // translate the transcript
    console.log("Translating the transcript");
    const translatedTranscript = await step.run("translate", async () => {
      const { sourceLanguage, targetLanguage } = event.data;
      return await getTranslatedTranscript(
        transcription,
        sourceLanguage,
        targetLanguage,
      );
    });

    // generate the audio
    console.log("generating audio");
    const generatedAudioPath = await step.run("generate-audio", async () => {
      const inputAudioFilePath = `tempFiles/audios/audio${event.data._id}.mp3`;
      const outputAudioFilePath = `tempFiles/audios/translated-audio${event.data._id}.mp3`;
      await generateAudio(
        inputAudioFilePath,
        outputAudioFilePath,
        translatedTranscript,
      );
      return outputAudioFilePath;
    });

    // merge the audio and videos together
    console.log("merging audio and video");
    const mergedVideoPath = await step.run("merge-media", async () => {
      const audioPath = `tempFiles/audios/translated-audio${event.data._id}.mp3`;
      const videoPath = `tempFiles/videos/video${event.data._id}.mp4`;
      const generatedVideoPath = `tempFiles/videos/generated-video${event.data._id}.mp4`;
      await mergeAudioAndVideo(videoPath, audioPath, generatedVideoPath);
      return generatedVideoPath;
    });

    // upload the video to cloudinary
    console.log("uploading video to cloudinary");
    const cloudinaryVideo = await step.run("upload-video", async () => {
      const videoPath = `tempFiles/videos/generated-video${event.data._id}.mp4`;
      return uploadVideoToCloudinary(videoPath);
    });

    // update the video url into the job
    console.log("updating the job");
    const newjob = await step.run("update-job", async () => {
      const { secure_url, public_id } = cloudinaryVideo;

      const updatedJob = await Job.findByIdAndUpdate(
        event.data._id,
        {
          secure_url,
          public_id,
          status: "COMPLETED",
        },
        { new: true },
      );

      return updatedJob;
    });

    // cleanup all the files
    console.log("cleaning up temp files");
    await step.run("cleanup-files", async () => {
      fs.unlinkSync(`tempFiles/videos/video${event.data._id}.mp4`);
      fs.unlinkSync(`tempFiles/audios/audio${event.data._id}.mp3`);
      fs.unlinkSync(`tempFiles/audios/translated-audio${event.data._id}.mp3`);
      fs.unlinkSync(`tempFiles/videos/generated-video${event.data._id}.mp4`);
    });

    console.log("translation completed");

    return { message: "translation completed", data: newjob };
  },
);
