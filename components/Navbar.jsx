import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from '../src/assets/image.png'

const Navbar = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}

        <Link to="/" className="flex items-center gap-2 text-decoration-none">
          <img
            src={Logo}
            alt="Logo"
            className="h-10 w-10 rounded-full shadow-sm"
          />
          <span className="text-xl font-bold text-blue-800">Expense Tracker</span>
        </Link>

        {/* Links */}

        <div className="flex items-center gap-3">
          <>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-black-700 text-white font-medium shadow-sm hover:bg-red-600 transition text-decoration-none"
            >
              Logout
            </button>
          </>
        </div>
      </div>
    </nav>
  );
}
export default Navbar