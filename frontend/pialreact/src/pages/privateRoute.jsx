// Typical implementation of a PrivateRoute component
// This is what your implementation likely looks like

import React from "react";
import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../token";

const PrivateRoute = ({ children }) => {
  // Check if user is authenticated (token exists)
  const isAuthenticated = localStorage.getItem(ACCESS_TOKEN) !== null;

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the protected component
  return children;
};

export default PrivateRoute;
