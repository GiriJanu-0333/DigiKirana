import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaChartLine, FaReceipt, FaUsers, FaMoon, FaSun } from 'react-icons/fa';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({ products: 0, lowStock: 0, invoices: 0, customers: 0 });
  const [recentInvoices, setRecentInvoices] = useState([]);

  // Fetch stats and recent invoices from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const productRes = await axios.get('/api/products');
        const lowStock = productRes.data.filter(p => p.quantity < 10).length;

        const invoiceRes = await axios.get('/api/invoices/recent');
        const customerSet = new Set(invoiceRes.data.map(inv => inv.customer));

        setStats({
          products: productRes.data.length,
          lowStock: lowStock,
          invoices: invoiceRes.data.length,
          customers: customerSet.size
        });
        setRecentInvoices(invoiceRes.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const themeClasses = darkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gradient-to-br from-yellow-50 to-white text-gray-800';

  return (
    <div className={`min-h-screen flex ${themeClasses}`}>
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md p-6 hidden md:block">
        <h1 className="text-2xl font-bold mb-10">🌟 Digital Kirana</h1>
        <ul className="space-y-4">
          <li><button onClick={() => navigate('/dashboard')} className="w-full text-left">Dashboard</button></li>
          <li><button onClick={() => navigate('/products')} className="w-full text-left">Manage Products</button></li>
          <li><button onClick={() => navigate('/billing')} className="w-full text-left">Create Invoice</button></li>
          <li><button onClick={() => navigate('/reports')} className="w-full text-left">Reports</button></li>
        </ul>
        <div className="mt-10">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-4 py-2 border rounded shadow"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">📊 Dashboard</h2>
          <button onClick={() => setDarkMode(!darkMode)} className="md:hidden p-2 border rounded">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-yellow-100 p-5 rounded-lg shadow">
            <FaBox className="text-2xl mb-2" />
            <h3 className="text-lg font-medium">Products</h3>
            <p className="text-2xl font-bold">{stats.products}</p>
          </div>
          <div className="bg-orange-100 p-5 rounded-lg shadow">
            <FaChartLine className="text-2xl mb-2" />
            <h3 className="text-lg font-medium">Low Stock</h3>
            <p className="text-2xl font-bold">{stats.lowStock}</p>
          </div>
          <div className="bg-green-100 p-5 rounded-lg shadow">
            <FaReceipt className="text-2xl mb-2" />
            <h3 className="text-lg font-medium">Invoices</h3>
            <p className="text-2xl font-bold">{stats.invoices}</p>
          </div>
          <div className="bg-blue-100 p-5 rounded-lg shadow">
            <FaUsers className="text-2xl mb-2" />
            <h3 className="text-lg font-medium">Customers</h3>
            <p className="text-2xl font-bold">{stats.customers}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <button onClick={() => navigate('/products')} className="bg-yellow-500 text-white px-6 py-4 rounded-lg shadow hover:bg-yellow-600 transition">Manage Products</button>
          <button onClick={() => navigate('/billing')} className="bg-green-500 text-white px-6 py-4 rounded-lg shadow hover:bg-green-600 transition">Create Invoice</button>
          <button onClick={() => navigate('/reports')} className="bg-blue-500 text-white px-6 py-4 rounded-lg shadow hover:bg-blue-600 transition">View Reports</button>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">🧾 Recent Invoices</h3>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2 border-b">Invoice ID</th>
                <th className="py-2 border-b">Customer</th>
                <th className="py-2 border-b">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv, i) => (
                <tr key={i}>
                  <td className="py-2 border-b">{inv.id || `INV00${i + 1}`}</td>
                  <td className="py-2 border-b">{inv.customer || 'N/A'}</td>
                  <td className="py-2 border-b">{inv.total || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}