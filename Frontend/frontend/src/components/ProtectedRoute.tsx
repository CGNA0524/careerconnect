import { Navigate } from "react-router-dom";
import React from "react";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  // ❌ Not logged in → redirect to Auth page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // ✅ Logged in
  return <>{children}</>;
}
