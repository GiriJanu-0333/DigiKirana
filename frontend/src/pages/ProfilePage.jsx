import { useState, useEffect } from "react";
import { getOwner, updateOwner } from "../services/ownerService";

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    shopName: "",
    shopAddress: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await getOwner();
        if (res.data) setForm(res.data);
      } catch (err) {
        alert("❌ Failed to load owner details");
      } finally {
        setLoading(false);
      }
    };
    fetchOwner();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateOwner(form);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      alert("❌ Failed to update profile");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        👤 Owner Profile
      </h2>
      <form onSubmit={handleSave} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Owner Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          name="shopName"
          placeholder="Shop Name"
          value={form.shopName}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <textarea
          name="shopAddress"
          placeholder="Shop Address"
          value={form.shopAddress}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
