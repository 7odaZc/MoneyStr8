import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthed, hasRole } = useAuth();
  const location = useLocation();

  // not logged in → go to login
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // logged in but wrong role → back to dashboard
  if (roles && !hasRole(roles)) {
    return <Navigate to="/dashboard" replace state={{ unauthorized: true }} />;
  }

  return children;
}
