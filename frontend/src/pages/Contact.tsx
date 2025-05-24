import React, { useState } from "react"
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCommentDots, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"

const Contact = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const res = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, address, reason }),
      })
      if (res.ok) {
        setSuccess("Thank you! We have mailed the host. You will be contacted soon.")
        setName("")
        setEmail("")
        setPhone("")
        setAddress("")
        setReason("")
      } else {
        setError("Failed to send message. Please try again later.")
      }
    } catch (err) {
      setError("Failed to send message. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-500 to-purple-600 text-white py-16 shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515168833906-d2a3b82b302b?auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg tracking-tight">Contact Us</h1>
          <p className="text-2xl mb-2 max-w-2xl mx-auto text-blue-100 font-light opacity-90">
            We'd love to hear from you. Fill out the form below and we'll get in touch soon.
          </p>
        </div>
      </section>
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center py-12 px-4 gap-12 container mx-auto w-full">
        {/* Contact Info Sidebar */}
        <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8 md:mb-0 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 drop-shadow-lg">Get in Touch</h2>
          <div className="flex flex-col gap-4 w-full text-gray-600 text-sm">
            <div className="flex items-center gap-3"><FaEnvelope className="text-xl text-blue-600" /> support@serviceconnect.com</div>
            <div className="flex items-center gap-3"><FaPhone className="text-xl text-blue-600" /> +1 234 567 8901</div>
            <div className="flex items-center gap-3"><FaMapMarkerAlt className="text-xl text-blue-600" /> 123 Main St, City, Country</div>
          </div>
          <div className="mt-8 flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-2xl"><FaFacebook className="text-blue-600"/></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-2xl"><FaTwitter className="text-blue-600"/></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 text-2xl"><FaInstagram className="text-pink-600"/></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-2xl"><FaLinkedin className="text-blue-600"/></a>
          </div>
        </div>
        {/* Contact Form */}
        <div className="w-full md:w-2/3 bg-white py-10 px-8 shadow-xl rounded-2xl border border-gray-200">
          {success && <div className="bg-green-900/80 border-l-4 border-green-500 p-4 mb-6 rounded text-green-200">{success}</div>}
          {error && <div className="bg-red-900/80 border-l-4 border-red-500 p-4 mb-6 rounded text-red-200">{error}</div>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <div className="flex items-center">
                <FaUser className="absolute ml-3 text-blue-600 text-lg" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-gray-50 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="flex items-center">
                <FaEnvelope className="absolute ml-3 text-blue-600 text-lg" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-gray-50 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="flex items-center">
                <FaPhone className="absolute ml-3 text-blue-600 text-lg" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-gray-50 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="flex items-center">
                <FaMapMarkerAlt className="absolute ml-3 text-blue-600 text-lg" />
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-gray-50 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Reason to Contact</label>
              <div className="flex items-start">
                <FaCommentDots className="absolute ml-3 mt-3 text-blue-600 text-lg" />
                <textarea
                  id="reason"
                  name="reason"
                  required
                  rows={4}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-gray-50 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact 