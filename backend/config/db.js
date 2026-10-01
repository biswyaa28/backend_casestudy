// Import mongoose so we can connect to MongoDB.
const mongoose = require("mongoose");

// connectDB: connects to MongoDB using the URI from our .env file.
const connectDB = async () => {
  try {
    // Try to connect using the connection string stored in MONGO_URI.
    await mongoose.connect(process.env.MONGO_URI);
    // If we reach this line, the connection worked.
    console.log("MongoDB connected");
  } catch (error) {
    // Something went wrong. Log only the error message, never the URI,
    // and do not crash the server.
    console.log(error.message);
  }
};

// Export the function so server.js can call it.
module.exports = connectDB;
