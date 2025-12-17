import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // The base URL of your Spring Boot server
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
                <Link to={`/edit-product/${product.id}`} key={product.id} className="group">
                  <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition flex flex-col h-full">
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <img 
                        
                        src={product.imageUrl ? `${IMAGE_BASE_URL}${product.imageUrl}` : "/placeholder-product.png"} 
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = "/placeholder-product.png"; }}
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-gray-800 truncate">{product.title}</h3>
                      <div className="mt-auto flex justify-between items-center pt-2">
                        <span className="text-blue-600 font-bold">${product.price}</span>
                        <div className="flex flex-col items-end">
                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold mb-1 ${product.condition === 'NEW' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                                {product.condition}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded font-medium ${product.saleStatus === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {product.saleStatus}
                            </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyProducts;