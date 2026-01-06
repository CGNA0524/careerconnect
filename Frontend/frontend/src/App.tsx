import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";

/* ---------------- TOP BAR ---------------- */
function TopBar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
      <h1>CareerConnect</h1>

      {isLoggedIn && (
        <button onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
}

/* ---------------- LAYOUT ---------------- */
function AppLayout() {
  return (
    <div style={{ fontFamily: "serif", padding: "20px" }}>
      <TopBar />

      <Routes>
        {/* Auth (default page) */}
        <Route path="/" element={<Auth />} />

        {/* Protected pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

/* ---------------- ROOT ---------------- */
export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
