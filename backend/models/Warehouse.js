// Import mongoose to define our schema and model.
const mongoose = require("mongoose");

// warehouseSchema: a warehouse just needs a name and a location.
const warehouseSchema = new mongoose.Schema({
  // Name of the warehouse. Required.
  name: {
    type: String,
    required: true,
  },
  // Location/address of the warehouse. Required.
  location: {
    type: String,
    required: true,
  },
});

// Export the model.
module.exports = mongoose.model("Warehouse", warehouseSchema);
