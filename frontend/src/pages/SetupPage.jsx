import { useState, useEffect } from "react";
import { getOwner, createOwner } from "../services/ownerService";
import { useNavigate } from "react-router-dom";

export default function SetupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ownerExists, setOwnerExists] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    shopName: "",
    shopAddress: "",
  });

  useEffect(() => {
    const checkOwner = async () => {
      try {
        const res = await getOwner();
        if (res.data) {
          setOwnerExists(true);
          navigate("/dashboard");
        }
      } catch (err) {
        setOwnerExists(false);
      } finally {
        setLoading(false);
      }
    };
    checkOwner();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOwner(form);
      alert("✅ Owner setup completed successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert("❌ Failed to save owner details");
    }
  };

  if (loading) return <p className="text-center mt-10">Checking setup...</p>;

  if (ownerExists)
    return <p className="text-center mt-10">Owner already exists. Redirecting...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        🏪 Setup Your Shop
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
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
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
}
