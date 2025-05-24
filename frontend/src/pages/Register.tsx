"use client"

import React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { FaUser, FaEnvelope, FaLock, FaUserTie, FaTools } from "react-icons/fa"
import axios from "axios"
import { IconType } from "react-icons"
import { API_URL } from '../config/api'

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<'User' | 'Worker'>('User')
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null)
  const [qrCodePreview, setQrCodePreview] = useState<string>("")

  const { register } = useAuth()
  const navigate = useNavigate()

  const roleOptions = [
    {
      value: "User",
      label: "Hire Workers",
      description: "Find skilled professionals for your needs",
      icon: FaUserTie,
      selectedBg: "bg-blue-100",
    },
    {
      value: "Worker",
      label: "Offer Services",
      description: "Share your skills and earn money",
      icon: FaTools,
      selectedBg: "bg-green-100",
    },
  ]

  const handleQrCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (!file) {
      setQrCodeFile(null)
      setQrCodePreview("")
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB")
      return
    }

    setQrCodeFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setQrCodePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      return setError("Passwords do not match")
    }

    if (role === "Worker" && !qrCodeFile) {
      return setError("Please upload a payment QR code/photo")
    }

    setError("")
    setLoading(true)

    try {
      let qrCodeUrl = ""
      if (role === "Worker" && qrCodeFile) {
        // Create form data for file upload
        const formData = new FormData()
        formData.append('file', qrCodeFile)

        // Upload file to server
        const uploadRes = await axios.post(`${API_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        qrCodeUrl = uploadRes.data.url
      }

      await register(name, email, password, role, qrCodeUrl)
      navigate("/")
    } catch (err) {
      setError(err.message || "Failed to create an account. Please try again.")
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
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg tracking-tight">Join ServiceConnect</h1>
          <p className="text-2xl mb-2 max-w-2xl mx-auto text-blue-100 font-light opacity-90">
            Create your account and start connecting with skilled professionals.
          </p>
        </div>
      </section>

      {/* Registration Form */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200 transform transition-all duration-300 hover:shadow-blue-200">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <span className="text-xl">
                    <FaUser />
                  </span>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-gray-50"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <span className="text-xl">
                    <FaEnvelope />
                  </span>
                </div>
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
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <span className="text-xl">
                    <FaLock />
                  </span>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-gray-50"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <span className="text-xl">
                    <FaLock />
                  </span>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-gray-50"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-4">I want to</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roleOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => setRole(option.value as 'User' | 'Worker')}
                      className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${role === option.value
                        ? `${option.selectedBg} border-blue-500 shadow-md`
                        : "bg-white border-gray-300 hover:border-blue-400 shadow-sm"
                      }`}
                    >
                      <div className={`mb-4 ${role === option.value ? 'text-blue-700' : 'text-blue-600'}`}>
                        <Icon size={32} />
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${role === option.value ? 'text-gray-800' : 'text-gray-800'}`}>{option.label}</h3>
                      <p className={`text-center text-sm ${role === option.value ? 'text-gray-700' : 'text-gray-600'}`}>{option.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {role === "Worker" && (
              <div className="space-y-4">
                <label htmlFor="qrCode" className="block text-lg font-medium text-gray-700 mb-2">
                  Upload Payment QR Code / Photo
                </label>
                <input
                  id="qrCode"
                  name="qrCode"
                  type="file"
                  accept="image/*"
                  onChange={handleQrCodeChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:mr-4 file:rounded-md file:cursor-pointer hover:file:bg-blue-700"
                />
                {qrCodePreview && (
                  <div className="mt-4 text-center">
                    <img src={qrCodePreview} alt="QR Code Preview" className="max-h-40 mx-auto rounded-md shadow-md border border-gray-300" />
                  </div>
                )}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-lg text-gray-600">
                Already have an account?
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 ml-1 transition">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
