import { useEffect, useState } from "react";
import api from "../api/api";
import DashboardCards from "../components/DashboardCards";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const res = await api.get("/users/stats");
      setStats(res.data);
    } catch {
      setError("Failed to load stats");
    }
  };

  const fetchFeed = async () => {
  try {
    const res = await api.get("/posts");
    setPosts(res.data);
    setError("");
  } catch {
    setError("Failed to load feed");
  }
};


  useEffect(() => {
    fetchStats();
    fetchFeed();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {stats && <DashboardCards stats={stats} />}

      <hr style={{ margin: "30px 0" }} />

      <CreatePost onPostCreated={fetchFeed} />

      <h3>Global Feed</h3>

      {posts.length === 0 && <p>No posts yet</p>}

      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
