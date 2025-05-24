"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { useSocket } from "../context/SocketContext"

// Add types for jobs and service requests
interface ServiceRequest {
  _id: string
  category: string
  description: string
  price: number
  userId: string
  userName: string
}
interface Job {
  _id: string
  category: string
  description: string
  price: number
  userId: string
  userName: string
  workerId: string
  workerName: string
  status: string
  paymentStatus: string
  reviewed?: boolean
  rating?: number
  review?: string
}

const UserDashboard = () => {
  const { user } = useAuth()
  const { socket } = useSocket()
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [activeJobs, setActiveJobs] = useState<Job[]>([])
  const [completedJobs, setCompletedJobs] = useState<Job[]>([])
  const [jobTab, setJobTab] = useState<'active' | 'completed'>("active")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showJobModal, setShowJobModal] = useState(false)
  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewError, setReviewError] = useState("")
  const [workerQrCode, setWorkerQrCode] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        // Fetch user's service requests
        const requestsRes = await axios.get(`http://localhost:3000/api/service-requests/user/${user._id}`)
        setServiceRequests(requestsRes.data)

        // Fetch user's jobs (both active and completed)
        const jobsRes = await axios.get(`http://localhost:3000/api/jobs/user/${user._id}`)
        setActiveJobs(jobsRes.data.filter((job: Job) => job.status !== "completed"))
        setCompletedJobs(jobsRes.data.filter((job: Job) => job.status === "completed"))

        setLoading(false)
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.")
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  useEffect(() => {
    if (socket) {
      // Listen for new service requests
      socket.on("new-service-request", (newRequest) => {
        console.log("User Dashboard: new-service-request received", newRequest);
        // This event is primarily for workers, users don't see this in their requests list initially
      });

      // Listen for service request status updates (less relevant now that requests are deleted on acceptance)
      socket.on("service-request-status-updated", (updatedRequest) => {
        console.log("User Dashboard: service-request-status-updated received", updatedRequest);
        setServiceRequests((prev) =>
          prev.filter((req) => req._id !== updatedRequest._id)
        );
      });

      // Listen for job status updates (e.g., from in-progress to completed)
      socket.on("job-status-updated", (updatedJob) => {
        console.log("User Dashboard: job-status-updated received", updatedJob);
        if (updatedJob.status === "completed") {
          setActiveJobs((prev) => prev.filter((job) => job._id !== updatedJob._id));
          setCompletedJobs((prev) => {
            const filtered = prev.filter((job) => job._id !== updatedJob._id);
            return [...filtered, updatedJob];
          });
        } else {
          // If status is not completed, ensure it's in activeJobs
          setCompletedJobs((prev) => prev.filter((job) => job._id !== updatedJob._id));
          setActiveJobs((prev) => {
            const exists = prev.some((job) => job._id === updatedJob._id);
            if (exists) {
              return prev.map((job) =>
                job._id === updatedJob._id ? updatedJob : job
              );
            }
            return [...prev, updatedJob]; // Add if it's a new active job (e.g., status changed from pending to in_progress)
          });
        }

        if (selectedJob && updatedJob._id === selectedJob._id) {
          setSelectedJob(updatedJob);
        }
      });

      // Listen for payment updates
      socket.on("job-payment-done", (updatedJob) => {
        console.log("User Dashboard: job-payment-done received", updatedJob);
        // Update job in both lists
        setActiveJobs((prev) =>
          prev.map((job) => (job._id === updatedJob._id ? updatedJob : job))
        );
        setCompletedJobs((prev) =>
          prev.map((job) => (job._id === updatedJob._id ? updatedJob : job))
        );
        if (selectedJob && updatedJob._id === selectedJob._id) {
          setSelectedJob(updatedJob);
        }
      });

      // Listen for review updates
      socket.on("job-reviewed", (updatedJob) => {
        console.log("User Dashboard: job-reviewed received", updatedJob);
        // Update job in both lists
        setActiveJobs((prev) =>
          prev.map((job) => (job._id === updatedJob._id ? updatedJob : job))
        );
        setCompletedJobs((prev) =>
          prev.map((job) => (job._id === updatedJob._id ? updatedJob : job))
        );
        if (selectedJob && updatedJob._id === selectedJob._id) {
          setSelectedJob(updatedJob);
        }
      });

      // Listen for job assignment (when a worker accepts a request)
      socket.on("job-assigned", (newJob) => {
        console.log("User Dashboard: job-assigned received", newJob);
        // Add the new job to the active jobs list if the user is the client
        if (newJob.userId === user?._id) {
           setActiveJobs((prev) => [newJob, ...prev]);
           // Also remove the corresponding service request
           setServiceRequests((prev) => prev.filter(req => req._id !== newJob.serviceRequest)) // Assuming newJob has serviceRequest ID
        }
      });
      socket.on("service-request-deleted", (requestId) => {
        console.log("User Dashboard: service-request-deleted received", requestId);
        // Remove the service request if it was cancelled by the user or accepted by a worker
        setServiceRequests((prev) => prev.filter(req => req._id !== requestId));
      });

      return () => {
        socket.off("job-status-updated");
        socket.off("job-payment-done");
        socket.off("job-reviewed");
        socket.off("job-assigned");
        socket.off("service-request-deleted");
      };
    }
  }, [socket, selectedJob, user?._id]);

  useEffect(() => {
    const fetchWorkerQrCode = async () => {
      if (showJobModal && selectedJob && selectedJob.status === 'completed') {
        try {
          const res = await axios.get(`http://localhost:3000/api/users/profile/${selectedJob.workerId}`)
          setWorkerQrCode(res.data.qrCodeUrl)
        } catch (err) {
          console.error("Failed to fetch worker QR code:", err)
          setWorkerQrCode("")
        }
      } else {
        setWorkerQrCode("") // Clear QR code when modal is closed or job is not completed
      }
    }
    fetchWorkerQrCode()
  }, [showJobModal, selectedJob])

  const handleCancelRequest = async (requestId) => {
    try {
      await axios.delete(`http://localhost:3000/api/service-requests/${requestId}`)
      setServiceRequests(serviceRequests.filter((req) => req._id !== requestId))
    } catch (err) {
      setError("Failed to cancel request. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 text-gray-900">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 drop-shadow-lg">User Dashboard</h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 rounded shadow-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Active Requests</h2>
            <div className="text-3xl font-bold text-blue-800">{serviceRequests.length}</div>
            <p className="text-gray-600 mt-2 text-sm">Pending service requests</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Active Jobs</h2>
            <div className="text-3xl font-bold text-green-600">{activeJobs.length}</div>
            <p className="text-gray-600 mt-2 text-sm">Jobs in progress</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Quick Actions</h2>
            <div className="space-y-2">
              <a
                href="/services"
                className="block bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-center transition shadow-md"
              >
                Request a Service
              </a>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-md font-semibold transition shadow-md ${jobTab === 'active' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
            onClick={() => setJobTab('active')}
          >
            Active Jobs
          </button>
          <button
            className={`px-6 py-2 rounded-md font-semibold transition shadow-md ${jobTab === 'completed' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
            onClick={() => setJobTab('completed')}
          >
            Completed Jobs
          </button>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Service Requests</h2>

          {serviceRequests.length === 0 ? (
            <div className="bg-gray-800/90 shadow-lg rounded-lg p-6 text-center border border-gray-700">
              <p className="text-blue-100">You don't have any active service requests.</p>
              <a
                href="/services"
                className="inline-block mt-4 bg-gradient-to-r from-blue-700 to-blue-900 text-white hover:from-blue-800 hover:to-blue-950 px-4 py-2 rounded-md text-sm transition shadow-lg"
              >
                Request a Service
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {serviceRequests.map((request) => (
                <div key={request._id} className="bg-gray-800/90 shadow-lg rounded-lg p-6 border border-gray-700">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-white">{request.category}</h3>
                      <p className="text-blue-100 mb-4">{request.description}</p>
                      <div className="flex flex-wrap gap-4">
                        <div className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm">
                          Budget: ${request.price.toFixed(2)}
                        </div>
                        <div className="bg-yellow-900/50 text-yellow-300 px-3 py-1 rounded-full text-sm">
                          Status: Pending
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0">
                      <button
                        onClick={() => handleCancelRequest(request._id)}
                        className="bg-gradient-to-r from-red-700 to-red-900 text-white hover:from-red-800 hover:to-red-950 px-4 py-2 rounded-md text-sm transition shadow-lg"
                      >
                        Cancel Request
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {jobTab === 'active' ? (
            activeJobs.length === 0 ? (
              <div className="bg-gray-800/90 shadow-lg rounded-lg p-6 text-center border border-gray-700">
                <p className="text-blue-100">You don't have any active jobs at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {activeJobs.map((job) => (
                  <div key={job._id} className="bg-gray-800/90 shadow-lg rounded-lg p-6 border border-gray-700">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-white">{job.category}</h3>
                        <p className="text-blue-100 mb-4">{job.description}</p>
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm">
                            Price: ${job.price.toFixed(2)}
                          </div>
                          <div className="bg-yellow-900/50 text-yellow-300 px-3 py-1 rounded-full text-sm">
                            Status: {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </div>
                          <div className="bg-green-900/50 text-green-300 px-3 py-1 rounded-full text-sm">
                            Payment: {job.paymentStatus === "done" ? "Done" : "Pending"}
                          </div>
                        </div>
                        <div className="text-sm text-blue-200">
                          <p>Worker: {job.workerName}</p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 space-y-2">
                        <button
                          className="block w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white hover:from-blue-800 hover:to-blue-950 px-4 py-2 rounded-md text-sm transition shadow-lg"
                          onClick={() => {
                            setSelectedJob(job)
                            setShowJobModal(true)
                          }}
                        >
                          {job.status === 'completed' ? 'Payment & Review' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            completedJobs.length === 0 ? (
              <div className="bg-gray-800/90 shadow-lg rounded-lg p-6 text-center border border-gray-700">
                <p className="text-blue-100">You don't have any completed jobs yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {completedJobs.map((job) => (
                  <div key={job._id} className="bg-gray-800/90 shadow-lg rounded-lg p-6 border border-gray-700">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-white">{job.category}</h3>
                        <p className="text-blue-100 mb-4">{job.description}</p>
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm">
                            Price: ${job.price.toFixed(2)}
                          </div>
                          <div className="bg-yellow-900/50 text-yellow-300 px-3 py-1 rounded-full text-sm">
                            Status: {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </div>
                          <div className="bg-green-900/50 text-green-300 px-3 py-1 rounded-full text-sm">
                            Payment: {job.paymentStatus === "done" ? "Done" : "Pending"}
                          </div>
                        </div>
                        <div className="text-sm text-blue-200">
                          <p>Worker: {job.workerName}</p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 space-y-2">
                        <button
                          className="block w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white hover:from-blue-800 hover:to-blue-950 px-4 py-2 rounded-md text-sm transition shadow-lg"
                          onClick={() => {
                            setSelectedJob(job)
                            setShowJobModal(true)
                          }}
                        >
                          {job.status === 'completed' ? 'Payment & Review' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
      {/* Job Details Modal */}
      {showJobModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 rounded-lg shadow-lg p-8 max-w-lg w-full border border-gray-700 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setShowJobModal(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-white">Job Details</h2>
            <div className="mb-4">
              <p className="text-blue-100"><span className="font-semibold">Worker:</span> {selectedJob.workerName}</p>
              <p className="text-blue-100"><span className="font-semibold">Description:</span> {selectedJob.description}</p>
              <p className="text-blue-100"><span className="font-semibold">Price:</span> ${selectedJob.price.toFixed(2)}</p>
              <p className="text-blue-100"><span className="font-semibold">Status:</span> {selectedJob.status}</p>
              <p className="text-blue-100"><span className="font-semibold">Payment:</span> {selectedJob.paymentStatus}</p>
            </div>
            {/* Review and Payment Section (for completed jobs) */}
            {selectedJob.status === "completed" && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2 text-white">Review and Payment</h3>
                {/* Review Form */}
                {!selectedJob.reviewed && selectedJob.paymentStatus !== "done" && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      setReviewError("")
                      if (!reviewText.trim()) {
                        setReviewError("Please enter a review.")
                        return
                      }
                      try {
                        await axios.patch(`http://localhost:3000/api/jobs/${selectedJob._id}/review`, {
                          rating: reviewRating,
                          comment: reviewText,
                        })
                        // Update selectedJob state locally after successful review submission
                        setSelectedJob(prev => prev ? { ...prev, reviewed: true, rating: reviewRating, review: reviewText } : null)
                        setReviewText("")
                        setReviewRating(5)
                      } catch (err) {
                         setReviewError("Failed to submit review. Please try again.")
                      }
                    }}
                    className="mt-4 p-4 bg-gray-800 rounded-md"
                  >
                    <label className="block text-blue-100 mb-2">Rating:</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                      placeholder="Write your review..."
                    ></textarea>
                    {reviewError && <div className="text-red-400 mb-2">{reviewError}</div>}
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-2 rounded-md font-medium transition shadow-lg w-full"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
                {/* Show review if already reviewed */}
                {selectedJob.reviewed && (
                  <div className="mt-4 p-4 bg-gray-800 rounded-md">
                    <div className="text-yellow-400 font-bold mb-2">Your Review:</div>
                    <div className="text-blue-100 mb-1">Rating: {selectedJob.rating} / 5</div>
                    <div className="text-blue-100">{selectedJob.review}</div>
                  </div>
                )}
                {/* Payment Section */}
                {selectedJob.reviewed && selectedJob.paymentStatus === "pending" && workerQrCode && (
                  <div className="mt-6 p-4 bg-gray-800 rounded-md text-center">
                    <h3 className="text-xl font-semibold mb-4 text-white">Scan to Pay</h3>
                    <img src={workerQrCode} alt="Worker QR Code" className="w-60 h-60 object-contain mx-auto border-2 border-blue-700 rounded-lg" />
                    <button
                      className="mt-6 w-full bg-gradient-to-r from-green-700 to-green-900 text-white px-6 py-2 rounded-md font-medium transition shadow-lg"
                      onClick={async () => {
                        try {
                          await axios.patch(`http://localhost:3000/api/jobs/${selectedJob._id}/payment-done`)
                          // Update selectedJob state locally after successful payment
                          setSelectedJob(prev => prev ? { ...prev, paymentStatus: "done" } : null)
                        } catch (err) {
                          setError("Failed to mark payment as done. Please try again.")
                        }
                      }}
                    >
                      Payment Done
                    </button>
                  </div>
                )}
                {selectedJob.paymentStatus === "done" && (
                   <div className="mt-4 p-4 bg-gray-800 rounded-md text-center text-green-400 font-bold">Payment Completed!</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDashboard
