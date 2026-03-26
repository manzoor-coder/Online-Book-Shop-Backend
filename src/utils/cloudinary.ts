import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config(); 


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) {
            console.log("No file path provided");
            return null;
        }

        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: 'auto',
        });

        // console.log("File uploaded successfully", response.url);
        fs.unlinkSync(localfilepath)
        return response;

    } catch (error) {
        console.error("Cloudinary upload error:", error); // 👈 this helps!
        try {
            fs.unlinkSync(localfilepath);
        } catch (fsError) {
            console.error("Failed to delete temp file:", fsError);
        }
        return null;
    }
}



export {uploadOnCloudinary}