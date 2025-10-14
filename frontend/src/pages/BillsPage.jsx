import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/bills";
const PRODUCTS_API = "http://localhost:8080/api/products"; // <-- new

export default function BillsPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);
  const [bills, setBills] = useState([]);
const [products, setProducts] = useState([]); // <-- new
  // Fetch all bills
  const fetchBills = async () => {
    try {
      const res = await axios.get(API);
      setBills(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(PRODUCTS_API);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBills();
    fetchProducts(); // <-- fetch products when page loads
  }, []);

  // Create bill
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API, { customerName, customerPhone, items });
      alert("✅ Bill Created!");
      setCustomerName("");
      setCustomerPhone("");
      setItems([{ productId: "", quantity: 1 }]);
      fetchBills();
    } catch (err) {
      alert("❌ Failed to create bill");
    }
  };

  // Export PDF
  const handleExport = async (billId) => {
    try {
      const res = await axios.get(`${API}/${billId}/export/pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bill_${billId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("❌ Failed to export bill");
    }
  };

  // Add more items
  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Bill Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-4 space-y-4"
      >
        <h2 className="text-lg font-bold">➕ Create Bill</h2>
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="Customer Phone"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
<div ><snap>
       <pre> <h3 className="font-semibold">Items                                                                                                            Quentity</h3></pre></snap></div>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input 
            type="text"
            placeholder="product name"
            value={item.productName}
             onChange={(e) => {
                const newItems = [...items];
                newItems[index].productName = e.target.value;
                setItems(newItems);
              }}
              className="border p-2 rounded flex-1"
              required
            />
            <input
              type="number"
              placeholder="Product ID"
              value={item.productId}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].productId = e.target.value;
                setItems(newItems);
              }}
              className="border p-2 rounded flex-1"
              required
            />
            
            <input
              type="number"
              placeholder="Quantity in Kg"
              value={item.quantity}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].quantity = e.target.value;
                setItems(newItems);
              }}
              className="border p-2 rounded flex-1"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          ➕ Add Item
        </button>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Bill
        </button>
      </form>

      {/* Bills Table */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-bold mb-3">📜 All Bills</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Bill ID</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id} className="border">
                <td className="p-2 border">{bill.id}</td>
                <td className="p-2 border">{bill.customerName}</td>
                <td className="p-2 border">{bill.customerPhone}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleExport(bill.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    ⬇ Export PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
