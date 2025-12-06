import { HumeClient } from "hume";
import dotenv from "dotenv";
dotenv.config();

const client = new HumeClient({ apiKey: process.env.HUME_API_KEY });
console.log(
  "TTS methods:",
  Object.getOwnPropertyNames(Object.getPrototypeOf(client.tts))
);
