// Import useState to hold form field values.
import { useState } from "react";
// Import Navigate to redirect after a successful login.
import { Navigate } from "react-router-dom";
// Import our configured axios instance.
import api from "../api.js";

// Login: a simple email/password form that logs the user in.
function Login() {
  // Form field values.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Error message to show on failed login.
  const [error, setError] = useState("");
  // Becomes true once login succeeds, triggering a redirect.
  const [loggedIn, setLoggedIn] = useState(false);

  // handleSubmit: runs when the form is submitted.
  const handleSubmit = async (event) => {
    // Stop the browser from reloading the page on form submit.
    event.preventDefault();
    // Clear any old error before trying again.
    setError("");

    try {
      // Call the login endpoint with the entered credentials.
      const response = await api.post("/auth/login", { email, password });

      // The backend returns { token, name, role } on success.
      const { token, name, role } = response.data;

      // Save all three in localStorage so other pages can use them.
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
      localStorage.setItem("role", role);

      // Mark login as successful, which triggers the redirect below.
      setLoggedIn(true);
    } catch (err) {
      // Show the backend's error message (e.g. "Invalid email or password").
      setError(err.response.data.message);
    }
  };

  // Once logged in, redirect to the dashboard.
  if (loggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {/* Show the error message in red, only if one exists. */}
        {error && <p className="error-message">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
