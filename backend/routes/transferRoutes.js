// Import express to create a router.
const express = require("express");
// Import our middleware.
const protect = require("../middleware/authMiddleware");
const isManager = require("../middleware/roleMiddleware");
// Import our controller functions.
const {
  createTransfer,
  getTransfers,
  approveTransfer,
  rejectTransfer,
} = require("../controllers/transferController");

// Create a router for all /api/transfers routes.
const router = express.Router();

// POST /api/transfers - any logged-in user can request a transfer.
router.post("/", protect, createTransfer);

// GET /api/transfers - any logged-in user can list transfers.
router.get("/", protect, getTransfers);

// PATCH /api/transfers/:id/approve - only managers can approve.
router.patch("/:id/approve", protect, isManager, approveTransfer);

// PATCH /api/transfers/:id/reject - only managers can reject.
router.patch("/:id/reject", protect, isManager, rejectTransfer);

// Export the router so server.js can mount it.
module.exports = router;
