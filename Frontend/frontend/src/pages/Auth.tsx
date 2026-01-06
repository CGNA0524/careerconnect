import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Auth() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");

      const url = isSignup ? "/auth/register" : "/auth/login";

      const payload = isSignup
        ? { name, email, password }
        : { email, password };

      const res = await api.post(url, payload);

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div style={{ maxWidth: "420px", margin: "60px auto", textAlign: "center" }}>
      <h2>CareerConnect</h2>
      <h3>{isSignup ? "Sign up" : "Login"}</h3>

      {/* OAuth placeholders */}
      <button disabled style={{ width: "100%", marginBottom: "8px" }}>
        Continue with Google (coming soon)
      </button>
      <button disabled style={{ width: "100%", marginBottom: "16px" }}>
        Continue with Microsoft (coming soon)
      </button>

      <hr />

      {isSignup && (
        <input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", marginBottom: "8px" }}
        />
      )}

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: "8px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "12px" }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleSubmit} style={{ width: "100%" }}>
        {isSignup ? "Sign up" : "Login"}
      </button>

      <p style={{ marginTop: "12px" }}>
        {isSignup ? (
          <>
            Already have an account?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => setIsSignup(false)}
            >
              Login
            </span>
          </>
        ) : (
          <>
            New to CareerConnect?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => setIsSignup(true)}
            >
              Join now
            </span>
          </>
        )}
      </p>
    </div>
  );
}
