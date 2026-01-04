// Frontend/src/pages/Dashboard.tsx

import { useEffect, useState } from "react";
import api from "../api/api";
import DashboardCards from "../components/DashboardCards";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const res = await api.get("/users/stats");
      setStats(res.data);
      setError("");
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
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      <button onClick={fetchStats}>Refresh Stats</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {stats && <DashboardCards stats={stats} />}
    </div>
  );
}
