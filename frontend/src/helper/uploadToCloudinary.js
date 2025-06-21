import axiosInstance from "../utils/axiosInstance";

 // Replace

const cloudName = import.meta.env.VITE_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUD_PRESET;

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const res = await axiosInstance.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
