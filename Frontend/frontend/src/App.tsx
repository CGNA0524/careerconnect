import { useEffect, useState } from "react";
import api from "./api/api";
import DashboardCards from "./components/DashboardCards";

function App() {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const res = await api.get("/users/stats");
      setStats(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else {
        setError("Failed to load stats.");
      }
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "serif" }}>
      <h1>CareerConnect Dashboard</h1>

      <button onClick={fetchStats}>Refresh Stats</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {stats && <DashboardCards stats={stats} />}
    </div>
  );
}

export default App;
