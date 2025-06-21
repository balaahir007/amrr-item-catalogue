import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

export default function ItemModal({ item, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [item.coverImage, ...item.additionalImages];
  const [loading, setLoading] = useState(false);

const handleEnquiry = async () => {
  setLoading(true);
  const data = {
    itemId: item.id,
    itemName: item.name,
    itemType: item.type,
    itemDescription: item.description,
    coverImage: item.coverImage,
    additionalImages: item.additionalImages,
  };
  
  try {
    const response = await axiosInstance.post("/items/enquire", data);
    
    if (response.data.success) {
      toast.success("Enquiry sent successfully!");
      onClose();
    } else {
      toast.error("Failed to send enquiry. Please try again later.");
    }
  } catch (error) {
    console.error(error);
    toast.error("An error occurred while sending the enquiry.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-[400px] space-y-5 relative shadow-lg">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 cursor-pointer text-gray-500 hover:text-gray-800 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Item Info */}
        <h2 className="text-2xl font-bold text-gray-800">{item.name}</h2>
        <div className="text-gray-600 font-medium">{item.type}</div>
        <p className="text-gray-700">{item.description}</p>

        {/* Image Carousel */}
        <div className="relative flex flex-col items-center">
          <img
            src={images[currentIndex]}
            alt={item.name}
            className="h-64 w-64 object-cover rounded-xl border border-gray-300"
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center space-x-3">
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
            }
            className="bg-gray-200 hover:bg-gray-300 rounded-full p-2"
            title="Previous"
          >
            ⬅️
          </button>
          <span className="text-gray-600">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % images.length)
            }
            className="bg-gray-200 hover:bg-gray-300 rounded-full p-2"
            title="Next"
          >
            ➡️
          </button>
        </div>

        {/* Enquire Button */}
        <button disabled={loading} className={`${loading ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'} flex justify-center  text-white font-semibold rounded-xl p-3 w-full`} onClick={handleEnquiry}>
          {
            loading ? (
              <span className="h-6 w-6 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
            ) : (
              "Enquire Now"
            )
          }
        </button>
      </div>
    </div>
  );
}
