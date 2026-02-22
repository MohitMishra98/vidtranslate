import { exec } from "child_process";
import path from "path";
import fs from "fs";

async function mergeAudioAndVideo(videoPath, audioPath, outputPath) {
  // 1. Resolve absolute paths for all files
  const resolvedVideo = path.resolve(process.cwd(), videoPath);
  const resolvedAudio = path.resolve(process.cwd(), audioPath);
  const resolvedOutput = path.resolve(process.cwd(), outputPath);

  // Ensure the output directory exists
  fs.mkdirSync(path.dirname(resolvedOutput), { recursive: true });

  // 2. Construct the FFmpeg command
  // -i: inputs (0 is video, 1 is audio)
  // -c:v copy: copies the video stream without re-encoding (lightning fast)
  // -c:a aac: encodes the new audio to AAC (standard for MP4 compatibility)
  // -map 0:v:0: takes the first video stream from the first input
  // -map 1:a:0: takes the first audio stream from the second input
  // -shortest: ends the output file when the shortest input stream ends
  const command = `ffmpeg -i "${resolvedVideo}" -i "${resolvedAudio}" -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 -shortest "${resolvedOutput}"`;

  return new Promise((resolve, reject) => {
    console.log(
      `Starting merge process...\nVideo: ${resolvedVideo}\nAudio: ${resolvedAudio}\nOutput: ${resolvedOutput}`,
    );

    // 3. Execute the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Failed to merge files: ${error.message}`);
        return reject(error);
      }

      console.log(`✅ Successfully merged! Saved to ${resolvedOutput}`);
      resolve();
    });
  });
}

export default mergeAudioAndVideo;
