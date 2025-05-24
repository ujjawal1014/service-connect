const express = require("express")
const router = express.Router()
const serviceRequestController = require("../controllers/service-request.controller")
const authMiddleware = require("../middleware/auth.middleware")

// Get all service requests
router.get("/", authMiddleware, serviceRequestController.getAllServiceRequests)

// Get service requests by user ID
router.get("/user/:userId", authMiddleware, serviceRequestController.getServiceRequestsByUserId)

// Create a new service request
router.post("/", authMiddleware, serviceRequestController.createServiceRequest)

// Accept a service request
router.post("/:id/accept", authMiddleware, serviceRequestController.acceptServiceRequest)

// Delete a service request
router.delete("/:id", authMiddleware, serviceRequestController.deleteServiceRequest)

module.exports = router
