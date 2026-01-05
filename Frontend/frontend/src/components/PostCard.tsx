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
    setLikes(res.data.likes);
  };

  const submitComment = async (e: any) => {
    e.preventDefault();
    const res = await api.post(`/posts/${post._id}/comment`, { text });
    setComments(res.data.comments);
    setText("");
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 15, marginBottom: 20 }}>
      <strong>{post.author.name}</strong>
      <p>{post.content}</p>

      <button onClick={toggleLike}>
        {isLiked ? "❤️ Liked" : "🤍 Like"} ({likes.length})
      </button>

      <div style={{ marginTop: 10 }}>
        {comments.map((c: any) => (
          <p key={c._id}>
            <strong>{c.user.name}:</strong> {c.text}
          </p>
        ))}
      </div>

      <form onSubmit={submitComment}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment"
        />
        <button>Comment</button>
      </form>
    </div>
  );
}
