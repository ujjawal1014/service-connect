const Job = require("../models/job.model")
// const { io } = require("../server") // Remove direct import
const User = require("../models/user.model")

module.exports = (io) => { // Export a function that takes io

  // Get jobs by user ID
  const getJobsByUserId = async (req, res) => {
    try {
      const jobs = await Job.find({ userId: req.params.userId })
      res.json(jobs)
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  }

  // Get jobs by worker ID
  const getJobsByWorkerId = async (req, res) => {
    try {
      const jobs = await Job.find({ workerId: req.params.workerId })
      res.json(jobs)
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  }

  // Start a job (change status to in-progress)
  const startJob = async (req, res) => {
    try {
      const job = await Job.findByIdAndUpdate(req.params.id, { status: "in-progress" }, { new: true })

      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }

      // Emit socket event
      io.to(job.userId.toString()).emit("job-status-updated", job)
      io.to(job.workerId.toString()).emit("job-status-updated", job)

      res.json(job)
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  }

  // Complete a job
  const completeJob = async (req, res) => {
    try {
      const job = await Job.findByIdAndUpdate(
        req.params.id,
        {
          status: "completed",
          completedAt: Date.now(),
        },
        { new: true },
      )

      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }

      // Emit socket event
      io.to(job.userId.toString()).emit("job-status-updated", job)
      io.to(job.workerId.toString()).emit("job-status-updated", job)

      res.json(job)
    } catch (error) {
      console.error("Error in completeJob:", error);
      if (error instanceof Error) {
        console.error("Error stack:", error.stack);
      } else {
        console.error("Error details:", error);
      }
      res.status(500).json({ message: "Server error", error: error.message || "An unknown error occurred" });
    }
  }

  // Mark payment as done
  const markPaymentDone = async (req, res) => {
    try {
      const job = await Job.findByIdAndUpdate(
        req.params.id,
        { paymentStatus: "done" },
        { new: true },
      )
      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }
      // Emit socket event
      io.to(job.userId.toString()).emit("job-payment-done", job)
      io.to(job.workerId.toString()).emit("job-payment-done", job)
      res.json(job)
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  }

  // Add review to a job and update worker's average rating
  const addReview = async (req, res) => {
    try {
      const { rating, comment } = req.body

      const job = await Job.findByIdAndUpdate(
        req.params.id,
        {
          reviewed: true,
          rating,
          review: comment,
        },
        { new: true },
      )

      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }

      // Update worker's average rating
      const jobs = await Job.find({ workerId: job.workerId, reviewed: true, rating: { $exists: true } })
      const avgRating = jobs.length > 0 ? jobs.reduce((sum, j) => sum + (j.rating || 0), 0) / jobs.length : 0
      await User.findByIdAndUpdate(job.workerId, { averageRating: avgRating })

      // Emit socket event
      io.to(job.userId.toString()).emit("job-reviewed", job)
      io.to(job.workerId.toString()).emit("job-reviewed", job)

      res.json(job)
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  }

  // Get job details
  const getJobDetails = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id)
      if (!job) return res.status(404).json({ message: "Job not found" })
      res.json(job)
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  }

  return { // Return the controller methods
    getJobsByUserId,
    getJobsByWorkerId,
    startJob,
    completeJob,
    markPaymentDone,
    addReview,
    getJobDetails,
  }
}
