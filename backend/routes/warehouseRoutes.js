// Import express to create a router.
const express = require("express");
// Import our middleware.
const protect = require("../middleware/authMiddleware");
const isManager = require("../middleware/roleMiddleware");
// Import our controller functions.
const {
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
} = require("../controllers/warehouseController");

// Create a router for all /api/warehouses routes.
const router = express.Router();

// Every route below first needs a valid logged-in user (protect).

// POST /api/warehouses - only managers can create a warehouse.
router.post("/", protect, isManager, createWarehouse);

// GET /api/warehouses - any logged-in user can list warehouses.
router.get("/", protect, getWarehouses);

// GET /api/warehouses/:id - any logged-in user can view one warehouse.
router.get("/:id", protect, getWarehouseById);

// PUT /api/warehouses/:id - only managers can update a warehouse.
router.put("/:id", protect, isManager, updateWarehouse);

// DELETE /api/warehouses/:id - only managers can delete a warehouse.
router.delete("/:id", protect, isManager, deleteWarehouse);

// Export the router so server.js can mount it.
module.exports = router;
