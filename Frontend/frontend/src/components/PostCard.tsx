import { useState } from "react";
import api from "../api/api";
import { useUser } from "../context/UserContext";

export default function PostCard({ post }: any) {
  const { user } = useUser();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [text, setText] = useState("");

  const isLiked = user && likes.includes(user._id);

  const toggleLike = async () => {
    const res = await api.post(`/posts/${post._id}/like`);
    setLikes(
      isLiked
        ? likes.filter((id: string) => id !== user._id)
        : [...likes, user._id]
    );
  };

  const submitComment = async (e: any) => {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await api.post(`/posts/${post._id}/comment`, { text });
    setComments(res.data.comments);
    setText("");
  };

  const mediaUrl = post.media
    ? `http://localhost:3000${post.media}`
    : null;

  return (
    <div style={{ border: "1px solid #ddd", padding: 15, marginBottom: 20 }}>
      <strong>{post.author.name}</strong>
      <p>{post.content}</p>

      {/* ✅ MEDIA RENDERING */}
      {mediaUrl &&
        (post.media.endsWith(".mp4") ? (
          <video controls width="100%" style={{ marginTop: 10 }}>
            <source src={mediaUrl} />
          </video>
        ) : (
          <img
            src={mediaUrl}
            alt="post media"
            width="100%"
            style={{ marginTop: 10 }}
          />
        ))}

      <button onClick={toggleLike} style={{ marginTop: 10 }}>
        {isLiked ? "❤️ Liked" : "🤍 Like"} ({likes.length})
      </button>

      <div style={{ marginTop: 10 }}>
        {comments.map((c: any) => (
          <p key={c._id}>
            <strong>{c.user.name}:</strong> {c.text}
          </p>
        ))}
      </div>

      <form onSubmit={submitComment} style={{ marginTop: 10 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment"
        />
        <button type="submit">Comment</button>
      </form>
    </div>
  );
}
