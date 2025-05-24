"use client"

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaTools, FaBolt, FaShower, FaBroom, FaLeaf, FaPaintBrush, FaTruck, FaWrench } from "react-icons/fa";
import { IconType } from "react-icons";
import { API_URL } from '../config/api';

interface ServiceCategory {
    id: number;
    name: string;
    icon: IconType;
    description: string;
}

const serviceCategories: ServiceCategory[] = [
  { id: 1, name: "Home Repair", icon: FaTools, description: "Expert repairs for your home maintenance needs" },
  { id: 2, name: "Electrical", icon: FaBolt, description: "Professional electrical services and installations" },
  { id: 3, name: "Plumbing", icon: FaShower, description: "Complete plumbing solutions for your property" },
  { id: 4, name: "Cleaning", icon: FaBroom, description: "Thorough cleaning services for homes and offices" },
  { id: 5, name: "Gardening", icon: FaLeaf, description: "Beautiful landscaping and garden maintenance" },
  { id: 6, name: "Painting", icon: FaPaintBrush, description: "Professional painting services for any space" },
  { id: 7, name: "Moving", icon: FaTruck, description: "Safe and efficient moving and packing services" },
  { id: 8, name: "Appliance Repair", icon: FaWrench, description: "Expert repair for all your appliances" },
];

const ServiceDetail = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState<ServiceCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    // Find the service details based on the categoryName from the URL
    const formattedCategoryName = categoryName?.toLowerCase().replace(/\s+/g, '-');
    const foundService = serviceCategories.find(cat => cat.name.toLowerCase().replace(/\s+/g, '-') === formattedCategoryName);
    if (foundService) {
      setService(foundService);
      setLoading(false);
    } else {
      setError("Service not found.");
      setLoading(false);
    }
  }, [categoryName]);

    const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    setFormSuccess("")

    if (!description.trim()) {
      return setFormError("Please provide a description of the service you need")
    }

    if (!price || isNaN(Number.parseFloat(price)) || Number.parseFloat(price) <= 0) {
      return setFormError("Please enter a valid price")
    }

    if (!user) {
        return setFormError("You need to be logged in to request a service.");
    }

    try {
      const serviceRequest = {
        category: service?.name, // Use optional chaining here
        description,
        price: Number.parseFloat(price),
        userId: user._id,
        userName: user.name,
      }

      // Assuming you have a socket context available globally or passed down
      // const { socket } = useSocket(); // Uncomment if socket is needed here
      // if (socket) { socket.emit("new-service-request", res.data); }

      await axios.post(`${API_URL}/service-requests`, serviceRequest);

      setFormSuccess("Your service request has been submitted successfully!")
      setDescription("")
      setPrice("")

      // Hide the form after successful submission
      setTimeout(() => {
        setShowRequestForm(false)
        setFormSuccess("")
      }, 3000)
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to submit service request. Please try again.")
    }
  }


  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 text-white text-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 text-red-500 text-center">{error}</div>;
  }

  if (!service) {
      return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 text-yellow-500 text-center">Service details not available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
                 {/* Image Placeholder - Replace with actual image based on category if available */}
                <div className="flex justify-center mb-6 text-blue-600">
                   {/* Use React.createElement to render the dynamic icon component */}
                   {React.createElement(service.icon, { size: 80 })}
                 </div>

                <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center">{service.name}</h1>
                <p className="text-lg text-gray-600 mb-8 text-center">{service.description}</p>

                 {/* Request Service Button */}
                 {user?.role === "User" && (
                    <div className="text-center mb-8">
                        <button
                        onClick={() => setShowRequestForm(!showRequestForm)}
                        className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-md font-bold text-lg transition shadow-md"
                        >
                        {showRequestForm ? "Cancel Request" : "Request this Service"}
                        </button>
                    </div>
                 )}

                 {/* Request Service Form */}
                {showRequestForm && user?.role === "User" && (
                <div className="bg-gray-50 p-6 rounded-lg mt-4 shadow-inner">
                    <h3 className="text-2xl font-bold mb-4 text-blue-600">Submit Your Request</h3>
                     {formError && (
                        <div className="bg-red-50 border-l-4 border-red-600 p-3 mb-4 rounded shadow-md">
                            <p className="text-sm text-red-800">{formError}</p>
                        </div>
                     )}
                    {formSuccess && (
                        <div className="bg-green-50 border-l-4 border-green-600 p-3 mb-4 rounded shadow-md">
                            <p className="text-sm text-green-800">{formSuccess}</p>
                        </div>
                    )}
                    <form onSubmit={handleRequestSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="description" className="block text-gray-700 mb-1 text-sm font-medium">Description:</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Provide detailed description of the service needed..."
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-gray-700 mb-1 text-sm font-medium">Your Budget (USD):</label>
                            <input
                                id="price"
                                type="number"
                                min="1"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Enter your budget"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md font-semibold transition shadow-md"
                        >
                            Submit Request
                        </button>
                    </form>
                </div>
                )}

            </div>
        </div>
         {/* Footer Placeholder */}
        <div className="mt-12 text-center text-gray-600 text-sm">
            {/* Replace with actual Footer component if available */}
            <p>&copy; 2023 ServiceConnect. All rights reserved.</p>
        </div>
    </div>
  );
};

export default ServiceDetail; 