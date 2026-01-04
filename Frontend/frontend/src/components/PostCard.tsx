import { useState } from "react";
import api from "../api/api";

type Comment = {
  _id: string;
  text: string;
  author?: {
    _id: string;
    username: string;
  } | string;
  createdAt: string;
};

type Post = {
  _id: string;
  content: string;
  author?: {
    _id: string;
    username: string;
  } | string;
  likes?: string[];
  comments?: Comment[];
  createdAt: string;
};

export default function PostCard({ post }: { post: Post }) {
  const [likes, setLikes] = useState<string[]>(post.likes || []);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  const authorName =
    typeof post.author === "object" && post.author !== null
      ? post.author.username
      : "Unknown user";

  const isLiked = userId ? likes.includes(userId) : false;

  const handleLike = async () => {
    try {
      const res = await api.post(`/posts/${post._id}/like`);
      if (res.data?.likes) {
        setLikes(res.data.likes);
      }
    } catch {
      alert("Failed to like post");
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setLoading(true);
      const res = await api.post(`/posts/${post._id}/comment`, {
        text: commentText,
      });

      if (res.data?.comments) {
        setComments(res.data.comments);
      }

      setCommentText("");
    } catch {
      alert("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "20px",
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

      {/* Comments */}
      <div style={{ marginTop: "15px" }}>
        <strong>Comments</strong>

        {comments.length === 0 && (
          <p style={{ fontSize: "14px" }}>No comments yet</p>
        )}

        {comments.map((c) => {
          const commentAuthor =
            typeof c.author === "object" && c.author !== null
              ? c.author.username
              : "Unknown user";

          return (
            <div key={c._id} style={{ marginTop: "8px", fontSize: "14px" }}>
              <strong>{commentAuthor}:</strong> {c.text}
            </div>
          );
        })}

        <form onSubmit={handleComment} style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{ width: "100%", padding: "6px" }}
          />
          <button type="submit" disabled={loading} style={{ marginTop: "6px" }}>
            {loading ? "Posting..." : "Comment"}
          </button>
        </form>
      </div>

      <small style={{ display: "block", marginTop: "10px" }}>
        {new Date(post.createdAt).toLocaleString()}
      </small>
    </div>
  );
}
