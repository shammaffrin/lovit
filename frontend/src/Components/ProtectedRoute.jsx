import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in → send to login
  if (!token) return <Navigate to="/login" replace />;

  // If admin tries to access user routes → send to /admin
  if (user?.isAdmin) return <Navigate to="/admin" replace />;

  // Otherwise, allow normal user
  return children;
};

export default ProtectedRoute;
