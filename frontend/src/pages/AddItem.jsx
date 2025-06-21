import { useState } from "react";
import { AiOutlineUpload, AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { uploadToCloudinary } from "../helper/uploadToCloudinary";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddItem() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    coverImage: "",
    additionalImages: []
  });
  const [files, setFiles] = useState({ coverImage: null, additionalImages: [] });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles((prev) => ({ ...prev, coverImage: file }));

    const reader = new FileReader();
    reader.onload = (event) => {
      handleChange("coverImage", event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAdditionalImages = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => ({ ...prev, additionalImages: selectedFiles }));

    Promise.all(
      selectedFiles.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              resolve(event.target.result);
            };
            reader.readAsDataURL(file);
          })
      )
    ).then((results) => {
      handleChange("additionalImages", [
        ...formData.additionalImages,
        ...results,
      ]);
    });
  };

  const removeAdditionalImage = (index) => {
    handleChange(
      "additionalImages",
      formData.additionalImages.filter((_, i) => i !== index)
    );
    setFiles((prev) => {
      const newAdditionalFiles = prev.additionalImages.filter((_, i) => i !== index);
      return { ...prev, additionalImages: newAdditionalFiles };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.name || !formData.type || !formData.description || !files.coverImage) {
      toast.error("Please fill in all required fields and upload a cover image.");
      setLoading(false);
      return;
    }

    try {
      const coverUrl = files.coverImage
        ? await uploadToCloudinary(files.coverImage)
        : "";

      const additionalImageUrls = await Promise.all(
        files.additionalImages.map((img) => uploadToCloudinary(img))
      );

      const newItem = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        coverImage: coverUrl,
        additionalImages: additionalImageUrls,
      };

      const res = await axiosInstance.post("/items", newItem);

      if (res.data?.success || res.data?.item) {
        toast.success("Item successfully added!");

        setFormData({ name: "", type: "", description: "", coverImage: "", additionalImages: [] });
        setFiles({ coverImage: null, additionalImages: [] });
        navigate("/");
      }
    } catch (error) {
      console.error("Error submitting item:", error);
      alert("There was an error adding the item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Add Item</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">

          <input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Item Name"
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Item Type</option>
            {['Shirt', 'Pant', 'Shoes', 'Sports Gear'].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}

          </select>

          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Item Description"
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Cover Image Section */}
          <div className="text-center">
            <label className="font-medium block">Cover Image:</label>
            <div className="mt-2 relative rounded h-48 flex items-center justify-center border border-dashed">
              {formData.coverImage ? (
                <img
                  src={formData.coverImage}
                  alt="Cover"
                  className="h-full w-full object-cover rounded"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <AiOutlineUpload className="text-4xl" />
                  <span>Click to upload cover image</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImage}
                required
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Additional Images Section */}
          <div>
            <label className="font-medium block">Additional Images:</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.additionalImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`Additional ${index}`}
                    className="h-20 w-20 rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                  >
                    <AiOutlineClose />
                  </button>
                </div>
              ))}
              <label className="h-20 w-20 rounded border border-dashed flex flex-col items-center justify-center cursor-pointer">
                <AiOutlinePlus className="text-3xl text-gray-500" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImages}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className={`${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'} w-full flex justify-center  text-white font-semibold rounded p-3 
            `}
          >
            {
              loading ? (
                <span className="h-6 w-6 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
              ) : (

                <span>Add Item</span>
              )
            }
          </button>
        </form>

      </div>
    </div>
  );
}
