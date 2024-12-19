import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/login" />; // Redirect to login if no token
  }

  return children; // If token exists, render the children (dashboard)
}

export default ProtectedRoute;
