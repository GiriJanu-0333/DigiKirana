import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/customers";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchPhone, setSearchPhone] = useState("");

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get(API);
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Create or Update customer
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await axios.put(`${API}/${editingCustomer.id}`, {
          name,
          phone,
        });
        alert("✅ Customer updated!");
      } else {
        await axios.post(API, { name, phone });
        alert("✅ Customer created!");
      }
      setName("");
      setPhone("");
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err) {
      alert("❌ Failed to save customer");
    }
  };

  // Edit mode
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setName(customer.name);
    setPhone(customer.phone);
  };

  // Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      alert("🗑️ Customer deleted!");
      fetchCustomers();
    } catch (err) {
      alert("❌ Failed to delete customer");
    }
  };

  // Search by phone
  const handleSearch = async () => {
    if (!searchPhone) return;
    try {
      const res = await axios.get(`${API}/search`, {
        params: { phone: searchPhone },
      });
      if (res.data) {
        setCustomers([res.data]);
      } else {
        alert("No customer found!");
      }
    } catch (err) {
      alert("❌ Search failed");
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Customer Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-4 space-y-4"
      >
        <h2 className="text-lg font-bold">
          {editingCustomer ? "✏️ Edit Customer" : "➕ Add Customer"}
        </h2>
        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingCustomer ? "Update" : "Save"}
        </button>
      </form>

      {/* Search */}
      <div className="bg-white shadow rounded-lg p-4 flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search by phone"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          🔍 Search
        </button>
      </div>

      {/* Customers Table */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-bold mb-3">👥 Customers</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border">
                <td className="p-2 border">{c.id}</td>
                <td className="p-2 border">{c.name}</td>
                <td className="p-2 border">{c.phone}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
