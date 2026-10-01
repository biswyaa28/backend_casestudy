// Import mongoose to define our schema and model.
const mongoose = require("mongoose");

// transferRequestSchema: one request to move stock of a product
// from one warehouse to another.
const transferRequestSchema = new mongoose.Schema(
  {
    // Which product is being transferred.
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    // The warehouse the stock is coming from.
    fromWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
    },
    // The warehouse the stock is going to.
    toWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
    },
    // How many units to transfer. Must be at least 1.
    quantity: {
      type: Number,
      min: 1,
    },
    // Current status of this request.
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // The user (staff or manager) who created this request.
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // The manager who approved or rejected this request (if any).
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  // timestamps: true adds createdAt and updatedAt fields automatically.
  { timestamps: true }
);

// Export the model.
module.exports = mongoose.model("TransferRequest", transferRequestSchema);
