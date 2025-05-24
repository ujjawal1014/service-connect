"use client"

import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { FaBars, FaTimes } from "react-icons/fa"

const Navbar = () => {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              ServiceConnect
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-gray-300 transition">
              Home
            </Link>
            <Link to="/about" className="hover:text-gray-300 transition">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-gray-300 transition">
              Contact
            </Link>

            {user && (
              <>
                <Link to="/services" className="hover:text-gray-300 transition">
                  Services
                </Link>
              </>
            )}

            {user && user.role === "Worker" && (
              <Link to="/worker-dashboard" className="hover:text-gray-300 transition">
                Dashboard
              </Link>
            )}

            {user && user.role === "User" && (
              <Link to="/user-dashboard" className="hover:text-gray-300 transition">
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">Hello, {user.name}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col items-start pt-16 px-6 space-y-6">
            <Link
              to="/"
              className="text-xl font-semibold hover:text-blue-400 transition w-full py-2"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-xl font-semibold hover:text-blue-400 transition w-full py-2"
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-xl font-semibold hover:text-blue-400 transition w-full py-2"
              onClick={toggleMenu}
            >
              Contact
            </Link>

            {user && (
              <Link
                to="/services"
                className="text-xl font-semibold hover:text-blue-400 transition w-full py-2"
                onClick={toggleMenu}
              >
                Services
              </Link>
            )}

            {user && user.role === "Worker" && (
              <Link
                to="/worker-dashboard"
                className="text-xl font-semibold hover:text-blue-400 transition w-full py-2"
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
            )}

            {user && user.role === "User" && (
              <Link
                to="/user-dashboard"
                className="text-xl font-semibold hover:text-blue-400 transition w-full py-2"
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
            )}

            {user ? (
              <div className="flex flex-col space-y-4 w-full pt-4 border-t border-gray-700">
                <span className="text-lg">Hello, {user.name}</span>
                <button
                  onClick={() => {
                    logout()
                    toggleMenu()
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-base transition w-full"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4 w-full pt-4 border-t border-gray-700">
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-base transition w-full text-center"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-base transition w-full text-center"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Overlay when menu is open */}
        {isMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleMenu}
          />
        )}
      </div>
    </nav>
  )
}

export default Navbar
