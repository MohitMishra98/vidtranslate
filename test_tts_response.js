import { HumeClient } from "hume";
import dotenv from "dotenv";
dotenv.config();

const client = new HumeClient({ apiKey: process.env.HUME_API_KEY });

async function testTTS() {
  try {
    const response = await client.tts.synthesizeJson({
      utterances: [{ text: "Hello world" }],
      format: { type: "mp3" },
    });
    console.log("Response keys:", Object.keys(response));
    if (response.generations) {
      console.log("Generations length:", response.generations.length);
      if (response.generations.length > 0) {
        console.log(
          "First generation keys:",
          Object.keys(response.generations[0])
        );
      }
    }
  } catch (e) {
    console.error(e);
  }
}

testTTS();
