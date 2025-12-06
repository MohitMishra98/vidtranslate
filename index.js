import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import { z } from "zod";
import { transcriptSchema } from "./schema.js";
import { HumeClient } from "hume";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

console.log(z.toJSONSchema(transcriptSchema));

const ai = new GoogleGenAI({});
const client = new HumeClient({ apiKey: process.env.HUME_API_KEY });

async function generateTranscriptAndTranslate(videoFile, language = "english") {
  const prompt = `
    transcribe and translate this video from the provided URL into a JSON format
    translate the transcript into ${language}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: createUserContent([
      createPartFromUri(videoFile.uri, videoFile.mimeType),
      prompt,
    ]),
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(transcriptSchema),
    },
  });

  console.log("Raw response text:", response.text);

  const transcript = transcriptSchema.parse(JSON.parse(response.text));
  console.log(transcript);

  return transcript;
}

async function uploadVideoFile(filePath = "./sample_video.mp4") {
  const myfile = await ai.files.upload({
    file: filePath,
    config: { mimeType: "video/mp4" },
  });

  return myfile;
}

async function generateAudio(transcript) {
  const audioFiles = [];

  if (!fs.existsSync("audio_segments")) {
    fs.mkdirSync("audio_segments");
  }

  for (const [index, segment] of transcript.segments.entries()) {
    try {
      // Using synthesizeJson to get base64 audio
      const response = await client.tts.synthesizeJson({
        utterances: [{ text: segment.text }],
        format: { type: "mp3" },
      });

      if (
        response &&
        response.generations &&
        response.generations.length > 0 &&
        response.generations[0].audio
      ) {
        const fileName = `audio_segments/segment_${index}.mp3`;
        fs.writeFileSync(
          fileName,
          Buffer.from(response.generations[0].audio, "base64")
        );
        audioFiles.push({
          file: fileName,
          start: segment.start_time,
        });
        console.log(`Generated audio for segment ${index}`);
      } else {
        console.error(`No audio generated for segment ${index}`);
      }
    } catch (error) {
      console.error(`Error generating audio for segment ${index}:`, error);
    }
  }
  return audioFiles;
}

async function mergeAudio(audioFiles) {
  return new Promise((resolve, reject) => {
    if (audioFiles.length === 0) {
      resolve(null);
      return;
    }

    const command = ffmpeg();

    audioFiles.forEach((a) => {
      command.input(a.file);
    });

    const complexFilter = audioFiles
      .map((a, i) => {
        const delay = Math.round(a.start * 1000);
        return `[${i}:a]adelay=${delay}[a${i}]`;
      })
      .join(";");

    const mixInputs = audioFiles.map((_, i) => `[a${i}]`).join("");
    const filter = `${complexFilter};${mixInputs}amix=inputs=${audioFiles.length}:duration=longest[out]`;

    command
      .complexFilter(filter)
      .map("[out]")
      .save("final_audio.mp3")
      .on("end", () => {
        console.log("Audio merge finished: final_audio.mp3");
        resolve("final_audio.mp3");
      })
      .on("error", (err) => {
        console.error("Error merging audio:", err);
        reject(err);
      });
  });
}

async function main() {
  const videoFile = await uploadVideoFile();

  await new Promise((resolve) => setTimeout(resolve, 30000));

  const transcript = await generateTranscriptAndTranslate(videoFile, "english");

  console.log("Final Transcript:", transcript);

  console.log("Generating audio segments...");
  const audioFiles = await generateAudio(transcript);

  console.log("Merging audio segments...");
  await mergeAudio(audioFiles);
}

main();
