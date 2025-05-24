const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const http = require("http")
const socketIo = require("socket.io")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")
const serviceRoutes = require("./routes/service.routes")
const jobRoutes = require("./routes/job.routes")
const contactRoutes = require("./routes/contact.routes")
const uploadRoutes = require("./routes/upload.routes")

// Import middleware
const authMiddleware = require("./middleware/auth.middleware")

// Create Express app
const app = express()
const server = http.createServer(app)

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: "https://service-connect-1fsd.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
})

// Middleware
app.use(cors({
  origin: "https://service-connect-1fsd.onrender.com",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json())
app.use('/uploads', express.static('uploads')) // Serve static files from the 'uploads' directory

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODBATLAS)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err))

// Socket.io authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token

  if (!token) {
    return next(new Error("Authentication error"))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.user = decoded
    next()
  } catch (err) {
    next(new Error("Authentication error"))
  }
})

// Socket.io connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.user.id)

  // Join room based on role
  socket.join(socket.user.role)
  // Join room based on user ID
  socket.join(socket.user.id)

  // Listen for new service requests
  socket.on("new-service-request", (serviceRequest) => {
    // Broadcast to all workers
    socket.broadcast.to("Worker").emit("new-service-request", serviceRequest)
  })

  // Listen for accepted service requests
  socket.on("service-request-accepted", (requestId) => {
    // Broadcast to all workers to remove this request
    socket.broadcast.to("Worker").emit("service-request-accepted", requestId)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user.id)
  })
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/services", serviceRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/upload", uploadRoutes)

// Import the service request controller function
const serviceRequestController = require("./controllers/service-request.controller")(io);

// Create a router for service requests
const serviceRequestRouter = express.Router();

// Define service request routes using the controller methods with access to io
serviceRequestRouter.get("/", authMiddleware, serviceRequestController.getAllServiceRequests);
serviceRequestRouter.get("/user/:userId", authMiddleware, serviceRequestController.getServiceRequestsByUserId);
serviceRequestRouter.post("/", authMiddleware, serviceRequestController.createServiceRequest);
serviceRequestRouter.post("/:id/accept", authMiddleware, serviceRequestController.acceptServiceRequest);
serviceRequestRouter.delete("/:id", authMiddleware, serviceRequestController.deleteServiceRequest);

// Use the configured service request router
app.use("/api/service-requests", serviceRequestRouter);

// Import the job controller function
const jobController = require("./controllers/job.controller")(io);

// Create a router for job routes
const jobRouter = express.Router();

// Define job routes using the controller methods with access to io
jobRouter.get("/user/:userId", authMiddleware, jobController.getJobsByUserId);
jobRouter.get("/worker/:workerId", authMiddleware, jobController.getJobsByWorkerId);
jobRouter.get('/:id', authMiddleware, jobController.getJobDetails);
jobRouter.patch("/:id/start", authMiddleware, jobController.startJob);
jobRouter.patch("/:id/complete", authMiddleware, jobController.completeJob);
jobRouter.patch("/:id/payment-done", authMiddleware, jobController.markPaymentDone);
jobRouter.patch('/:id/review', authMiddleware, jobController.addReview);

// Use the configured job router
app.use("/api/jobs", jobRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Service Marketplace API is running")
})

// Start server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server, io }
