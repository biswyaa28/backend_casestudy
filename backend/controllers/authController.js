// Import bcryptjs to hash and compare passwords.
const bcrypt = require("bcryptjs");
// Import jsonwebtoken to create login tokens.
const jwt = require("jsonwebtoken");
// Import the User model to read/write users in MongoDB.
const User = require("../models/User");

// register: creates a new user account (staff or manager).
const register = async (req, res) => {
  try {
    // Pull the expected fields out of the request body.
    const { name, email, password, role } = req.body;

    // Check that name, email and password are all non-empty strings.
    if (
      typeof name !== "string" || name.trim() === "" ||
      typeof email !== "string" || email.trim() === "" ||
      typeof password !== "string" || password.trim() === ""
    ) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // Check if a user with this email already exists.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password with 10 salt rounds before saving it.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user. If role is missing, the schema default ("staff") is used.
    await User.create({ name, email, password: hashedPassword, role });

    // Respond with success. We never send the password back.
    return res.status(201).json({ message: "User registered" });
  } catch (error) {
    // Something unexpected went wrong.
    return res.status(500).json({ message: error.message });
  }
};

// login: checks email/password and returns a JWT token on success.
const login = async (req, res) => {
  try {
    // Pull email and password out of the request body.
    const { email, password } = req.body;

    // Check that both fields were sent as non-empty strings.
    if (
      typeof email !== "string" || email.trim() === "" ||
      typeof password !== "string" || password.trim() === ""
    ) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Look up the user by email.
    const user = await User.findOne({ email });
    if (!user) {
      // Do not reveal whether the email or the password was wrong.
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the given password with the stored hash.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create a JWT containing the user's id and role, valid for 1 day.
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send back the token plus some basic, non-sensitive user info.
    return res.status(200).json({ token, name: user.name, role: user.role });
  } catch (error) {
    // Something unexpected went wrong.
    return res.status(500).json({ message: error.message });
  }
};

// Export both functions so routes/authRoutes.js can use them.
module.exports = { register, login };
