// Import mongoose to define our schema and model.
const mongoose = require("mongoose");

// userSchema: describes what fields a User document has.
const userSchema = new mongoose.Schema({
  // Full name of the user. Required.
  name: {
    type: String,
    required: true,
  },
  // Email is required and must be unique (no two users share one email).
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Password is stored as a bcrypt hash, never as plain text.
  password: {
    type: String,
    required: true,
  },
  // Role controls permissions. Only "staff" or "manager" are allowed.
  role: {
    type: String,
    enum: ["staff", "manager"],
    default: "staff",
  },
});

// Export the model so controllers can use User.find(), User.create(), etc.
module.exports = mongoose.model("User", userSchema);
