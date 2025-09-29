"use client";
import { useState, useEffect } from "react";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = ainda não sabe

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  return isAuthenticated;
}
