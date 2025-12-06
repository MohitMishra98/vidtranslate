import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import { z } from "zod";
import { transcriptSchema } from "./schema.js";
import wav from "wav";

console.log(z.toJSONSchema(transcriptSchema));

const ai = new GoogleGenAI({});

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

// converting the transacript into specific format to pass it to tts model
function convertTranscriptForTTS(transcript) {
  if (!transcript.segments || transcript.segments.length === 0) {
    return "";
  }

  // Merge consecutive segments from the same speaker
  const mergedSegments = [];

  for (const segment of transcript.segments) {
    const lastSegment = mergedSegments[mergedSegments.length - 1];

    if (lastSegment && lastSegment.speaker === segment.speaker) {
      // Same speaker - append text to previous segment
      lastSegment.text += " " + segment.text;
    } else {
      // Different speaker - add new segment
      mergedSegments.push({
        speaker: segment.speaker,
        text: segment.text,
      });
    }
  }

  // Build the TTS prompt
  const speakerList = transcript.speakers.join(" and ");
  let result = `TTS the following conversation between ${speakerList}:\n`;

  for (const segment of mergedSegments) {
    result += `         ${segment.speaker}: ${segment.text}\n`;
  }

  return result;
}

async function generateSpeech(ttsPrompt) {
  async function saveWaveFile(
    filename,
    pcmData,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
  ) {
    return new Promise((resolve, reject) => {
      const writer = new wav.FileWriter(filename, {
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });

      writer.on("finish", resolve);
      writer.on("error", reject);

      writer.write(pcmData);
      writer.end();
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: ttsPrompt }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            {
              speaker: "Joe",
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: "Kore" },
              },
            },
            {
              speaker: "Jane",
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: "Puck" },
              },
            },
          ],
        },
      },
    },
  });

  const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  const audioBuffer = Buffer.from(data, "base64");

  const fileName = "out.wav";
  await saveWaveFile(fileName, audioBuffer);
}

async function uploadVideoFile(filePath = "./sample_video.mp4") {
  const myfile = await ai.files.upload({
    file: filePath,
    config: { mimeType: "video/mp4" },
  });

  return myfile;
}

async function uploadAudioFile(filePath = "./out.wav") {
  const myfile = await ai.files.upload({
    file: filePath,
    config: { mimeType: "audio/wav" },
  });

  return myfile;
}

function trimTranscript(transcript) {
  return {
    speakers: [...transcript.speakers],
    segments: transcript.segments.map(({ speaker, text }) => ({
      speaker,
      text,
    })),
  };
}

async function detectStamps(toDetect, audioFile) {
  const prompt = `
    you are provided with an audio file and a list of stamp phrases to detect within the audio
    analyze the audio and identify the timestamps where each stamp phrase occurs
    return the results in a JSON format matching the provided schema
    the list of stamp phrases to detect are: ${toDetect.toString()}
    make sure to exaclty match the stamp phrases from the provided list
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: createUserContent([
      createPartFromUri(audioFile.uri, audioFile.mimeType),
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

async function main() {
  const videoFile = await uploadVideoFile();

  await new Promise((resolve) => setTimeout(resolve, 30000));

  const transcript = await generateTranscriptAndTranslate(videoFile, "english");
  const ttsPrompt = convertTranscriptForTTS(transcript);
  console.log(ttsPrompt);

  await generateSpeech(ttsPrompt);

  await new Promise((resolve) => setTimeout(resolve, 30000));

  const audioFile = await uploadAudioFile();

  await new Promise((resolve) => setTimeout(resolve, 30000));

  const trimmedTranscript = trimTranscript(transcript);

  const detectedStamps = await detectStamps(trimmedTranscript, audioFile);

  console.log("Detected Stamps:", detectedStamps);
}

main();
