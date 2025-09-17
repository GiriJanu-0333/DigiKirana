import { useState, useEffect } from "react";
import axios from "axios";
import {
  Package,
  Layers,
  AlertTriangle,
  FileText,
  IndianRupee,
  TrendingUp,
  Award,
  User
} from "lucide-react";

const API = "http://localhost:8080/api/dashboard/stats";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get(API);
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">
        📊 Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package className="w-8 h-8" />}
          color="from-blue-500 to-indigo-600"
        />
        <Card
          title="Total Stock"
          value={stats.totalStock}
          icon={<Layers className="w-8 h-8" />}
          color="from-green-500 to-emerald-600"
        />
        <Card
          title="Low Stock Items"
          value={stats.lowStockCount}
          icon={<AlertTriangle className="w-8 h-8" />}
          color="from-red-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          title="Total Bills"
          value={stats.totalBills}
          icon={<FileText className="w-8 h-8" />}
          color="from-purple-500 to-fuchsia-600"
        />
        <Card
          title="Total Sales Amount"
          value={`₹${stats.totalSalesAmount}`}
          icon={<IndianRupee className="w-8 h-8" />}
          color="from-yellow-500 to-amber-600"
        />
      </div>

      {/* Today’s Sales */}
      <Card
        title="Sales Today"
        value={`₹${stats.salesToday}`}
        icon={<TrendingUp className="w-8 h-8" />}
        color="from-indigo-500 to-sky-600"
      />

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HighlightCard
          title="🏆 Most Sold Product"
          value={stats.mostSoldProduct || "—"}
          icon={<Award className="w-6 h-6 text-yellow-600" />}
        />
        <HighlightCard
          title="👑 Top Customer"
          value={stats.topCustomer || "—"}
          icon={<User className="w-6 h-6 text-blue-600" />}
        />
      </div>
    </div>
  );
}

/* ======================== Reusable Components ======================== */

function Card({ title, value, icon, color }) {
  return (
    <div
      className={`bg-gradient-to-r ${color} text-white rounded-2xl shadow-lg p-6 flex justify-between items-center hover:scale-105 transform transition-all duration-200`}
    >
      <div>
        <h2 className="text-lg font-medium opacity-90">{title}</h2>
        <p className="text-3xl font-extrabold">{value}</p>
      </div>
      <div className="opacity-90">{icon}</div>
    </div>
  );
}

function HighlightCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition duration-200">
      <div>
        <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
    </div>
  );
}
