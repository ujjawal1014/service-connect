"use client"

import React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"
import axiosInstance from '../config/axios';
import { API_URL } from '../config/api';

interface User {
  _id: string
  name: string
  email: string
  role: "User" | "Worker"
  qrCodeUrl?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: "User" | "Worker", qrCodeUrl?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")

        if (token) {
          const res = await axiosInstance.get("/auth/me")
          setUser(res.data)
        }
      } catch (error) {
        localStorage.removeItem("token")
      }

      setLoading(false)
    }

    checkLoggedIn()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      })

      const { token, user } = res.data

      localStorage.setItem("token", token)
      setUser(user)
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed")
    }
  }

  const register = async (name: string, email: string, password: string, role: "User" | "Worker", qrCodeUrl?: string) => {
    try {
      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
        role,
        ...(role === "Worker" && qrCodeUrl ? { qrCodeUrl } : {}),
      })

      const { token, user } = res.data

      localStorage.setItem("token", token)
      setUser(user)
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed")
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}
