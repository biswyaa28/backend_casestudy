// Import express to create a router.
const express = require("express");
// Import our controller functions.
const { register, login } = require("../controllers/authController");

// Create a router for all /api/auth routes.
const router = express.Router();

// POST /api/auth/register - public route, anyone can create an account.
router.post("/register", register);

// POST /api/auth/login - public route, anyone can try to log in.
router.post("/login", login);

// Export the router so server.js can mount it.
module.exports = router;
