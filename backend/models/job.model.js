const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema({
  serviceRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceRequest",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  workerName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["accepted", "in-progress", "completed"],
    default: "accepted",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "done"],
    default: "pending",
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
  },
  reviewed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
})

const Job = mongoose.model("Job", jobSchema)

module.exports = Job
