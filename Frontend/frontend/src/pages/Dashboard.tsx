import { useState } from "react";
import api from "../api/api";

type CreatePostProps = {
  onPost?: () => void;
};

export default function CreatePost({ onPost }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const submitPost = async () => {
    if (!content.trim()) return;

    const formData = new FormData();
    formData.append("content", content);

    if (file) {
      formData.append("media", file);
    }

    await api.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setContent("");
    setFile(null);

    // 🔥 notify parent (Dashboard)
    if (onPost) onPost();
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "20px" }}>
      <textarea
        placeholder="Write a post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "100%", minHeight: "80px" }}
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        style={{ marginTop: "10px" }}
      />

      <button onClick={submitPost} style={{ marginTop: "10px" }}>
        Post
      </button>
    </div>
  );
}
