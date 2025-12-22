import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function OrderPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Default to COD
  const [isSubmitting, setIsSubmitting] = useState(false);

  const IMAGE_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    // Fetch product details to show summary
    api.get(`/products/${productId}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error fetching product", err))
      .finally(() => setLoading(false));
  }, [productId]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        productId: productId,
        shippingAddress: address,
        phoneNumber: phone,
        paymentMethod: paymentMethod
      };

      // 1. Create the Order in Backend
      const response = await api.post("/api/orders/create", orderData);
      const order = response.data;

      // 2. Handle Logic based on Payment Method
      if (paymentMethod === "ONLINE") {
        // TODO: We will implement Stripe/Payment Gateway here in the next phase
        alert("Online Payment Integration coming next! Order placed as Pending.");
        navigate("/dashboard");
      } else {
        // Cash on Delivery
        alert("Order Placed Successfully! The seller has been notified.");
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Order failed", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Order Page...</div>;
  if (!product) return <div className="p-10 text-center">Product not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Product Summary */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
            <img 
               src={product.imageUrl ? `${IMAGE_BASE_URL}${product.imageUrl}` : "/placeholder.png"} 
               className="w-full h-48 object-cover rounded-lg mb-4"
               onError={(e) => { e.target.src = "/placeholder.png"; }}
            />
            <h4 className="font-semibold text-gray-900">{product.title}</h4>
            <p className="text-sm text-gray-500 mb-2">{product.condition}</p>
            <div className="flex justify-between items-center border-t pt-4 mt-2">
              <span className="text-gray-600">Total Price</span>
              <span className="text-xl font-bold text-indigo-600">${product.price}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Shipping & Payment Form */}
        <div className="md:col-span-2">
          <form onSubmit={handlePlaceOrder} className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Details</h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                <textarea 
                  required
                  rows="3"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Street, City, Zip Code"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  required
                  type="tel"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="+1 234 567 890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              
              {/* Option 1: Cash On Delivery */}
              <div 
                onClick={() => setPaymentMethod("COD")}
                className={`cursor-pointer p-4 border-2 rounded-xl flex items-center space-x-3 transition ${paymentMethod === "COD" ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "COD" ? "border-indigo-600" : "border-gray-400"}`}>
                  {paymentMethod === "COD" && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                </div>
                <span className="font-semibold text-gray-700">Cash on Delivery</span>
              </div>

              {/* Option 2: Online Payment */}
              <div 
                onClick={() => setPaymentMethod("ONLINE")}
                className={`cursor-pointer p-4 border-2 rounded-xl flex items-center space-x-3 transition ${paymentMethod === "ONLINE" ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "ONLINE" ? "border-indigo-600" : "border-gray-400"}`}>
                  {paymentMethod === "ONLINE" && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                </div>
                <span className="font-semibold text-gray-700">Online Payment (Card)</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition transform hover:scale-[1.01]"
            >
              {isSubmitting ? "Processing..." : (paymentMethod === "ONLINE" ? "Proceed to Payment" : "Place Order Now")}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default OrderPage;