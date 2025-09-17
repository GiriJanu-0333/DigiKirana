import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/products";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [lowStock, setLowStock] = useState([]);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch low stock products
  const fetchLowStock = async () => {
    try {
      const res = await axios.get(`${API}/low-stock`);
      setLowStock(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchLowStock();
  }, []);

  // Create or Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`${API}/${editingProduct.id}`, {
          name,
          price,
          stock,
        });
        alert("✅ Product updated!");
      } else {
        await axios.post(API, { name, price, stock });
        alert("✅ Product created!");
      }
      setName("");
      setPrice("");
      setStock("");
      setEditingProduct(null);
      fetchProducts();
      fetchLowStock();
    } catch (err) {
      alert("❌ Failed to save product");
    }
  };

  // Edit mode
  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      alert("🗑️ Product deleted!");
      fetchProducts();
      fetchLowStock();
    } catch (err) {
      alert("❌ Failed to delete product");
    }
  };

  // Add stock
  const handleAddStock = async (id, qty) => {
    try {
      await axios.post(`${API}/add-stock`, { productId: id, quantity: qty });
      alert("📦 Stock added!");
      fetchProducts();
      fetchLowStock();
    } catch (err) {
      alert("❌ Failed to add stock");
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Product Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-4 space-y-4"
      >
        <h2 className="text-lg font-bold">
          {editingProduct ? "✏️ Edit Product" : "➕ Add Product"}
        </h2>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingProduct ? "Update" : "Save"}
        </button>
      </form>

      {/* Low Stock Warning */}
      <div className="bg-yellow-100 shadow rounded-lg p-4">
        <h2 className="text-lg font-bold mb-2">⚠️ Low Stock Products</h2>
        {lowStock.length === 0 ? (
          <p className="text-gray-600">All products have sufficient stock</p>
        ) : (
          <ul className="list-disc pl-5">
            {lowStock.map((p) => (
              <li key={p.id}>
                {p.name} — {p.stock} left
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-bold mb-3">📦 Products</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border">
                <td className="p-2 border">{p.id}</td>
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">₹{p.price}</td>
                <td className="p-2 border">{p.stock}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    🗑️ Delete
                  </button>
                  <button
                    onClick={() => handleAddStock(p.id, 5)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    ➕ Add 5 Stock
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
