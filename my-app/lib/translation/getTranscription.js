import { createClient } from "@deepgram/sdk";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function transcribeLocalFile(audioPath) {
  // 1. Initialize the Deepgram Client with your API Key
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  // 2. Read the local audio file into a buffer
  // Replace 'audio.mp3' with the path to your actual file
  const audioFileBuffer = fs.readFileSync(audioPath);

  try {
    // 3. Call the transcribeFile method
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioFileBuffer,
      {
        model: "nova-3",
        detect_language: true,
        smart_format: true,
        diarize: true,
        utterances: true,
        utt_split: 1,
      },
    );

    if (error) {
      console.error("Error analyzing audio:", error);
      return;
    }

    // 4. Print the transcript
    // The response structure is deeply nested, so we access the first alternative
    const transcript = result.results.channels[0].alternatives[0].transcript;
    console.log("Transcript:", transcript);
    return result.results.utterances;
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

function convertToFormat(utterances) {
  return utterances.map((utt) => {
    return {
      start: utt.start,
      end: utt.end,
      text: utt.transcript,
      speaker: utt.speaker,
    };
  });
}

async function getTranscription(audioPath) {
  const utterances = await transcribeLocalFile(audioPath);
  const formattedTranscript = convertToFormat(utterances);
  return formattedTranscript;
}

export default getTranscription;

// const utterances = await transcribeLocalFile();
// const formattedTranscript = convertToFormat(utterances);
// fs.writeFileSync(
//   "./mostUpdated/output.json",
//   JSON.stringify({ transcript: formattedTranscript }, null, 2),
// );