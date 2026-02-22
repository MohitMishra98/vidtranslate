import cloudinary from "@/lib/cloudinary";
import path from "path";

async function uploadVideoToCloudinary(localFilePath) {
  // Resolve the absolute path to ensure Cloudinary can find the file
  const resolvedPath = path.resolve(process.cwd(), localFilePath);

  console.log(`Starting upload to Cloudinary for: ${resolvedPath}`);

  try {
    // 2. Execute the upload
    const result = await cloudinary.uploader.upload(resolvedPath, {
      resource_type: "video", // CRITICAL: Tells Cloudinary to process this as a video, not an image
      folder: "my_uploaded_videos", // Optional: Organizes your files into a specific folder
      use_filename: true, // Optional: Keeps the original file's name
      unique_filename: false, // Optional: Prevents Cloudinary from appending random characters to the name
    });

    console.log(`✅ Upload successful!`);
    console.log(`Public ID: ${result.public_id}`);
    console.log(`Secure URL: ${result.secure_url}`);

    return result;
  } catch (error) {
    console.error(`❌ Upload failed: ${error.message}`);
    throw error;
  }
}

export default uploadVideoToCloudinary;
