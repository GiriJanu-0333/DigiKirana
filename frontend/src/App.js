import React from 'react'; import { Package, Layers, AlertTriangle, FileText, IndianRupee, TrendingUp, Award, User } from "lucide-react"; import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import LandingPage from './pages/LandingPage'; 
import Dashboard from './pages/Dashboard'; 
import CustomersPage from "./pages/CustomersPage"; 
import ProductPage from './pages/ProductPage';
 import BillsPage from "./pages/BillsPage"; 
 import Navbar from "./pages/Navbar";
 function App() { return ( <Router> <Routes> <Route path="/" element={<LandingPage />} /> <Route path="/dashboard" element={<Dashboard />} /> <Route path="/customers" element={<CustomersPage />} /> <Route path="/products" element={<ProductPage />} /> <Route path="/bills" element={<BillsPage />} /> </Routes> </Router> ); } 
 function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/"; // hide navbar only on landing page

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/bills" element={<BillsPage />} />
      </Routes>
    </>
  );
}
export default App;