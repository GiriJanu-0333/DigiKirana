import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaTrash } from 'react-icons/fa';

const Billing = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Fetch all products when page loads
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products", err));
  }, []);

  // Filtered products based on search term
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add product to bill
  const addToBill = (product) => {
    const existingItem = billItems.find((item) => item.productId === product.id);
    if (existingItem) {
      setBillItems(
        billItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setBillItems([
        ...billItems,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  };

  // Change quantity
  const updateQuantity = (productId, newQty) => {
    setBillItems(
      billItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  // Calculate total
  const totalAmount = billItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Submit bill to backend
  const submitBill = () => {
    const billData = {
      customerName,
      customerPhone,
      items: billItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    axios
      .post("http://localhost:8080/api/bills", billData)
      .then(() => {
        alert("Bill created successfully!");
        setBillItems([]);
        setCustomerName("");
        setCustomerPhone("");
      })
      .catch((err) => console.error("Error creating bill", err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Billing Page</h2>

      {/* Customer Info */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Customer Phone"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
        />
      </div>

      {/* Product Search */}
      <input
        type="text"
        placeholder="Search product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "15px", width: "300px" }}
      />

      {/* Product List */}
      <div>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
              padding: "5px",
              border: "1px solid #ccc",
            }}
          >
            <span>{product.name} - ₹{product.price}</span>
            <button onClick={() => addToBill(product)}>Add</button>
          </div>
        ))}
      </div>

      {/* Bill Table */}
      <h3>Bill Items</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price (₹)</th>
            <th>Quantity</th>
            <th>Subtotal (₹)</th>
          </tr>
        </thead>
        <tbody>
          {billItems.map((item) => (
            <tr key={item.productId}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.productId, parseInt(e.target.value))
                  }
                  style={{ width: "50px" }}
                />
              </td>
              <td>{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total */}
      <h3>Total: ₹{totalAmount}</h3>

      {/* Submit */}
      <button onClick={submitBill} disabled={billItems.length === 0}>
        Create Bill
      </button>
    </div>
  );
};

export default Billing;
