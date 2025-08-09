import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaTrash } from 'react-icons/fa';

export default function BillingPage() {
  const [customer, setCustomer] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [productResults, setProductResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [saving, setSaving] = useState(false);

  // Search products from backend as user types
  useEffect(() => {
    const fetch = async () => {
      if (searchTerm.length < 2) {
        setProductResults([]);
        return;
      }
      try {
        const res = await axios.get(`/api/products?search=${searchTerm}`);
        setProductResults(res.data);
      } catch (err) {
        console.error("Product search failed", err);
      }
    };
    const timeout = setTimeout(fetch, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const addProductToCart = (product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setSearchTerm('');
    setProductResults([]);
  };

  const removeProduct = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const saveInvoice = async () => {
    if (!customer || cart.length === 0) {
      alert("Please enter customer name and add products.");
      return;
    }

    const invoicePayload = {
      customerName: customer,
      items: cart.map(item => ({ productId: item.id, quantity: item.quantity }))
    };

    try {
      setSaving(true);
      const response = await axios.post("/api/invoices", invoicePayload, {
        responseType: 'blob'  // To handle PDF download
      });

      // Create a blob URL for the PDF file and trigger download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "invoice.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error("Error saving invoice", err);
      alert("Failed to save invoice.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🧾 Create Bill</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Customer</label>
        <div className="flex">
          <input
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Enter customer name"
            className="w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring"
          />
          <button className="px-4 bg-gray-200 border-l rounded-r-lg">
            <FaSearch />
          </button>
        </div>
      </div>

      <div className="mb-4 relative">
        <label className="block text-gray-700 font-medium mb-1">Add Product</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
        />
        {productResults.length > 0 && (
          <ul className="absolute z-10 bg-white border w-full rounded shadow mt-1 max-h-40 overflow-y-auto">
            {productResults.map(product => (
              <li
                key={product.id}
                className="px-4 py-2 hover:bg-yellow-100 cursor-pointer"
                onClick={() => addProductToCart(product)}
              >
                {product.name} - ₹{product.price}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Product</th>
              <th className="px-4 py-2 border">Quantity</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Remove</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2 border">{item.name}</td>
                <td className="px-4 py-2 border">{item.quantity}</td>
                <td className="px-4 py-2 border">₹{item.price}</td>
                <td className="px-4 py-2 border text-center">
                  <button onClick={() => removeProduct(item.id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            <tr className="font-semibold bg-gray-50">
              <td colSpan="2" className="px-4 py-2 border text-right">Total:</td>
              <td colSpan="2" className="px-4 py-2 border">₹{totalAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex gap-4 justify-end">
        <button
          onClick={saveInvoice}
          className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save & Download PDF"}
        </button>
      </div>
    </div>
  );
}