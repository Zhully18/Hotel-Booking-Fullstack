import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Upload, X, Plus, CheckCircle, AlertCircle } from "lucide-react";

export default function AddRoom() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    roomType: "Deluxe Suite",
    roomNumber: "",
    pricePerNight: "",
    capacity: "2",
    description: "",
  });

  const [amenities, setAmenities] = useState(["Free WiFi", "Smart TV", "Air Conditioning"]);
  const [newAmenity, setNewAmenity] = useState("");
  const [images, setImages] = useState([]); // File objects for preview & upload
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle standard text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add custom amenity
  const handleAddAmenity = (e) => {
    e.preventDefault();
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  // Remove amenity
  const handleRemoveAmenity = (amenityToRemove) => {
    setAmenities(amenities.filter((item) => item !== amenityToRemove));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }
    setImages([...images, ...files]);
  };

  // Remove selected image preview
  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  // Submit form data using FormData (multipart/form-data for files + text)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const data = new FormData();
      data.append("roomType", formData.roomType);
      data.append("roomNumber", formData.roomNumber);
      data.append("pricePerNight", formData.pricePerNight);
      data.append("capacity", formData.capacity);
      data.append("description", formData.description);

      // Append amenities as a JSON string
      data.append("amenities", JSON.stringify(amenities));

      // Append image files under the field name "images" (matches multer middleware: upload.array("images", 5))
      images.forEach((image) => {
        data.append("images", image);
      });

      const response = await api.post("/api/rooms/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({ type: "success", text: "Room added successfully!" });
      setTimeout(() => {
        navigate("/admin/rooms");
      }, 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to add room. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Add New Room</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure room details, pricing, and upload images straight to Cloudinary.
          </p>
        </div>
      </div>

      {/* Feedback Message */}
      {message.text && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-8">
        
        {/* Section 1: Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Basic Room Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Room Type
              </label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition"
              >
                <option value="Deluxe Suite">Deluxe Suite</option>
                <option value="Executive Room">Executive Room</option>
                <option value="Single Room">Single Room</option>
                <option value="Presidential Suite">Presidential Suite</option>
                <option value="Double Room">Double Room</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Room Number / Identifier
              </label>
              <input
                type="text"
                name="roomNumber"
                required
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="e.g. 101 or Suite-A"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Price Per Night ($)
              </label>
              <input
                type="number"
                name="pricePerNight"
                required
                min="0"
                value={formData.pricePerNight}
                onChange={handleChange}
                placeholder="150"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Guest Capacity
              </label>
              <input
                type="number"
                name="capacity"
                required
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="2"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed, luxurious description of the room features..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition"
            ></textarea>
          </div>
        </div>

        {/* Section 2: Amenities */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Room Amenities
          </h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              placeholder="Add amenity (e.g. Minibar, Ocean View)"
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
            />
            <button
              type="button"
              onClick={handleAddAmenity}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200 text-xs px-3 py-1.5 rounded-lg font-medium"
              >
                {amenity}
                <button
                  type="button"
                  onClick={() => handleRemoveAmenity(amenity)}
                  className="text-amber-700 hover:text-red-600 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Section 3: Cloudinary Images */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2 pb-2 border-b border-slate-100">
            Room Images (Cloudinary)
          </h3>
          <p className="text-xs text-slate-500 mb-4">Upload up to 5 high-resolution photos of the room.</p>

          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-amber-500 transition bg-slate-50 relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="p-3 bg-amber-100/60 text-amber-600 rounded-full">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-700">Click to upload or drag & drop</p>
              <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 10MB each</p>
            </div>
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
              {images.map((file, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-24">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow-md shadow-amber-600/20 transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? "Uploading & Saving..." : "Publish Room"}
          </button>
        </div>
      </form>
    </div>
  );
}