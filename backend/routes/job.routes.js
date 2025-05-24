const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/auth.middleware")

// Get jobs
// router.get("/user/:userId", authMiddleware, jobController.getJobsByUserId)
// router.get("/worker/:workerId", authMiddleware, jobController.getJobsByWorkerId)
// router.get('/:id', authMiddleware, jobController.getJobDetails)

// Job status updates
// router.patch("/:id/start", authMiddleware, jobController.startJob)
// router.patch("/:id/complete", authMiddleware, jobController.completeJob)

// Payment and review
// router.patch("/:id/payment-done", authMiddleware, jobController.markPaymentDone)
// router.patch('/:id/review', authMiddleware, jobController.addReview)

module.exports = router
