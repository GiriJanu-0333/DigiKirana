import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Users, Package } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Bills", path: "/bills", icon: <FileText size={18} /> },
    { name: "Customers", path: "/customers", icon: <Users size={18} /> },
    { name: "Products", path: "/products", icon: <Package size={18} /> },
  ];

  return (
    <nav className="bg-blue-600 text-white p-4 flex gap-6 shadow-md">
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`flex items-center gap-2 hover:underline ${
            location.pathname === link.path ? "font-bold underline" : ""
          }`}
        >
          {link.icon}
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
