import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "1px solid #ddd",
        alignItems: "center",
      }}
    >
      <h3>CareerConnect</h3>

      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/dashboard">Home</Link>
        <Link to="/profile/me">Profile</Link>
        <Link to="/notifications">Notifications</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
