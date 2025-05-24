const express = require("express")
const router = express.Router()
const User = require("../models/user.model")
const authMiddleware = require("../middleware/auth.middleware")

// Get user profile
router.get("/profile/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update user profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body

    // Build profile object
    const profileFields = {}
    if (name) profileFields.name = name
    if (email) profileFields.email = email

    // Update user
    const user = await User.findByIdAndUpdate(req.user.id, { $set: profileFields }, { new: true }).select("-password")

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
