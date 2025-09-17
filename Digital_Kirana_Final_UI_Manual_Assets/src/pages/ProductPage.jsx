import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", price: "", quantity: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add or Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        name: form.name.trim(),
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity, 10),
      };

      if (isEditing) {
        await axios.put(`http://localhost:8080/api/products/${form.id}`, payload);
      } else {
        await axios.post("http://localhost:8080/api/products", payload);
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      if (err.response?.status === 404) {
        setError("Product not found for update.");
      } else {
        setError("Failed to save product.");
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({ id: null, name: "", price: "", quantity: "" });
    setIsEditing(false);
  };

  // Load product into form for editing
  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    });
    setIsEditing(true);
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Products</h2>

      {error && <div className="bg-red-100 text-red-700 p-2 mb-4">{error}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2 flex-wrap">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 flex-1 min-w-[150px]"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border p-2 w-24"
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Qty"
          value={form.quantity}
          onChange={handleChange}
          className="border p-2 w-20"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isEditing ? "Update" : "Add"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Table */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 border px-4">Name</th>
            <th className="py-2 border px-4">Price</th>
            <th className="py-2 border px-4">Quantity</th>
            <th className="py-2 border px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="py-2 border px-4">{p.name}</td>
              <td className="py-2 border px-4">{p.price}</td>
              <td className="py-2 border px-4">{p.quantity}</td>
              <td className="py-2 border px-4">
                <button
                  onClick={() => handleEdit(p)}
                  className="mr-2 text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
