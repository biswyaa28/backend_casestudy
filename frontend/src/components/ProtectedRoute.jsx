// Import Navigate to redirect when there is no logged-in user.
import { Navigate } from "react-router-dom";
// Import the Navbar, shown on every protected page.
import Navbar from "./Navbar.jsx";

// ProtectedRoute: wraps a page. If there is no token saved in
// localStorage, the user is not logged in, so we send them to /login.
// Otherwise we show the Navbar plus the actual page (children).
function ProtectedRoute({ children }) {
  // Read the token saved by the Login page.
  const token = localStorage.getItem("token");

  // No token means the user is not logged in.
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Logged in: show the navbar and the requested page.
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default ProtectedRoute;
