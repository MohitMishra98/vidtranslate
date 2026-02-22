import axios from "axios";
import fs from "fs";
import path from "path";

async function downloadCloudinaryVideo(secureUrl, localFilename) {
  // Resolve the full path where the video will be saved
  const outputPath = path.resolve(process.cwd(), localFilename);

  // Ensure the output directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const writer = fs.createWriteStream(outputPath);

  try {
    console.log(`Starting download from: ${secureUrl}`);

    // Make the GET request, crucially setting responseType to 'stream'
    const response = await axios({
      method: "GET",
      url: secureUrl,
      responseType: "stream",
    });

    // Pipe the data stream directly to the file system
    response.data.pipe(writer);

    // Return a promise that resolves when the file is fully written
    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        console.log(`✅ Video successfully saved to ${outputPath}`);
        resolve(outputPath);
      });

      writer.on("error", (err) => {
        console.error("❌ Error writing to file.");
        reject(err);
      });
    });
  } catch (error) {
    console.error(`❌ Failed to download video: ${error.message}`);
    // Clean up the empty/partial file if the download fails
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
    throw error;
  }
}

export default downloadCloudinaryVideo;
