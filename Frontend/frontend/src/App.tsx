import { useEffect, useState } from "react";
import api from "./api/api";
import DashboardCards from "./components/DashboardCards";
import Notifications from "./pages/Notifications";

function App() {
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
    <div style={{ padding: "20px", fontFamily: "serif" }}>
      <h1>CareerConnect</h1>

      <button onClick={fetchStats}>Refresh Stats</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {stats && <DashboardCards stats={stats} />}

      <hr style={{ margin: "30px 0" }} />

      <h2>Notifications</h2>
      <Notifications />
    </div>
  );
}

export default App;
