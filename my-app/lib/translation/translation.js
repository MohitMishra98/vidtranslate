import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const ai = new GoogleGenAI({});

const transcriptSchema = z.object({
  text: z.string().describe("actual text spoken"),
  start: z.string().describe("starting timestamp for the text segment"),
  end: z.string().describe("ending timestamp for the text segment"),
  speaker: z.string().describe("name of the speaker"),
});

const outputSchema = z.object({
  transcript: z.array(transcriptSchema),
});

async function getTranslatedTranscript(
  inputTranscriptArr,
  sourceLanguage,
  targetLanguage,
) {
  const prompt = `
translate the content in text part from ${sourceLanguage} to ${targetLanguage}
you should consider the all the text part to be related while translating
make sure to properly translate text while and use localised idioms and phrases to target language
do not make the translated language to complex and maintain day to day style
`;

  const inputTranscript = { transcript: inputTranscriptArr };
  const inputTranscriptString = JSON.stringify(inputTranscript);

  console.log(inputTranscriptString);
  console.log(inputTranscript);

  // TODO: change model to 3 flash
  // 2.5 flash does not support high thinking level, so we are using 2.5 flash for now, once 3 flash is available we can switch to it and use high thinking level for better translation quality
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${prompt} ${inputTranscriptString}`,
    config: {
      // thinkingConfig: {
      //   thinkingLevel: ThinkingLevel.HIGH,
      // },
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(outputSchema),
    },
  });

  const transcript = outputSchema.parse(JSON.parse(response.text));
  console.log(transcript);

  // Merge translated text back into original entries, preserving timing and speaker info
  return inputTranscriptArr.map((entry, i) => ({
    ...entry,
    text: transcript.transcript[i]?.text ?? entry.text,
  }));
}

export default getTranslatedTranscript;
