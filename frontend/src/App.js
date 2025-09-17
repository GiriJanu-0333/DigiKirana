import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./pages/Navbar";
  // ✅ new Navbar
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import CustomersPage from "./pages/CustomersPage";
import ProductPage from "./pages/ProductPage";
import BillsPage from "./pages/BillsPage";

// 🔹 Separate component for animated routing
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/bills" element={<BillsPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      {/* ✅ Hide Navbar on Landing Page */}
      {window.location.pathname !== "/" && <Navbar />}
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
