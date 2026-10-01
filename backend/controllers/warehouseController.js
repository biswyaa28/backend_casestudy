// Import mongoose so we can check if an id is a valid ObjectId.
const mongoose = require("mongoose");
// Import the Warehouse model.
const Warehouse = require("../models/Warehouse");

// createWarehouse: manager creates a new warehouse.
const createWarehouse = async (req, res) => {
  try {
    // Pull the fields we need out of the request body.
    const { name, location } = req.body;

    // Both fields are required.
    if (!name || !location) {
      return res.status(400).json({ message: "Name and location are required" });
    }

    // Create and save the new warehouse.
    const warehouse = await Warehouse.create({ name, location });

    // Respond with the created warehouse.
    return res.status(201).json(warehouse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// getWarehouses: any logged-in user can list all warehouses.
const getWarehouses = async (req, res) => {
  try {
    // Find every warehouse in the collection.
    const warehouses = await Warehouse.find();
    return res.status(200).json(warehouses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// getWarehouseById: any logged-in user can view one warehouse.
const getWarehouseById = async (req, res) => {
  try {
    // Make sure the id in the URL is a valid MongoDB id before querying.
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid warehouse id" });
    }

    // Look up the warehouse by id.
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    return res.status(200).json(warehouse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// updateWarehouse: manager replaces a warehouse's name/location.
const updateWarehouse = async (req, res) => {
  try {
    // Validate the id format first.
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid warehouse id" });
    }

    // Pull the fields we need out of the request body.
    const { name, location } = req.body;
    if (!name || !location) {
      return res.status(400).json({ message: "Name and location are required" });
    }

    // Replace the document's fields and return the updated version.
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      { name, location },
      { returnDocument: "after", runValidators: true }
    );

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    return res.status(200).json(warehouse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// deleteWarehouse: manager deletes a warehouse.
const deleteWarehouse = async (req, res) => {
  try {
    // Validate the id format first.
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid warehouse id" });
    }

    // Delete the warehouse by id.
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    return res.status(200).json({ message: "Warehouse deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Export all functions so routes/warehouseRoutes.js can use them.
module.exports = {
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
};
