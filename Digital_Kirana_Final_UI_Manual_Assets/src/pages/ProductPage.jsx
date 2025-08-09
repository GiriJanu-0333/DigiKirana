import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductPage() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await axios.get('/api/products');
    setProducts(res.data);
  };

  const deleteProduct = async (id) => {
    await axios.delete(`/api/products/${id}`);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 border">Name</th>
            <th className="py-2 border">Price</th>
            <th className="py-2 border">Quantity</th>
            <th className="py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td className="py-2 border px-4">{p.name}</td>
              <td className="py-2 border px-4">{p.price}</td>
              <td className="py-2 border px-4">{p.quantity}</td>
              <td className="py-2 border px-4">
                <button className="mr-2 text-blue-600">Edit</button>
                <button onClick={() => deleteProduct(p.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}