import z from "zod";

const transcriptSchema = z.object({
    speakers: z.array(z.string()).describe("List of speaker names or identifiers."),
    segments: z.array(
        z.object({
            speaker: z.string().describe("Speaker name or identifier."),
            start_time: z.number().describe("Start time in seconds (supports millisecond precision, e.g., 1.234)."),
            end_time: z.number().describe("End time in seconds (supports millisecond precision, e.g., 5.678)."),
            text: z.string().describe("Transcribed text for the segment."),
        })
    ).describe("Array of transcribed segments with speaker attribution and timestamps."),
})

export {transcriptSchema}