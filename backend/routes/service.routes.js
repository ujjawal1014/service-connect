const express = require("express")
const router = express.Router()
const serviceController = require("../controllers/service.controller")
const authMiddleware = require("../middleware/auth.middleware")

// Get all services
router.get("/", serviceController.getAllServices)

// Get service by ID
router.get("/:id", serviceController.getServiceById)

// Create a new service (admin only)
router.post("/", authMiddleware, serviceController.createService)

// Update a service (admin only)
router.put("/:id", authMiddleware, serviceController.updateService)

// Delete a service (admin only)
router.delete("/:id", authMiddleware, serviceController.deleteService)

module.exports = router
