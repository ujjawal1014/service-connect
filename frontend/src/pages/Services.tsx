"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { useSocket } from "../context/SocketContext"
import { FaTools, FaBolt, FaShower, FaBroom, FaLeaf, FaPaintBrush, FaTruck, FaWrench } from "react-icons/fa"

const serviceCategories = [
  { id: 1, name: "Home Repair", icon: <FaTools size={40} />, description: "Expert repairs for your home maintenance needs" },
  { id: 2, name: "Electrical", icon: <FaBolt size={40} />, description: "Professional electrical services and installations" },
  { id: 3, name: "Plumbing", icon: <FaShower size={40} />, description: "Complete plumbing solutions for your property" },
  { id: 4, name: "Cleaning", icon: <FaBroom size={40} />, description: "Thorough cleaning services for homes and offices" },
  { id: 5, name: "Gardening", icon: <FaLeaf size={40} />, description: "Beautiful landscaping and garden maintenance" },
  { id: 6, name: "Painting", icon: <FaPaintBrush size={40} />, description: "Professional painting services for any space" },
  { id: 7, name: "Moving", icon: <FaTruck size={40} />, description: "Safe and efficient moving and packing services" },
  { id: 8, name: "Appliance Repair", icon: <FaWrench size={40} />, description: "Expert repair for all your appliances" },
]

const Services = () => {
  const { user } = useAuth()
  const { socket } = useSocket()

  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [showRequestForm, setShowRequestForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/services")
        setServices(res.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to load services. Please try again later.")
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleRequestSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
    setFormSuccess("")

    if (!user) {
      setFormError("You need to be logged in to request a service.");
      return;
    }

    if (!selectedCategory) {
      return setFormError("Please select a service category")
    }

    if (!description.trim()) {
      return setFormError("Please provide a description of the service you need")
    }

    if (!price || isNaN(Number.parseFloat(price)) || Number.parseFloat(price) <= 0) {
      return setFormError("Please enter a valid price")
    }

    try {
      const serviceRequest = {
        category: selectedCategory,
        description,
        price: Number.parseFloat(price),
        userId: user._id,
        userName: user.name,
      }

      const res = await axios.post("http://localhost:3000/api/service-requests", serviceRequest)

      setFormSuccess("Your service request has been submitted successfully!")
      setSelectedCategory("")
      setDescription("")
      setPrice("")

      // Hide the form after successful submission
      setTimeout(() => {
        setShowRequestForm(false)
        setFormSuccess("")
      }, 3000)
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to submit service request. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading services...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-4 max-w-3xl mx-auto rounded shadow-md">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-500 to-purple-600 text-white py-20 shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg tracking-tight">Our Services</h1>
          <p className="text-2xl mb-8 max-w-3xl mx-auto text-blue-100 font-light opacity-90">
            Professional services for all your needs. Quality work, guaranteed satisfaction.
          </p>
          {user?.role === "User" && (
            <button
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-bold text-xl transition transform hover:-translate-y-1 shadow-lg"
            >
              {showRequestForm ? "Cancel Request" : "Request a Service"}
            </button>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {showRequestForm && (
          <div className="bg-white shadow-xl rounded-2xl p-8 mb-12 border border-gray-200 transform transition-all duration-300 hover:shadow-blue-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Request a Service</h2>

            {formError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                <p>{formError}</p>
              </div>
            )}

            {formSuccess && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
                <p>{formSuccess}</p>
              </div>
            )}

            <form onSubmit={handleRequestSubmit} className="space-y-6">
              <div>
                <label htmlFor="category" className="block text-lg font-medium text-gray-700 mb-2">
                  Service Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg"
                >
                  <option value="">Select a category</option>
                  {serviceCategories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg"
                  placeholder="Describe what you need help with..."
                ></textarea>
              </div>

              <div>
                <label htmlFor="price" className="block text-lg font-medium text-gray-700 mb-2">
                  Your Budget (USD)
                </label>
                <input
                  id="price"
                  type="number"
                  min="1"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg"
                  placeholder="Enter your budget"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-gray-800 text-white hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold text-lg transition shadow-lg"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-200 transition-all duration-300 border border-gray-200 group"
            >
              <div className="p-8">
                <div className="text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">{category.name}</h2>
                <p className="text-gray-600 mb-6">
                  {category.description}
                </p>
                <button className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white hover:from-blue-800 hover:to-blue-950 px-6 py-3 rounded-lg font-semibold transition shadow-lg">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Services
