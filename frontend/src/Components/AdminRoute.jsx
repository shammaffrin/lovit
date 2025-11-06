import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin → redirect to home
  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, allow access
  return children;
};

export default AdminRoute;
