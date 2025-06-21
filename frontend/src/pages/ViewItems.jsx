import { useState, useEffect } from "react";
import ItemModal from "../components/ItemModal";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

export default function ViewItems() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);


  const fetchAllItems = async () => {
    try {
      const response = await axiosInstance.get("/items");
      return response.data;
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to load items. Please try again later.");
      return null; 
    }
  }
  useEffect(() => {
    const loadItems = async () => {
      const storedItems = await fetchAllItems();
      setItems(storedItems);
    };
    loadItems();
  }, []); 

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 text-center">View Items</h1>
      <p className="text-gray-600 text-center mt-2 max-w-2xl mx-auto">
        Here you can browse all available items. Click on any item to view its details,
        images, and description. Our collection includes a variety of products such as
        shirts, pants, shoes, and sports gear.
      </p>
      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {items.length > 0 && items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition transform cursor-pointer p-4"
            onClick={() => setSelectedItem(item)}
          >
            <img
              src={item.coverImage}
              alt={item.name}
              className="h-40 w-full object-cover rounded-xl"
            />
            <div className="mt-3 text-center">
              <h2 className="font-semibold text-gray-800 text-lg">{item.name}</h2>
              <span className="text-gray-600 text-sm">{item.type}</span>
            </div>
          </div>
        ))}
      </div>
        {items.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No items available at the moment. Please check back later.
          </div>
        )}

      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
