import { useParams } from "react-router-dom";
import api from "../api/api";
import { useEffect, useState } from "react";

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get(id === "me" ? "/users/me" : `/users/${id}`)
      .then((res) => setUser(res.data));
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.banner}></div>

      <div style={styles.card}>
        <h2>{user.name}</h2>
        <p>{user.headline || "Professional"}</p>
        <p>{user.location}</p>
        <p>Followers: {user.followers.length}</p>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  banner: {
    height: "150px",
    background: "#ddd",
    borderRadius: "8px",
  },
  card: {
    marginTop: "-40px",
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
};
