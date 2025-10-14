import { useState, useEffect } from "react";
import { getOwner, updateOwner, createOwner } from "../services/ownerService";

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
      const owner = await getOwner();
      if (owner) setForm(owner); // owner should have id, name, phone, etc.
    } catch (err) {
      console.error("Failed to load owner", err);
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
    if (form.id) {
      // If owner exists, update
      await updateOwner(form);
    } else {
      // If no owner exists, create
      await createOwner(form);
    }
    alert("✅ Profile saved successfully!");
  } catch (err) {
    alert("❌ Failed to save profile");
    console.error(err);
  }
};

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        👤 Owner Profile
      </h2>
      <form onSubmit={handleSave} className="space-y-3">
        <input type="text" name="name" placeholder="Owner Name" value={form.name} onChange={handleChange} className="border p-2 w-full rounded" required />
        <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="border p-2 w-full rounded" pattern="[0-9]{10}" required />
        <input type="text" name="shopName" placeholder="Shop Name" value={form.shopName} onChange={handleChange} className="border p-2 w-full rounded" required />
        <textarea name="shopAddress" placeholder="Shop Address" value={form.shopAddress} onChange={handleChange} className="border p-2 w-full rounded" required />
        <button type="submit" className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">Save Changes</button>
      </form>
    </div>
  );
}
