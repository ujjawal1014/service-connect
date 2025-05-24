"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { io, type Socket } from "socket.io-client"
import { useAuth } from "./AuthContext"

interface SocketContextType {
  socket: Socket | null
  connected: boolean
}

const SocketContext = createContext<SocketContextType | null>(null)

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect()
        setSocket(null)
        setConnected(false)
      }
      return
    }

    // Initialize socket connection
    const newSocket = io("https://service-connect-s65a.onrender.com", {
      auth: {
        token: localStorage.getItem("token"),
      },
      withCredentials: true,
      transports: ['websocket', 'polling']
    })

    newSocket.on("connect", () => {
      console.log("Socket connected")
      setConnected(true)
    })

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
      setConnected(false)
    })

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected")
      setConnected(false)
    })

    setSocket(newSocket)

    // Cleanup on unmount
    return () => {
      newSocket.disconnect()
    }
  }, [user])

  return <SocketContext.Provider value={{ socket, connected }}>{children}</SocketContext.Provider>
}
