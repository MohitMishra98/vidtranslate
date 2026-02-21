import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { Client } from "@gradio/client";
import dotenv from "dotenv";
import wav from "wav";

dotenv.config({});
const execFileAsync = promisify(execFile);

// ── Config ──────────────────────────────────────────────────────────────
const SAMPLE_RATE = 24000; // Output: 24 kHz
const BIT_DEPTH = 16;
const CHANNELS = 1;
const BYTES_PER_SAMPLE = BIT_DEPTH / 8; // 2
const MAX_COMPRESSION_RATIO = 2.5; // cap to keep audio natural
const RATE_LIMIT_DELAY_MS = 2000; // delay between requests (tune as needed)
const TMP_DIR = "/tmp/tts_pipeline";
const MIN_REFERENCE_SECONDS = 3; // minimum reference audio length (API requires 3+)
const MAX_REFERENCE_SECONDS = 15; // cap reference slice length
const QWEN_TTS_URL = process.env.QWEN_TTS_URL;

// ── Helpers ─────────────────────────────────────────────────────────────

/** Parse "s.ms" timestamp string (e.g. "35.170002") into milliseconds */
function parseTimestampMs(ts) {
  return Math.round(parseFloat(ts) * 1000);
}

/** Convert milliseconds to byte offset in the PCM canvas */
function msToBytesOffset(ms) {
  return Math.round((ms / 1000) * SAMPLE_RATE) * BYTES_PER_SAMPLE;
}

/** Get duration of a raw PCM buffer in milliseconds */
function pcmDurationMs(buffer) {
  return (buffer.length / BYTES_PER_SAMPLE / SAMPLE_RATE) * 1000;
}

/**
 * Build an ffmpeg atempo filter chain for the given ratio.
 * atempo only accepts values in [0.5, 2.0] per instance,
 * so we chain multiple filters for ratios outside that range.
 */
function buildAtempoFilter(ratio) {
  const filters = [];
  let remaining = ratio;
  while (remaining > 2.0) {
    filters.push("atempo=2.0");
    remaining /= 2.0;
  }
  while (remaining < 0.5) {
    filters.push("atempo=0.5");
    remaining /= 0.5;
  }
  filters.push(`atempo=${remaining.toFixed(4)}`);
  return filters.join(",");
}

/**
 * Write a raw PCM buffer as a WAV file.
 * Returns a promise that resolves when writing is complete.
 */
function writePcmToWav(pcmBuffer, filePath) {
  return new Promise((resolve, reject) => {
    const writer = new wav.FileWriter(filePath, {
      channels: CHANNELS,
      sampleRate: SAMPLE_RATE,
      bitDepth: BIT_DEPTH,
    });
    writer.on("done", resolve);
    writer.on("error", reject);
    writer.write(pcmBuffer);
    writer.end();
  });
}

/**
 * Read a WAV file and return its raw PCM data buffer.
 * Returns a promise that resolves with the PCM Buffer.
 */
function readWavToPcm(filePath) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const reader = new wav.Reader();
    reader.on("data", (chunk) => chunks.push(chunk));
    reader.on("end", () => resolve(Buffer.concat(chunks)));
    reader.on("error", reject);
    fs.createReadStream(filePath).pipe(reader);
  });
}

/**
 * Compress a PCM audio buffer by the given ratio using ffmpeg atempo.
 * Preserves pitch. Returns the compressed PCM buffer.
 */
async function compressAudio(pcmBuffer, ratio, segmentIndex) {
  const inputPath = path.join(TMP_DIR, `segment_${segmentIndex}_in.wav`);
  const outputPath = path.join(TMP_DIR, `segment_${segmentIndex}_out.wav`);

  // Write input WAV
  await writePcmToWav(pcmBuffer, inputPath);

  // Run ffmpeg with atempo filter chain
  const filterChain = buildAtempoFilter(ratio);
  await execFileAsync("ffmpeg", [
    "-y",
    "-i",
    inputPath,
    "-filter:a",
    filterChain,
    "-ar",
    String(SAMPLE_RATE),
    "-ac",
    String(CHANNELS),
    "-sample_fmt",
    "s16",
    outputPath,
  ]);

  // Read compressed audio back as PCM
  const compressedPcm = await readWavToPcm(outputPath);

  // Clean up temp files
  fs.unlinkSync(inputPath);
  fs.unlinkSync(outputPath);

  return compressedPcm;
}

/**
 * Slice a segment from the source audio by start time and duration.
 * Returns the path to the sliced WAV file.
 */
async function sliceSpeakerReference(
  inputPath,
  startSec,
  durationSec,
  speakerId,
) {
  const outputPath = path.join(TMP_DIR, `reference_speaker_${speakerId}.wav`);
  await execFileAsync("ffmpeg", [
    "-y",
    "-ss",
    String(startSec),
    "-i",
    inputPath,
    "-t",
    String(durationSec),
    "-ar",
    "24000",
    "-ac",
    "1",
    outputPath,
  ]);
  return outputPath;
}

/**
 * Scan the transcript to find unique speakers, then for each speaker,
 * pick the best segment(s) from the source audio to use as a voice reference.
 * Concatenates consecutive segments if a single one is too short.
 * Returns a Map<speakerId, Blob>.
 */
async function buildSpeakerReferences(transcriptArray, sourceAudioPath) {
  // Collect all segments grouped by speaker
  const speakerSegments = new Map();
  for (const entry of transcriptArray) {
    if (!speakerSegments.has(entry.speaker)) {
      speakerSegments.set(entry.speaker, []);
    }
    speakerSegments.get(entry.speaker).push({
      start: parseFloat(entry.start),
      end: parseFloat(entry.end),
    });
  }

  const speakerBlobs = new Map();

  for (const [speakerId, segments] of speakerSegments) {
    // Sort segments by start time
    segments.sort((a, b) => a.start - b.start);

    // Strategy: find the longest single segment, or merge consecutive ones
    // to reach at least MIN_REFERENCE_SECONDS
    let bestStart = segments[0].start;
    let bestDuration = 0;

    // First pass: try to find a single segment >= MIN_REFERENCE_SECONDS
    for (const seg of segments) {
      const dur = seg.end - seg.start;
      if (dur > bestDuration) {
        bestStart = seg.start;
        bestDuration = dur;
      }
    }

    // If the best single segment is too short, merge consecutive segments
    if (bestDuration < MIN_REFERENCE_SECONDS && segments.length > 1) {
      let mergedStart = segments[0].start;
      let mergedEnd = segments[0].end;
      for (let j = 1; j < segments.length; j++) {
        const gap = segments[j].start - mergedEnd;
        if (gap <= 2.0) {
          // Allow small gaps (silence) between segments
          mergedEnd = segments[j].end;
        } else {
          // Check if current merged span is long enough
          if (mergedEnd - mergedStart >= MIN_REFERENCE_SECONDS) break;
          // Otherwise restart from this segment
          mergedStart = segments[j].start;
          mergedEnd = segments[j].end;
        }
      }
      if (mergedEnd - mergedStart > bestDuration) {
        bestStart = mergedStart;
        bestDuration = mergedEnd - mergedStart;
      }
    }

    // Cap the reference duration
    bestDuration = Math.min(bestDuration, MAX_REFERENCE_SECONDS);

    console.log(
      `  Speaker "${speakerId}": slicing ${bestDuration.toFixed(1)}s reference from ${bestStart.toFixed(1)}s`,
    );

    const wavPath = await sliceSpeakerReference(
      sourceAudioPath,
      bestStart,
      bestDuration,
      speakerId,
    );
    const buf = fs.readFileSync(wavPath);
    speakerBlobs.set(speakerId, new Blob([buf], { type: "audio/wav" }));
    console.log(
      `  ✓ Speaker "${speakerId}" reference ready (${(buf.length / 1024).toFixed(1)} KB)`,
    );
  }

  return speakerBlobs;
}

/**
 * Convert a Gradio-returned audio file (fetched from URL) to raw PCM.
 * Downloads the audio, then uses ffmpeg to convert to 24kHz mono s16le PCM.
 * Returns the PCM buffer.
 */
async function gradioAudioToPcm(audioUrl, segmentIndex) {
  const downloadPath = path.join(TMP_DIR, `gradio_${segmentIndex}_dl.wav`);
  const pcmPath = path.join(TMP_DIR, `gradio_${segmentIndex}_pcm.wav`);

  // Fetch the audio file from the Gradio server
  const resp = await fetch(audioUrl);
  if (!resp.ok) throw new Error(`Failed to fetch audio: ${resp.status}`);
  const arrayBuf = await resp.arrayBuffer();
  fs.writeFileSync(downloadPath, Buffer.from(arrayBuf));

  // Convert to 24kHz mono s16le WAV using ffmpeg
  await execFileAsync("ffmpeg", [
    "-y",
    "-i",
    downloadPath,
    "-ar",
    String(SAMPLE_RATE),
    "-ac",
    String(CHANNELS),
    "-sample_fmt",
    "s16",
    pcmPath,
  ]);

  // Read back as raw PCM
  const pcmBuffer = await readWavToPcm(pcmPath);

  // Clean up
  fs.unlinkSync(downloadPath);
  fs.unlinkSync(pcmPath);

  return pcmBuffer;
}

// ── Main pipeline ───────────────────────────────────────────────────────

/**
 * Generate time-aligned TTS audio from a transcript using voice cloning.
 *
 * @param {string} inputAudioPath  – Path to the reference/source audio file
 *                                    used for voice cloning per speaker.
 * @param {string} outputAudioPath – Path where the final WAV file will be written.
 * @param {Array<{speaker: string, start: string, end: string, text: string}>} transcriptArray
 *   – Array of transcript entries. Each entry must have:
 *       • speaker  – speaker identifier
 *       • start    – start timestamp in seconds (e.g. "1.540")
 *       • end      – end timestamp in seconds   (e.g. "4.230")
 *       • text     – the text to synthesise
 */
async function generateAudio(inputAudioPath, outputAudioPath, transcriptArray) {
  if (!QWEN_TTS_URL) {
    throw new Error("QWEN_TTS_URL is not set in environment variables");
  }

  if (!transcriptArray || transcriptArray.length === 0) {
    throw new Error("transcriptArray is empty or undefined");
  }

  // Resolve relative paths to absolute
  inputAudioPath = path.resolve(inputAudioPath);
  outputAudioPath = path.resolve(outputAudioPath);

  // Create temp directory
  fs.mkdirSync(TMP_DIR, { recursive: true });

  try {
    // Build per-speaker reference audio blobs from the source audio
    const uniqueSpeakers = [...new Set(transcriptArray.map((e) => e.speaker))];
    console.log(
      `Found ${uniqueSpeakers.length} speaker(s): ${uniqueSpeakers.map((s) => `"${s}"`).join(", ")}`,
    );
    console.log(
      `Extracting per-speaker voice references from ${inputAudioPath}...`,
    );
    const speakerBlobs = await buildSpeakerReferences(
      transcriptArray,
      inputAudioPath,
    );
    console.log(`✓ All speaker references ready`);

    // Connect to Qwen3 TTS Gradio endpoint
    console.log(`Connecting to Qwen3 TTS at ${QWEN_TTS_URL}...`);
    const client = await Client.connect(QWEN_TTS_URL);
    console.log(`✓ Connected to Qwen3 TTS`);

    // Calculate total audio duration from the last transcript entry
    const lastEntry = transcriptArray[transcriptArray.length - 1];
    const totalDurationMs = parseTimestampMs(lastEntry.end);
    const canvasSizeBytes = msToBytesOffset(totalDurationMs);

    console.log(
      `Total canvas duration: ${totalDurationMs}ms (${(totalDurationMs / 1000).toFixed(1)}s)`,
    );
    console.log(
      `Canvas size: ${(canvasSizeBytes / 1024 / 1024).toFixed(2)} MB`,
    );

    // Create silent PCM canvas (zero-filled = silence)
    const canvas = Buffer.alloc(canvasSizeBytes, 0);

    // Process each transcript entry
    const entriesToProcess = transcriptArray.length;

    for (let i = 0; i < entriesToProcess; i++) {
      const entry = transcriptArray[i];
      const startMs = parseTimestampMs(entry.start);
      const endMs = parseTimestampMs(entry.end);
      const targetDurationMs = endMs - startMs;

      console.log(
        `\n[${i + 1}/${entriesToProcess}] Speaker "${entry.speaker}" | Generating TTS for: "${entry.text.substring(0, 60)}..."`,
      );
      console.log(
        `  Target slot: ${startMs}ms → ${endMs}ms (${targetDurationMs}ms)`,
      );

      // Rate limit: wait between API calls (tune delay as needed)
      if (i > 0) {
        console.log(
          `  ⏳ Waiting ${RATE_LIMIT_DELAY_MS / 1000}s between requests...`,
        );
        await new Promise((resolve) =>
          setTimeout(resolve, RATE_LIMIT_DELAY_MS),
        );
      }

      // Get the correct speaker reference blob
      const speakerRef = speakerBlobs.get(entry.speaker);
      if (!speakerRef) {
        console.error(
          `  ✗ No reference audio for speaker "${entry.speaker}", skipping.`,
        );
        continue;
      }

      // Call Qwen3 TTS via Gradio voice_clone endpoint
      let result;
      try {
        result = await client.predict("/voice_clone", {
          text: entry.text,
          reference_audio: speakerRef,
          ref_transcript: "",
          use_fast_mode: false,
        });
      } catch (err) {
        console.error(`  ✗ TTS request failed for entry ${i}: ${err.message}`);
        continue;
      }

      const audioData = result?.data?.[0];
      if (!audioData || !audioData.url) {
        console.error(`  ✗ No audio data returned for entry ${i}, skipping.`);
        continue;
      }

      // Download & convert Gradio audio response to raw PCM
      let pcmBuffer;
      try {
        pcmBuffer = await gradioAudioToPcm(audioData.url, i);
      } catch (err) {
        console.error(
          `  ✗ Failed to process audio for entry ${i}: ${err.message}`,
        );
        continue;
      }
      const generatedDurationMs = pcmDurationMs(pcmBuffer);
      const ratio = generatedDurationMs / targetDurationMs;

      console.log(
        `  Generated: ${generatedDurationMs.toFixed(0)}ms | Ratio: ${ratio.toFixed(2)}x`,
      );

      // Compress if generated audio is longer than the target slot
      if (ratio > 1.0) {
        const effectiveRatio = Math.min(ratio, MAX_COMPRESSION_RATIO);
        console.log(
          `  Compressing at ${effectiveRatio.toFixed(2)}x (cap: ${MAX_COMPRESSION_RATIO}x)...`,
        );
        pcmBuffer = await compressAudio(pcmBuffer, effectiveRatio, i);
        const newDurationMs = pcmDurationMs(pcmBuffer);
        console.log(`  After compression: ${newDurationMs.toFixed(0)}ms`);
      } else {
        console.log(`  Shorter than slot — no compression needed.`);
      }

      // Place audio at the correct offset in the canvas
      const byteOffset = msToBytesOffset(startMs);
      const bytesToCopy = Math.min(
        pcmBuffer.length,
        canvas.length - byteOffset,
      );

      if (bytesToCopy > 0) {
        pcmBuffer.copy(canvas, byteOffset, 0, bytesToCopy);
        console.log(`  ✓ Placed at offset ${byteOffset} bytes (${startMs}ms)`);
      } else {
        console.error(
          `  ✗ Buffer overflow, could not place audio for entry ${i}`,
        );
      }
    }

    // Ensure output directory exists
    fs.mkdirSync(path.dirname(outputAudioPath), { recursive: true });

    // Write the final canvas as a WAV file
    console.log(`\nWriting final WAV to ${outputAudioPath}...`);
    await writePcmToWav(canvas, outputAudioPath);
    console.log(
      `✓ Done! Output: ${outputAudioPath} (${(totalDurationMs / 1000).toFixed(1)}s)`,
    );
  } finally {
    // Clean up temp dir
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
  }
}

export default generateAudio;
