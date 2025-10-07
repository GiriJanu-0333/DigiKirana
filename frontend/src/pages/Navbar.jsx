import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Users, Package, User } from "lucide-react"; // ✅ added User icon

export default function Navbar() {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Bills", path: "/bills", icon: <FileText size={18} /> },
    { name: "Customers", path: "/customers", icon: <Users size={18} /> },
    { name: "Products", path: "/products", icon: <Package size={18} /> },
  ];

  return (
    <nav className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md">
      {/* Left side — nav links */}
      <div className="flex gap-6">
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
      </div>

      {/* Right side — profile icon */}
      <Link
        to="/profile"
        className={`flex items-center gap-2 hover:underline ${
          location.pathname === "/profile" ? "font-bold underline" : ""
        }`}
      >
        <User size={20} /> {/* ✅ Lucide-react user icon */}
        <span></span>
      </Link>
    </nav>
  );
}
