import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function ProtectedRoute(props: any) {
  const { user, loading } = useUser();

  // Wait for auth check
  if (loading) {
    return <p>Loading...</p>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in
  return props.children;
}
