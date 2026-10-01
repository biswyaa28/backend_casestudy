// Import jsonwebtoken to verify tokens.
const jwt = require("jsonwebtoken");

// protect: checks that a valid JWT was sent with the request.
// If valid, it attaches the decoded payload to req.user.
const protect = (req, res, next) => {
  // Read the Authorization header, e.g. "Bearer abc123...".
  const authHeader = req.headers.authorization;

  // If there is no header, or it does not start with "Bearer ", reject it.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Pull out just the token part, after "Bearer ".
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using our secret. Throws an error if invalid/expired.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store the decoded payload ({ id, role }) on req.user for later routes.
    req.user = decoded;

    // Token is valid, let the request continue.
    next();
  } catch (error) {
    // Token was invalid or expired.
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Export the middleware so routes can use it.
module.exports = protect;
