// Import express to create a router.
const express = require("express");
// Import our middleware.
const protect = require("../middleware/authMiddleware");
const isManager = require("../middleware/roleMiddleware");
// Import our controller functions.
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Create a router for all /api/products routes.
const router = express.Router();

// POST /api/products - only managers can create a product.
router.post("/", protect, isManager, createProduct);

// GET /api/products - any logged-in user can list products.
router.get("/", protect, getProducts);

// GET /api/products/:id - any logged-in user can view one product.
router.get("/:id", protect, getProductById);

// PUT /api/products/:id - only managers can update a product.
router.put("/:id", protect, isManager, updateProduct);

// DELETE /api/products/:id - only managers can delete a product.
router.delete("/:id", protect, isManager, deleteProduct);

// Export the router so server.js can mount it.
module.exports = router;
