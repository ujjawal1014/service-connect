const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")

// Register a new user
router.post("/register", authController.register)

// Login user
router.post("/login", authController.login)

// Get current user
router.get("/me", authMiddleware, authController.getCurrentUser)

module.exports = router
