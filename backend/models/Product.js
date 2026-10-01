// Import mongoose to define our schema and model.
const mongoose = require("mongoose");

// productSchema: a product has a name, a unique sku, and a stock list.
const productSchema = new mongoose.Schema({
  // Name of the product. Required.
  name: {
    type: String,
    required: true,
  },
  // SKU (stock keeping unit) is a unique code for this product.
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  // stock: one entry per warehouse that holds this product, with a quantity.
  stock: [
    {
      // Reference to the Warehouse this quantity belongs to.
      warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse",
      },
      // How many units of this product are in that warehouse.
      quantity: {
        type: Number,
        min: 0,
      },
    },
  ],
});

// Export the model.
module.exports = mongoose.model("Product", productSchema);
