
// components/NavBar.js
import React, { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";


const NavBar = ({ user, setUser, notificationsCount = 3 }) => {
  const router = useRouter();
  const isLoggedIn = user?.value;
  const [menuOpen, setMenuOpen] = useState(false);

  const token = Cookies.get("Token");


  const handleLogout = () => {
    Cookies.remove("name");
    setUser({ value: null });
    router.push("/logout");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-md">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
         
          <span className="text-2xl font-semibold text-blue-700 dark:text-white">
            DevOps Demo
          </span>
        </Link>

        {/* Desktop Menu Links */}
        <div className="hidden md:flex items-center space-x-6">
          {!isLoggedIn && (
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              Home
            </Link>
          )}
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
              >
                Profile
              </Link>
            
              
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Dropdown for "You are?" */}
              <div className="relative group">
                <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 focus:outline-none">
                  Action
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <ul className="py-2">
                    <li>
                      <Link
                        href="/login"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/singup"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sign Up
                      </Link>
                    </li>
                    
                  </ul>
                </div>
              </div>

             
              
              <Link
                href="/contactus"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
              >
                Contact
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button
          className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg focus:ring-2"
          aria-controls="navbar-menu"
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div id="navbar-menu" className="md:hidden px-4 pb-4">
          {!isLoggedIn && (
            <Link href="/" className="block text-gray-700 hover:text-blue-600">
              Home
            </Link>
          )}
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="block text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="block text-gray-700 hover:text-blue-600"
              >
                Profile
              </Link>
              
             
              <button
                onClick={handleLogout}
                className="block text-red-600 hover:text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block text-gray-700 hover:text-blue-600"
              >
                Looking For Home
              </Link>
              <Link
                href="/owner/auth/login"
                className="block text-gray-700 hover:text-blue-600"
              >
                Rent My Home
              </Link>
              <Link
                href="#"
                className="block text-gray-700 hover:text-blue-600"
              >
                Real Estate Developer
              </Link>
              <Link
                href="/services/moving"
                className="block text-gray-700 hover:text-blue-600"
              >
                Moving Services
              </Link>
              <Link
                href="/services/maintenance"
                className="block text-gray-700 hover:text-blue-600"
              >
                Maintenance Services
              </Link>
              <Link
                href="/services/cleaning"
                className="block text-gray-700 hover:text-blue-600"
              >
                Cleaning Services
              </Link>
              <Link
                href="/pricing"
                className="block text-gray-700 hover:text-blue-600"
              >
                Pricing
              </Link>
              <Link
                href="/contactus"
                className="block text-gray-700 hover:text-blue-600"
              >
                Contact
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
