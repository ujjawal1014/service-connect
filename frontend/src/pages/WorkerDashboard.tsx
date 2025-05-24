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
  status: "pending" | "accepted" | "rejected"
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

const WorkerDashboard = () => {
  const { user } = useAuth()
  const { socket, connected } = useSocket()

  const [availableRequests, setAvailableRequests] = useState<ServiceRequest[]>([])
  const [activeJobs, setActiveJobs] = useState<Job[]>([])
  const [completedJobs, setCompletedJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notification, setNotification] = useState("")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showJobModal, setShowJobModal] = useState(false)
  const [jobTab, setJobTab] = useState<'active' | 'completed'>("active")

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      try {
        // Fetch available service requests
        const requestsRes = await axios.get("http://localhost:3000/api/service-requests")
        setAvailableRequests(requestsRes.data)

        // Fetch worker's active jobs
        const jobsRes = await axios.get(`http://localhost:3000/api/jobs/worker/${user._id}`)
        setActiveJobs(jobsRes.data.filter((job: Job) => job.status !== "completed"))
        setCompletedJobs(jobsRes.data.filter((job: Job) => job.status === "completed"))

        setLoading(false)
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.")
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  useEffect(() => {
    if (socket) {
      // Listen for new service requests
      socket.on("new-service-request", (newRequest) => {
        console.log("Worker Dashboard: new-service-request received", newRequest);
        setAvailableRequests((prev) => [newRequest, ...prev])
        setNotification("New service request available!")
        setTimeout(() => setNotification(""), 5000)
      })

      // Listen for service request status updates
      socket.on("service-request-status-updated", (updatedRequest) => {
        console.log("Worker Dashboard: service-request-status-updated received", updatedRequest);
        setAvailableRequests((prev) =>
          prev.filter((req) => req._id !== updatedRequest._id)
        )
      })

      // Listen for job status updates
      socket.on("job-status-updated", (updatedJob) => {
        console.log("Worker Dashboard: job-status-updated received", updatedJob);
        if (updatedJob.status === "completed") {
          // Remove from active jobs and add to completed jobs
          setActiveJobs(prevActiveJobs => prevActiveJobs.filter(job => job._id !== updatedJob._id));
          setCompletedJobs(prevCompletedJobs => {
             // Remove existing job with the same _id before adding the updated one
             const filteredJobs = prevCompletedJobs.filter(job => job._id !== updatedJob._id);
             return [...filteredJobs, updatedJob];
          });
        } else {
          // If status is not completed, ensure it's in activeJobs
          // Remove from completed jobs and update/add to active jobs
          setCompletedJobs(prevCompletedJobs => prevCompletedJobs.filter(job => job._id !== updatedJob._id));
          setActiveJobs(prevActiveJobs => {
             const exists = prevActiveJobs.some(job => job._id === updatedJob._id);
             if (exists) {
               return prevActiveJobs.map(job =>
                 job._id === updatedJob._id ? updatedJob : job
               );
             } else {
               return [...prevActiveJobs, updatedJob];
             }
          });
        }

        if (selectedJob?._id === updatedJob._id) {
          setSelectedJob(updatedJob);
        }
      })

      // Listen for payment updates
      socket.on("job-payment-done", (updatedJob) => {
        console.log("Worker Dashboard: job-payment-done received", updatedJob);
        setActiveJobs((prev) =>
          // Remove existing job and add the updated one
          [...prev.filter(job => job._id !== updatedJob._id), updatedJob]
        )
        setCompletedJobs((prev) =>
          // Remove existing job and add the updated one
          [...prev.filter(job => job._id !== updatedJob._id), updatedJob]
        )
        if (selectedJob?._id === updatedJob._id) {
          setSelectedJob(updatedJob)
        }
      })

      // Listen for review updates
      socket.on("job-reviewed", (updatedJob) => {
        console.log("Worker Dashboard: job-reviewed received", updatedJob);
        setActiveJobs((prev) =>
          // Remove existing job and add the updated one
          [...prev.filter(job => job._id !== updatedJob._id), updatedJob]
        )
        setCompletedJobs((prev) =>
          // Remove existing job and add the updated one
          [...prev.filter(job => job._id !== updatedJob._id), updatedJob]
        )
        if (selectedJob?._id === updatedJob._id) {
          setSelectedJob(updatedJob)
        }
      })

      // Listen for job assignment (when a worker accepts a request)
      socket.on("job-assigned", (newJob) => {
        console.log("Worker Dashboard: job-assigned received", newJob);
        // This event should add the new job to the active jobs list for the accepting worker
        // Ensure this doesn't cause duplicates if the initial fetch already includes it
        setActiveJobs((prev) => {
           const exists = prev.some((job) => job._id === newJob._id);
           if (!exists) {
             return [newJob, ...prev];
           }
           return prev; // Job already exists, no need to add
        });
      })

      return () => {
        socket.off("new-service-request")
        socket.off("service-request-status-updated")
        socket.off("job-status-updated")
        socket.off("job-payment-done")
        socket.off("job-reviewed")
        socket.off("job-assigned")
      }
    }
  }, [socket, selectedJob])

  const handleAcceptRequest = async (requestId: string) => {
    if (!user) return
    try {
      const res = await axios.post(
        `http://localhost:3000/api/service-requests/${requestId}/accept`,
        {
          workerId: user._id,
          workerName: user.name,
        }
      )

      // Remove the accepted request from available requests
      setAvailableRequests(availableRequests.filter((req) => req._id !== requestId))

      // Assuming backend emits 'job-assigned' and 'service-request-accepted' for other workers
      // The 'job-assigned' socket handler will add the job to activeJobs
      // The 'service-request-accepted' socket handler will remove the request for others

      // Optional: optimistic update for the current worker (add to active jobs immediately)
      // This might cause a brief inconsistency if the backend process fails after the API call succeeds
      // For now, we rely on the 'job-assigned' socket event to add to active jobs for the accepting worker as well.

    } catch (err) {
      setError("Failed to accept request. Please try again.")
    }
  }

  const handleMarkAsCompleted = async (jobId: string) => {
    if (!user) return;
    try {
      const response = await axios.patch(`http://localhost:3000/api/jobs/${jobId}/complete`);
      const updatedJob = response.data;
      // The socket listener for 'job-status-updated' will handle updating the state
    } catch (err) {
      setError("Failed to mark job as completed. Please try again.");
    }
  };

  const handleUpdateJobStatus = async (jobId: string, newStatus: string) => {
    if (!user) return
    try {
      const response = await axios.patch(`http://localhost:3000/api/jobs/${jobId}/${newStatus}`)
      const updatedJob = response.data

      // Optimistic update
      if (newStatus === "completed") {
        setActiveJobs((prev) => prev.filter((job) => job._id !== jobId))
        setCompletedJobs((prev) => [...prev, updatedJob])
      } else {
        setActiveJobs((prev) =>
          prev.map((job) => (job._id === jobId ? updatedJob : job))
        )
      }

      // Update selected job if it's the one being modified
      if (selectedJob?._id === jobId) {
        setSelectedJob(updatedJob)
      }
    } catch (err) {
      setError("Failed to update job status. Please try again.")
      // Revert optimistic update on error
      const response = await axios.get(`http://localhost:3000/api/jobs/${jobId}`)
      const job = response.data
      if (job.status === "completed") {
        setActiveJobs((prev) => prev.filter((j) => j._id !== jobId))
        setCompletedJobs((prev) => [...prev, job])
      } else {
        setActiveJobs((prev) =>
          prev.map((j) => (j._id === jobId ? job : j))
        )
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 text-gray-900">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 drop-shadow-lg">Worker Dashboard</h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 rounded shadow-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {notification && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6 rounded shadow-md animate-pulse">
            <p className="text-sm text-blue-800">{notification}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Available Requests</h2>
            <div className="text-3xl font-bold text-blue-800">{availableRequests.length}</div>
            <p className="text-gray-600 mt-2 text-sm">New service requests waiting</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Active Jobs</h2>
            <div className="text-3xl font-bold text-green-600">{activeJobs.length}</div>
            <p className="text-gray-600 mt-2 text-sm">Jobs you are currently working on</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Completed Jobs Today</h2>
            <div className="text-3xl font-bold text-yellow-600">{completedJobs.length}</div>
            <p className="text-gray-600 mt-2 text-sm">Jobs you finished today</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-md font-semibold transition shadow-lg ${jobTab === 'active' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
            onClick={() => setJobTab('active')}
          >
            Active Jobs
          </button>
          <button
            className={`px-6 py-2 rounded-md font-semibold transition shadow-lg ${jobTab === 'completed' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
            onClick={() => setJobTab('completed')}
          >
            Completed Jobs
          </button>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Available Service Requests</h2>

          {availableRequests.length === 0 ? (
            <div className="bg-white shadow-lg rounded-lg p-6 text-center border border-gray-200">
              <p className="text-gray-600">No new service requests available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {availableRequests.map((request) => (
                <div key={request._id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">{request.category}</h3>
                      <p className="text-gray-600 mb-4">{request.description}</p>
                      <div className="flex flex-wrap gap-4">
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          Budget: ${request.price.toFixed(2)}
                        </div>
                        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                          Status: Pending
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0">
                      <button
                        onClick={() => handleAcceptRequest(request._id)}
                        className="bg-gradient-to-r from-green-700 to-green-900 text-white hover:from-green-800 hover:to-green-950 px-4 py-2 rounded-md text-sm transition shadow-lg"
                      >
                        Accept Request
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
              <div className="bg-white shadow-lg rounded-lg p-6 text-center border border-gray-200">
                <p className="text-gray-600">You don't have any active jobs at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {activeJobs.map((job) => (
                  <div key={job._id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">{job.category}</h3>
                        <p className="text-gray-600 mb-4">{job.description}</p>
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            Price: ${job.price.toFixed(2)}
                          </div>
                          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                            Status: {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </div>
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            Payment: {job.paymentStatus === "done" ? "Done" : "Pending"}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Client: {job.userName}</p>
                        </div>
                        {/* Mark as Completed Button */}
                        {job.status !== "completed" && (
                          <button
                            className="mt-4 bg-gradient-to-r from-green-700 to-green-900 text-white px-6 py-2 rounded-md font-medium transition shadow-lg hover:from-green-800 hover:to-green-950 hover:scale-105"
                            onClick={async () => {
                              try {
                                await axios.patch(`http://localhost:3000/api/jobs/${job._id}/complete`);
                                // Optimistically update state
                                setActiveJobs(prevActiveJobs => prevActiveJobs.filter(activeJob => activeJob._id !== job._id));
                                setCompletedJobs(prevCompletedJobs => [...prevCompletedJobs, { ...job, status: "completed" }]);
                              } catch (err) {
                                setError("Failed to mark job as completed. Please try again.");
                                // Optionally revert optimistic update or refetch data on error
                              }
                            }}
                          >
                            Mark as Completed
                          </button>
                        )}
                      </div>

                      <div className="mt-4 md:mt-0 space-y-2">
                        <button
                          className="block w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white hover:from-blue-800 hover:to-blue-950 px-4 py-2 rounded-md text-sm transition shadow-lg"
                          onClick={() => {
                            setSelectedJob(job)
                            setShowJobModal(true)
                          }}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            completedJobs.length === 0 ? (
              <div className="bg-white shadow-lg rounded-lg p-6 text-center border border-gray-200">
                <p className="text-gray-600">You don't have any completed jobs yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {completedJobs.map((job) => (
                  <div key={job._id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">{job.category}</h3>
                        <p className="text-gray-600 mb-4">{job.description}</p>
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            Price: ${job.price.toFixed(2)}
                          </div>
                          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                            Status: {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </div>
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            Payment: {job.paymentStatus === "done" ? "Done" : "Pending"}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Client: {job.userName}</p>
                        </div>
                        {/* Review and Payment Info for completed jobs */}
                        {
                          <div className="mt-4">
                            {job.paymentStatus !== "done" && (
                              <div className="text-gray-600 font-bold mb-2">Waiting for payment confirmation from user...</div>
                            )}
                            {job.paymentStatus === "done" && (
                              <div className="text-green-600 font-bold mb-2">Payment Done!</div>
                            )}
                            {job.reviewed && (
                              <div className="mt-2">
                                <div className="text-gray-600 font-bold mb-2">Review:</div>
                                <div className="text-gray-700 mb-1">Rating: {job.rating} / 5</div>
                                <div className="text-gray-700">{job.review}</div>
                              </div>
                            )}
                          </div>
                        }
                      </div>

                      <div className="mt-4 md:mt-0 space-y-2">
                        <button
                          className="block w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white hover:from-blue-800 hover:to-blue-950 px-4 py-2 rounded-md text-sm transition shadow-lg"
                          onClick={() => {
                            setSelectedJob(job)
                            setShowJobModal(true)
                          }}
                        >
                          Details
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
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full border border-gray-200 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setShowJobModal(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Job Details</h2>
            <div className="mb-4">
              <p className="text-gray-700"><span className="font-semibold">Client:</span> {selectedJob.userName}</p>
              <p className="text-gray-700"><span className="font-semibold">Worker:</span> {selectedJob.workerName}</p>
              <p className="text-gray-700"><span className="font-semibold">Description:</span> {selectedJob.description}</p>
              <p className="text-gray-700"><span className="font-semibold">Price:</span> ${selectedJob.price.toFixed(2)}</p>
              <p className="text-gray-700"><span className="font-semibold">Status:</span> {selectedJob.status}</p>
              <p className="text-gray-700"><span className="font-semibold">Payment:</span> {selectedJob.paymentStatus}</p>
            </div>
            {/* Work is Done button for worker */}
            {selectedJob.status === "in_progress" && (
              <button
                className="mt-6 w-full bg-gradient-to-r from-green-700 to-green-900 text-white px-6 py-2 rounded-md font-medium transition shadow-lg"
                onClick={async () => {
                  await handleMarkAsCompleted(selectedJob._id)
                }}
              >
                Work Done
              </button>
            )}
            {/* Show payment and review info if available */}
            {selectedJob.status === "completed" && (
              <div className="mt-4">
                <div className="text-gray-600 font-bold mb-2">Waiting for payment confirmation from user...</div>
                {selectedJob.paymentStatus === "done" && (
                  <div className="text-green-600 font-bold mb-2">Payment Done!</div>
                )}
                {selectedJob.reviewed && (
                  <div className="mt-2">
                    <div className="text-gray-600 font-bold mb-2">Review:</div>
                    <div className="text-gray-700 mb-1">Rating: {selectedJob.rating} / 5</div>
                    <div className="text-gray-700">{selectedJob.review}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkerDashboard
