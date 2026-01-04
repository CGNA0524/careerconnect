type Notification = {
  _id: string;
  message: string;
  createdAt: string;
};

export default function NotificationsList({
  notifications,
}: {
  notifications: Notification[];
}) {
  if (notifications.length === 0) {
    return <p>No notifications yet</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {notifications.map((n) => (
        <li
          key={n._id}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          <p>{n.message}</p>
          <small>{new Date(n.createdAt).toLocaleString()}</small>
        </li>
      ))}
    </ul>
  );
}
