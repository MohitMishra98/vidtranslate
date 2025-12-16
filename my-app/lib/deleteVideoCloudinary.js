import cloudinary from "./cloudinary";

export async function deleteVideoCloudinary(publicId) {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "video",
    invalidate: true,
  });
  console.log(result);
  return result;
}
