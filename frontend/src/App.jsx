// Import routing components. We use these instead of useNavigate.
import { Routes, Route, Navigate } from "react-router-dom";
// Import our pages.
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TransferForm from "./pages/TransferForm.jsx";
import Approvals from "./pages/Approvals.jsx";
// Import the wrapper that blocks pages from users who are not logged in.
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// App: defines all the pages (routes) in our application.
function App() {
  return (
    <Routes>
      {/* /login is public, anyone can see it. */}
      <Route path="/login" element={<Login />} />

      {/* / just redirects straight to /dashboard. */}
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* The three real pages are wrapped in ProtectedRoute, which also
          shows the Navbar and checks that the user is logged in. */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transfer"
        element={
          <ProtectedRoute>
            <TransferForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/approvals"
        element={
          <ProtectedRoute>
            <Approvals />
          </ProtectedRoute>
        }
      />

      {/* Any other, unknown path also goes back to /dashboard. */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
