import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.log("No access token redirecting...");
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
