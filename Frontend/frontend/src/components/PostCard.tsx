import { useState } from "react";
import api from "../api/api";

type Post = {
  _id: string;
  content: string;
  author?: {
    _id: string;
    username: string;
  } | string;
  likes?: string[];
  createdAt: string;
};

export default function PostCard({ post }: { post: Post }) {
  const initialLikes = post.likes || [];

  const [likes, setLikes] = useState<string[]>(initialLikes);
  const userId = localStorage.getItem("userId"); // optional (safe fallback)

  const authorName =
    typeof post.author === "object" && post.author !== null
      ? post.author.username
      : "Unknown user";

  const isLiked = userId ? likes.includes(userId) : false;

  const handleLike = async () => {
    try {
      const res = await api.post(`/posts/${post._id}/like`);
      // backend toggles like; refetch likes from response if available
      if (res.data?.likes) {
        setLikes(res.data.likes);
      } else {
        // fallback: optimistic toggle
        setLikes((prev) =>
          isLiked ? prev.filter((id) => id !== userId) : [...prev, userId!]
        );
      }
    } catch {
      alert("Failed to like post");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "15px",
      }}
    >
      <strong>{authorName}</strong>

      <p style={{ marginTop: "8px" }}>{post.content}</p>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <button onClick={handleLike}>
          {isLiked ? "❤️ Unlike" : "🤍 Like"}
        </button>
        <span>{likes.length} likes</span>
      </div>

      <small style={{ display: "block", marginTop: "6px" }}>
        {new Date(post.createdAt).toLocaleString()}
      </small>
    </div>
  );
}
