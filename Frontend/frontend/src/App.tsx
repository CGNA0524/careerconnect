import { useEffect, useState } from "react";
import api from "./api/api";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const login = async () => {
    try {
      const res = await api.post("/auth/login", {
        email: "chiragnagra256@gmail.com",
        password: "Chirag@05245",
      });

      localStorage.setItem("token", res.data.token);
      setLoggedIn(true);

      console.log("✅ Login successful");
    } catch (err) {
      console.error("❌ Login failed", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/users/stats");
      setStats(res.data);
      console.log("✅ Stats loaded", res.data);
    } catch (err: any) {
      console.error(
        "❌ Stats error",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
      fetchStats();
    }
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>CareerConnect Frontend</h1>

      {!loggedIn ? (
        <button onClick={login}>Login</button>
      ) : (
        <>
          <button onClick={fetchStats}>Fetch Stats</button>

          {stats && (
            <pre style={{ marginTop: "1rem" }}>
              {JSON.stringify(stats, null, 2)}
            </pre>
          )}
        </>
      )}
    </div>
  );
}

export default App;
