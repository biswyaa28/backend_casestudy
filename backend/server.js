// Load variables from our .env file into process.env.
require("dotenv").config();

// Import express to build our web server.
const express = require("express");
// Import cors to allow our frontend (a different origin) to call this API.
const cors = require("cors");
// Import our database connection function.
const connectDB = require("./config/db");

// Import all of our route files.
const authRoutes = require("./routes/authRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");
const productRoutes = require("./routes/productRoutes");
const transferRoutes = require("./routes/transferRoutes");

// Create the express application.
const app = express();

// Only allow requests from our own frontend's URL (set in .env),
// instead of allowing every website to call this API.
app.use(cors({ origin: process.env.FRONTEND_URL }));

// Let express read JSON request bodies into req.body.
app.use(express.json());

// GET / - simple route to check that the server is running.
app.get("/", (req, res) => {
  res.send("Warehouse Stock Transfer API is running");
});

// Mount each route file under its own base path.
app.use("/api/auth", authRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/products", productRoutes);
app.use("/api/transfers", transferRoutes);

// Read the port from .env, or default to 5001.
const PORT = process.env.PORT || 5001;

// Start listening for requests, then connect to the database.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
