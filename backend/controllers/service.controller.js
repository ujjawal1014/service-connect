const Service = require("../models/service.model")

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
    res.json(services)
  } catch (error) {
    console.error("Error fetching all services:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) {
      return res.status(404).json({ message: "Service not found" })
    }

    res.json(service)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Create a new service
exports.createService = async (req, res) => {
  try {
    const { name, description, category } = req.body

    const service = new Service({
      name,
      description,
      category,
    })

    await service.save()
    res.status(201).json(service)
  } catch (error) {
    console.error("Error creating service:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update a service
exports.updateService = async (req, res) => {
  try {
    const { name, description, category } = req.body

    const service = await Service.findByIdAndUpdate(req.params.id, { name, description, category }, { new: true })

    if (!service) {
      return res.status(404).json({ message: "Service not found" })
    }

    res.json(service)
  } catch (error) {
    console.error("Error updating service:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id)

    if (!service) {
      return res.status(404).json({ message: "Service not found" })
    }

    res.json({ message: "Service deleted successfully" })
  } catch (error) {
    console.error("Error deleting service:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
