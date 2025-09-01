import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/auth/dashboard"); // Verify user authentication
        if (response.data.data.user) {
          setIsAuthenticated(true);
          localStorage.setItem("userRole", response.data.data.user.role); // Store role in localStorage
        }
      } catch (error) {
        console.error("Authorization check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;