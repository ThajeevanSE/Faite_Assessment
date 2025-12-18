import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function ProductForm() {
  const { id } = useParams(); // If ID exists, we are in Edit mode
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "ELECTRONICS",
    condition: "USED",
    saleStatus: "AVAILABLE",
    phoneNum: "", // Added phone number field
  });

  // Fetch data if in Edit Mode
  useEffect(() => {
    if (id) {
      api.get(`/products/my-products`).then((res) => {
        const product = res.data.find((p) => p.id === parseInt(id));
        if (product) {
          setFormData({
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            condition: product.condition,
            saleStatus: product.saleStatus,
            phoneNum: product.phoneNum || "", // Map existing phone number
          });
          if (product.imageUrl) {
            setImagePreview(`http://localhost:8080${product.imageUrl}`);
          }
        }
      });
    }
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    
    // Append JSON data
    data.append(
      "dto",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );

    // Append Image
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (id) {
        await api.put(`/products/update/${id}`, formData); 
      } else {
        await api.post("/products/add", data); 
      }
      navigate("/my-products");
    } catch (error) {
      console.error("Error saving product:", error);
      if (error.response?.status === 403) {
        alert("Session expired. Please log out and log in again.");
      } else {
        alert("Error saving product. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg mt-10 rounded-xl border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {id ? "Edit Product" : "List New Product"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Product Title</label>
          <input
            type="text"
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* Price and Phone Number */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Price ($)</label>
            <input
              type="number"
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Contact Number</label>
            <input
              type="text"
              required
              placeholder="+1 234 567 890"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.phoneNum}
              onChange={(e) => setFormData({ ...formData, phoneNum: e.target.value })}
            />
          </div>
        </div>

        {/* Category & Condition */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Category</label>
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="ELECTRONICS">Electronics</option>
              <option value="TRAVEL">Travel</option>
              <option value="FASHION">Fashion</option>
              <option value="HOME">Home</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Condition</label>
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            >
              <option value="NEW">Brand New</option>
              <option value="USED">Used</option>
            </select>
          </div>
        </div>

        {/* Sale Status */}
        <div>
           <label className="block text-sm font-semibold text-gray-700">Sale Status</label>
           <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={formData.saleStatus}
              onChange={(e) => setFormData({ ...formData, saleStatus: e.target.value })}
            >
              <option value="AVAILABLE">Available</option>
              <option value="SOLD">Sold Out</option>
            </select>
        </div>

        {/* Image Upload Field */}
        {!id && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Product Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded mb-2 shadow-sm" />
              )}
              <input 
                type="file" 
                accept="image/*" 
                required={!id}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Description</label>
          <textarea
            rows="4"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-lg font-bold text-white transition-all ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700 shadow-lg"
          }`}
        >
          {loading ? "Processing..." : id ? "Update Product" : "Post Product"}
        </button>
      </form>
    </div>
  );
}

export default ProductForm;