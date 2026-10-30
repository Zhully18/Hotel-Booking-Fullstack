import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Configure Cloudinary
const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    })
}

// Use memory storage so we can grab the buffer directly
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Helper function to upload a buffer to Cloudinary
export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "hotel-rooms", resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export default connectCloudinary;