import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const IMAGE_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const response = await api.get("/products/my-products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE FUNCTIONALITY ---
  const handleDelete = async (id) => {
    // 1. Confirm before deleting
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    try {
      // 2. Call the backend API
      await api.delete(`/products/${id}`);
      
      // 3. Update the UI locally (remove the item from the list)
      setProducts(products.filter(product => product.id !== id));
      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const cat = product.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  if (loading) return <div className="p-10 text-center font-semibold">Loading your inventory...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Inventory</h1>
        <Link to="/add-product" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          + Add New Product
        </Link>
      </div>

      {Object.keys(groupedProducts).length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
          <p className="text-gray-500">You haven't added any products yet.</p>
        </div>
      ) : (
        Object.entries(groupedProducts).map(([category, items]) => (
          <div key={category} className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-blue-600 border-b pb-2">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition flex flex-col h-full group">
                  {/* Link wrapper only around the top part */}
                  <Link to={`/edit-product/${product.id}`} className="block h-48 overflow-hidden bg-gray-100 relative">
                      <img 
                        src={product.imageUrl ? `${IMAGE_BASE_URL}${product.imageUrl}` : "/placeholder-product.png"} 
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = "/placeholder-product.png"; }}
                      />
                      {/* Edit Overlay Hint */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow-lg">Edit Photo</span>
                      </div>
                  </Link>

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-gray-800 truncate mb-1">{product.title}</h3>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-blue-600 font-bold">${product.price}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${product.saleStatus === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.saleStatus}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto flex space-x-2 pt-3 border-t border-gray-100">
                      <Link 
                        to={`/edit-product/${product.id}`}
                        className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition"
                      >
                        Edit
                      </Link>
                      
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 text-center bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyProducts;