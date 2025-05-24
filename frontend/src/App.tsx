"use client"

import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import About from "./pages/About"
import Services from "./pages/Services"
import Login from "./pages/Login"
import Register from "./pages/Register"
import WorkerDashboard from "./pages/WorkerDashboard"
import UserDashboard from "./pages/UserDashboard"
import Contact from "./pages/Contact"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { SocketProvider } from "./context/SocketContext"

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}

// Role-based route component
const RoleRoute = ({ children, allowedRole }) => {
  const { user } = useAuth()

  if (!user || user.role !== allowedRole) {
    return <Navigate to="/" />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/contact" element={<Contact />} />

                {/* Protected routes */}
                <Route
                  path="/services"
                  element={
                    <ProtectedRoute>
                      <Services />
                    </ProtectedRoute>
                  }
                />

                {/* Role-based routes */}
                <Route
                  path="/worker-dashboard"
                  element={
                    <RoleRoute allowedRole="Worker">
                      <WorkerDashboard />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/user-dashboard"
                  element={
                    <RoleRoute allowedRole="User">
                      <UserDashboard />
                    </RoleRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App
