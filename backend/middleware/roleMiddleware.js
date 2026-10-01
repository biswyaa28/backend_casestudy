// isManager: only allows the request to continue if the logged-in
// user's role is "manager". Must run after the "protect" middleware,
// since it needs req.user to already be set.
const isManager = (req, res, next) => {
  // Check the role stored on req.user by the protect middleware.
  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Only managers can do this" });
  }

  // User is a manager, let the request continue.
  next();
};

// Export the middleware so routes can use it.
module.exports = isManager;
