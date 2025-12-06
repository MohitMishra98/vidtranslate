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
    You are an expert video translator.
    1. Listen to the audio in the video.
    2. Identify all unique speakers and determine their gender (must be strictly 'male' or 'female').
    3. Transcribe what they say.
    4. Translate the transcription into ${language}.
    5. Return the result as a JSON object matching the provided schema.
    
    For the 'text' field in segments, provide ONLY the translated text in ${language}.
    Ensure timestamps are accurate (in seconds). Example: 1 minute 30 seconds = 90.0 seconds. Do NOT use MM:SS format or 100 for 1 minute.
    Ensure speaker names in segments match the names in the speakers list.
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

function getVoiceDescription(gender, index) {
  const maleDescriptions = [
    "Deep male voice, American accent, professional and authoritative.",
    "Soft male voice, British accent, calm and storytelling.",
    "Energetic male voice, Australian accent, friendly and upbeat.",
    "Raspy male voice, American accent, older and wise.",
  ];
  const femaleDescriptions = [
    "Clear female voice, American accent, professional and articulate.",
    "Soft female voice, British accent, soothing and warm.",
    "Energetic female voice, Indian accent, bright and engaging.",
    "Mature female voice, American accent, calm and trustworthy.",
  ];

  const descriptions =
    gender === "male" ? maleDescriptions : femaleDescriptions;
  return descriptions[index % descriptions.length];
}

async function generateAudio(transcript) {
  const audioFiles = [];

  if (!fs.existsSync("audio_segments")) {
    fs.mkdirSync("audio_segments");
  }

  const speakerMap = new Map();
  let maleCount = 0;
  let femaleCount = 0;

  // Initialize speaker map with descriptions
  if (transcript.speakers) {
    for (const speaker of transcript.speakers) {
      const description = getVoiceDescription(
        speaker.gender,
        speaker.gender === "male" ? maleCount++ : femaleCount++
      );
      speakerMap.set(speaker.name, { description, generationId: null });
    }
  }

  for (const [index, segment] of transcript.segments.entries()) {
    try {
      const speakerInfo = speakerMap.get(segment.speaker);
      let request = {
        utterances: [{ text: segment.text }],
        format: { type: "mp3" },
      };

      if (speakerInfo) {
        if (speakerInfo.generationId) {
          // Use context for consistency
          request.context = { generationId: speakerInfo.generationId };
        } else {
          // First time for this speaker, use description
          request.utterances[0].description = speakerInfo.description;
        }
      }

      // Using synthesizeJson to get base64 audio
      const response = await client.tts.synthesizeJson(request);

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

        // Save generationId for future segments of this speaker
        if (speakerInfo && !speakerInfo.generationId) {
          speakerInfo.generationId = response.generations[0].generationId;
        }

        audioFiles[audioFiles.length - 1].duration =
          response.generations[0].duration;

        console.log(
          `Generated audio for segment ${index} (Speaker: ${segment.speaker})`
        );
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
        let filter = `[${i}:a]`;

        // Check for overlap with next segment
        if (i < audioFiles.length - 1) {
          const nextStart = audioFiles[i + 1].start;
          const availableDuration = nextStart - a.start;

          if (a.duration > availableDuration) {
            let speedFactor = a.duration / availableDuration;

            // Chain atempo filters if speedFactor > 2.0
            while (speedFactor > 2.0) {
              filter += `atempo=2.0,`;
              speedFactor /= 2.0;
            }
            if (speedFactor > 1.0) {
              filter += `atempo=${speedFactor},`;
            }
            console.log(
              `Compressing segment ${i} by factor ${
                a.duration / availableDuration
              }`
            );
          }
        }

        return `${filter}adelay=${delay}|${delay}[a${i}]`;
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

  const transcript = await generateTranscriptAndTranslate(videoFile, "hindi");

  console.log("Final Transcript:", transcript);

  console.log("Generating audio segments...");
  const audioFiles = await generateAudio(transcript);

  console.log("Merging audio segments...");
  await mergeAudio(audioFiles);
}

main();
