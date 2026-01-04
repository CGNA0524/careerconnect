import { useState } from "react";
import api from "../api/api";

type CreatePostProps = {
  onPostCreated: () => void;
};

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Post content cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/posts", { content });

      setContent("");
      onPostCreated();
    } catch (err) {
      setError("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "20px",
      }}
    >
      <textarea
        placeholder="Write a post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        style={{ width: "100%", padding: "10px" }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading} style={{ marginTop: "10px" }}>
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
