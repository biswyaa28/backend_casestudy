// Import mongoose so we can check if an id is a valid ObjectId.
const mongoose = require("mongoose");
// Import the models we need.
const TransferRequest = require("../models/TransferRequest");
const Product = require("../models/Product");

// createTransfer: any logged-in user can request a stock transfer.
// We do NOT check current stock here, so staff can still request
// a transfer even if the source warehouse is low on stock.
const createTransfer = async (req, res) => {
  try {
    // Pull the fields we need out of the request body.
    const { product, fromWarehouse, toWarehouse, quantity } = req.body;

    // All four fields are required.
    if (!product || !fromWarehouse || !toWarehouse || !quantity) {
      return res.status(400).json({
        message: "product, fromWarehouse, toWarehouse and quantity are required",
      });
    }

    // Quantity must be a positive number.
    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    // Source and destination warehouse must be different.
    if (fromWarehouse === toWarehouse) {
      return res.status(400).json({ message: "From and to warehouse must be different" });
    }

    // Create the transfer request. It starts as "pending" and records
    // who asked for it.
    const transfer = await TransferRequest.create({
      product,
      fromWarehouse,
      toWarehouse,
      quantity,
      status: "pending",
      requestedBy: req.user.id,
    });

    return res.status(201).json(transfer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// getTransfers: list all transfers, optionally filtered by status.
const getTransfers = async (req, res) => {
  try {
    // Build a filter object. If ?status=... was sent, filter by it.
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Find transfers matching the filter, with related data filled in.
    // requestedBy/approvedBy only select "name email role" so the
    // password hash is never sent back.
    const transfers = await TransferRequest.find(filter)
      .populate("product")
      .populate("fromWarehouse")
      .populate("toWarehouse")
      .populate("requestedBy", "name email role");

    return res.status(200).json(transfers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// approveTransfer: manager approves a pending transfer and moves the stock.
const approveTransfer = async (req, res) => {
  try {
    // Validate the id format first.
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid transfer id" });
    }

    // Step a: find the transfer and make sure it is still pending.
    const transfer = await TransferRequest.findById(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }
    if (transfer.status !== "pending") {
      return res.status(400).json({ message: "Transfer is not pending" });
    }

    // Step b: find the product, then find the stock entry for the
    // source (fromWarehouse) inside its stock array.
    const product = await Product.findById(transfer.product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const fromEntry = product.stock.find(
      (entry) => entry.warehouse.toString() === transfer.fromWarehouse.toString()
    );

    // Step c: if there is no stock entry for the source, or it does not
    // have enough quantity, reject the transfer instead of approving it.
    if (!fromEntry || fromEntry.quantity < transfer.quantity) {
      transfer.status = "rejected";
      await transfer.save();
      return res.status(400).json({ message: "Insufficient stock, transfer rejected" });
    }

    // Step d: move the stock. Subtract from the source entry, then add
    // to the destination entry (creating it if it does not exist yet).
    fromEntry.quantity = fromEntry.quantity - transfer.quantity;
    const toEntry = product.stock.find(
      (entry) => entry.warehouse.toString() === transfer.toWarehouse.toString()
    );
    if (toEntry) {
      toEntry.quantity = toEntry.quantity + transfer.quantity;
    } else {
      product.stock.push({ warehouse: transfer.toWarehouse, quantity: transfer.quantity });
    }
    await product.save();

    // Step e: mark the transfer as approved and record who approved it.
    transfer.status = "approved";
    transfer.approvedBy = req.user.id;
    await transfer.save();

    return res.status(200).json(transfer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// rejectTransfer: manager rejects a pending transfer, no stock is moved.
const rejectTransfer = async (req, res) => {
  try {
    // Validate the id format first.
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid transfer id" });
    }

    // Find the transfer and make sure it is still pending.
    const transfer = await TransferRequest.findById(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }
    if (transfer.status !== "pending") {
      return res.status(400).json({ message: "Transfer is not pending" });
    }

    // Mark it rejected and record who rejected it.
    transfer.status = "rejected";
    transfer.approvedBy = req.user.id;
    await transfer.save();

    return res.status(200).json(transfer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Export all functions so routes/transferRoutes.js can use them.
module.exports = {
  createTransfer,
  getTransfers,
  approveTransfer,
  rejectTransfer,
};
