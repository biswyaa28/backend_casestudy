// Import Link for page navigation without reloading the page.
import { Link } from "react-router-dom";

// Navbar: shown on every protected page. Shows navigation links,
// the logged-in user's name/role, and a logout button.
function Navbar() {
  // Read the name and role we saved in localStorage after login.
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  // handleLogout: clears all saved login info and sends the user
  // back to the login page with a full page reload.
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/transfer">Transfer Request</Link>
        <Link to="/approvals">Approvals</Link>
      </div>
      <div className="navbar-user">
        <span>
          {name} ({role})
        </span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
