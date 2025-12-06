import { HumeClient } from "hume";
import dotenv from "dotenv";
dotenv.config();

const client = new HumeClient({ apiKey: process.env.HUME_API_KEY });

async function listVoices() {
  try {
    const response = await client.tts.voices.list();
    console.log(JSON.stringify(response, null, 2));
  } catch (e) {
    console.error(e);
  }
}

listVoices();
