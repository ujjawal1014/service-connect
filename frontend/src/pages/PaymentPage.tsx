import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/AuthContext"

const PaymentPage = () => {
  const { jobId } = useParams()
  const { user } = useAuth()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/api/jobs/${jobId}`)
        setJob(res.data)
      } catch (err) {
        setError("Failed to load job details.")
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [jobId])

  const handlePayment = async () => {
    setError("")
    setSuccess("")
    try {
      await axios.patch(`/api/jobs/${jobId}/payment`)
      setSuccess("Payment marked as done!")
      setTimeout(() => navigate("/user-dashboard"), 2000)
    } catch (err) {
      setError("Failed to process payment.")
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">Loading...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600">{error}</div>
  if (!job) return null

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-lg w-full">
        <h2 className="text-3xl font-bold mb-4 text-blue-600">Payment</h2>
        <div className="mb-4 text-gray-700 text-sm space-y-2">
          <div><span className="font-semibold">Job:</span> {job.category} - {job.description}</div>
          <div><span className="font-semibold">Worker:</span> {job.workerName}</div>
          <div><span className="font-semibold">You:</span> {user?.name} ({user?.email})</div>
          <div><span className="font-semibold">Amount:</span> ${job.price.toFixed(2)}</div>
        </div>
        <button onClick={handlePayment} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md">Mark Payment as Done</button>
        {success && <div className="mt-4 text-green-700 font-bold text-center">{success}</div>}
        {error && <div className="mt-4 text-red-700 font-bold text-center">{error}</div>}
      </div>
    </div>
  )
}

export default PaymentPage 