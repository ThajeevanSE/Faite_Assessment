import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});

  useEffect(() => {
    api.get(`/user/products/${id}`)
      .then(res => setForm(res.data))
      .catch(() => navigate("/my-products"));
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await api.put(`/user/products/${id}`, form);
    navigate("/my-products");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title || ""} onChange={handleChange} className="w-full border p-2" />
        <input name="price" value={form.price || ""} onChange={handleChange} className="w-full border p-2" />
        <select name="saleStatus" value={form.saleStatus || ""} onChange={handleChange} className="w-full border p-2">
          <option>AVAILABLE</option>
          <option>SOLD</option>
        </select>

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
