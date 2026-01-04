type StatsProps = {
  posts: number;
  likes: number;
  comments: number;
  followers: number;
  following: number;
  interviews: number;
  averageScore: number;
};

export default function DashboardCards({ stats }: { stats: StatsProps }) {
  const cardStyle = {
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "8px",
    width: "180px",
    textAlign: "center" as const,
  };

  return (
    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
      <div style={cardStyle}><h3>Posts</h3><p>{stats.posts}</p></div>
      <div style={cardStyle}><h3>Likes</h3><p>{stats.likes}</p></div>
      <div style={cardStyle}><h3>Comments</h3><p>{stats.comments}</p></div>
      <div style={cardStyle}><h3>Followers</h3><p>{stats.followers}</p></div>
      <div style={cardStyle}><h3>Following</h3><p>{stats.following}</p></div>
      <div style={cardStyle}><h3>Interviews</h3><p>{stats.interviews}</p></div>
      <div style={cardStyle}><h3>Avg Score</h3><p>{stats.averageScore}</p></div>
    </div>
  );
}
