// Import mongoose so we can check if an id is a valid ObjectId.
const mongoose = require("mongoose");
// Import the Product model.
const Product = require("../models/Product");

// createProduct: manager creates a new product, with an optional starting stock list.
const createProduct = async (req, res) => {
  try {
    // Pull the fields we need out of the request body.
    const { name, sku, stock } = req.body;

    // Name and sku are required.
    if (!name || !sku) {
      return res.status(400).json({ message: "Name and sku are required" });
    }

    // If stock was sent, it must be an array (list) of entries.
    if (stock !== undefined && !Array.isArray(stock)) {
      return res.status(400).json({ message: "Stock must be an array" });
    }

    // Create and save the new product. If stock was not sent, it defaults to [].
    const product = await Product.create({ name, sku, stock: stock || [] });

    return res.status(201).json(product);
  } catch (error) {
    // Mongo's duplicate key error code is 11000.
    if (error.code === 11000) {
      return res.status(400).json({ message: "SKU already exists" });
    }
    // Mongoose schema validation errors (e.g. a negative quantity) are
    // the user's fault, so they are a 400, not a 500.
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

// getProducts: any logged-in user can list all products, with warehouse
// names/locations filled in for each stock entry.
const getProducts = async (req, res) => {
  try {
    // find() all products, then populate each stock entry's warehouse
    // field with just its name and location.
    const products = await Product.find().populate("stock.warehouse", "name location");
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// getProductById: any logged-in user can view one product.
const getProductById = async (req, res) => {
  try {
    // Validate the id format first.
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    // Look up the product and fill in its warehouse details.
    const product = await Product.findById(req.params.id).populate(
      "stock.warehouse",
      "name location"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// updateProduct: manager replaces a product's name/sku/stock.
const updateProduct = async (req, res) => {
  try {
    // Validate the id format first.
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    // Pull the fields we need out of the request body.
    const { name, sku, stock } = req.body;
    if (!name || !sku) {
      return res.status(400).json({ message: "Name and sku are required" });
    }
    if (stock !== undefined && !Array.isArray(stock)) {
      return res.status(400).json({ message: "Stock must be an array" });
    }

    // Replace the document's fields and return the updated version.
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, sku, stock: stock || [] },
      { returnDocument: "after", runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "SKU already exists" });
    }
    // Mongoose schema validation errors (e.g. a negative quantity) are
    // the user's fault, so they are a 400, not a 500.
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

// deleteProduct: manager deletes a product.
const deleteProduct = async (req, res) => {
  try {
    // Validate the id format first.
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    // Delete the product by id.
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Export all functions so routes/productRoutes.js can use them.
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
