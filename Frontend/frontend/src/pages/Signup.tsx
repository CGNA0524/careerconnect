import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err: any) {
      setError("Signup failed. Try a different email.");
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={logoStyle}>CareerConnect</h1>
      <h2>Join CareerConnect</h2>

      <button style={oauthBtn} disabled>
        Continue with Google (coming soon)
      </button>

      <button style={oauthBtn} disabled>
        Continue with Microsoft (coming soon)
      </button>

      <div style={divider}>or</div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSignup}>
        <input
          style={inputStyle}
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={inputStyle}
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={primaryBtn} type="submit">
          Join now
        </button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Already on CareerConnect?{" "}
        <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}

/* Same styles as Login */
const containerStyle = {
  maxWidth: "420px",
  margin: "80px auto",
  padding: "30px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  textAlign: "center" as const,
};

const logoStyle = {
  marginBottom: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
};

const primaryBtn = {
  width: "100%",
  padding: "10px",
  fontWeight: "bold",
};

const oauthBtn = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  opacity: 0.6,
};

const divider = {
  margin: "15px 0",
  color: "#666",
};
