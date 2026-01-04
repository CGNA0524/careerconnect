type Post = {
  _id: string;
  content: string;
  author?: {
    _id: string;
    username: string;
  } | string;
  createdAt: string;
};

export default function PostCard({ post }: { post: Post }) {
  const authorName =
    typeof post.author === "object" && post.author !== null
      ? post.author.username
      : "Unknown user";

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

      <small>{new Date(post.createdAt).toLocaleString()}</small>
    </div>
  );
}
