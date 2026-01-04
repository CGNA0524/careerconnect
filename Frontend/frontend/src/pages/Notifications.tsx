import { useEffect, useState } from "react";
import api from "../api/api";
import NotificationsList from "../components/NotificationsList";

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Please login again");
      } else {
        setError("Failed to load notifications");
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Notifications</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <NotificationsList notifications={notifications} />
    </div>
  );
}
