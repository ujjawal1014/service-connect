"use client"

import React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      navigate("/")
    } catch (err) {
      setError(err.message || "Failed to login. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-500 to-purple-600 text-white py-16 shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg tracking-tight">Welcome Back!</h1>
          <p className="text-2xl mb-2 max-w-2xl mx-auto text-blue-100 font-light opacity-90">
            Sign in to access your account and manage your services.
          </p>
        </div>
      </section>

      {/* Login Form */}
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200 transform transition-all duration-300 hover:shadow-blue-200">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <FaEnvelope size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-gray-50"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-gray-50"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-lg text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-lg">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-lg text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition">
                  Create one now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
