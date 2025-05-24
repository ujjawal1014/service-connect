const ServiceRequest = require("../models/service-request.model")
const Job = require("../models/job.model")
// const { io } = require("../server") // Remove direct import

// console.log("Service Request Controller loaded. io:", io); // Remove this log


module.exports = (io) => { // Export a function that takes io

  // Get all service requests
  const getAllServiceRequests = async (req, res) => {
    try {
      const serviceRequests = await ServiceRequest.find()
      res.json(serviceRequests)
    } catch (error) {
      console.error("Error fetching all service requests:", error)
      res.status(500).json({ message: "Server error", error: error.message })
    }
  }

  // Get service requests by user ID
  const getServiceRequestsByUserId = async (req, res) => {
    try {
      const serviceRequests = await ServiceRequest.find({ userId: req.params.userId })
      res.json(serviceRequests)
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  }

  // Create a new service request
  const createServiceRequest = async (req, res) => {
    try {
      const { category, description, price, userId, userName } = req.body

      const serviceRequest = new ServiceRequest({
        category,
        description,
        price,
        userId,
        userName,
        status: "pending",
      })

      await serviceRequest.save()

      // Emit socket event for new request (to all workers)
      io.to("Worker").emit("new-service-request", serviceRequest)

      res.status(201).json(serviceRequest)
    } catch (error) {
      console.error("Error creating service request:", error)
      res.status(500).json({ message: "Server error", error: error.message })
    }
  }

  // Accept a service request
  const acceptServiceRequest = async (req, res) => {
    try {
      const { workerId, workerName } = req.body

      // Find the service request
      const serviceRequest = await ServiceRequest.findById(req.params.id)
      if (!serviceRequest) {
        return res.status(404).json({ message: "Service request not found" })
      }

      // Create a new job
      const job = new Job({
        serviceRequestId: serviceRequest._id,
        userId: serviceRequest.userId,
        userName: serviceRequest.userName,
        workerId,
        workerName,
        category: serviceRequest.category,
        description: serviceRequest.description,
        price: serviceRequest.price,
        status: "accepted",
        paymentStatus: "pending",
      })

      await job.save()

      // Delete the service request as it's now a job
      await ServiceRequest.findByIdAndDelete(req.params.id);

      // Emit socket event for service request deletion (to all workers except the one who accepted)
      // The accepting worker will see the job appear via job-assigned event
      io.to("Worker").emit("service-request-deleted", serviceRequest._id);

      // Emit job-assigned event to the user (client) and the worker
      io.to(serviceRequest.userId).emit("job-assigned", job);
      io.to(workerId).emit("job-assigned", job);

      res.status(200).json({ job })
    } catch (error) {
      console.error("Error accepting service request:", error)
      res.status(500).json({ message: "Server error", error: error.message })
    }
  }

  // Delete a service request
  const deleteServiceRequest = async (req, res) => {
    try {
      const serviceRequest = await ServiceRequest.findByIdAndDelete(req.params.id)

      if (!serviceRequest) {
        return res.status(404).json({ message: "Service request not found" })
      }

      // Emit socket event for service request deletion (to all workers)
      io.to("Worker").emit("service-request-deleted", serviceRequest._id)

      res.json({ message: "Service request deleted successfully" })
    } catch (error) {
      console.error("Error deleting service request:", error)
      res.status(500).json({ message: "Server error", error: error.message })
    }
  }

  return { // Return the controller methods
    getAllServiceRequests,
    getServiceRequestsByUserId,
    createServiceRequest,
    acceptServiceRequest,
    deleteServiceRequest,
  }
}
