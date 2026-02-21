import { exec } from "child_process";
import path from "path"
import fs from "fs"

async function extractAudioFromVideo(videoPath, audioPath) {
  // 1. Resolve absolute paths to avoid any "file not found" headaches
  const resolvedVideo = path.resolve(process.cwd(), videoPath);
  const resolvedAudio = path.resolve(process.cwd(), audioPath);

  // Ensure the output directory exists
  fs.mkdirSync(path.dirname(resolvedAudio), { recursive: true });

  // 2. Construct the FFmpeg command
  // -i: specifies the input file
  // -q:a 0: sets audio quality to the highest variable bitrate
  // -map a: maps only the audio stream (drops the video entirely)
  const command = `ffmpeg -i "${resolvedVideo}" -q:a 0 -map a "${resolvedAudio}"`;

  return new Promise((resolve, reject) => {
    console.log(`Starting extraction...\nVideo: ${resolvedVideo}\nTarget: ${resolvedAudio}`);

    // 3. Execute the command in the system's shell
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Failed to extract audio: ${error.message}`);
        return reject(error);
      }

      // Note: FFmpeg usually outputs its progress to stderr, not stdout.
      // But if there is no error object, the process succeeded.
      console.log(`✅ Audio successfully saved to ${resolvedAudio}`);
      resolve(resolvedAudio);
    });
  });
}

export default extractAudioFromVideo