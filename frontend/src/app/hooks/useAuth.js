"use client";
import { useState, useEffect } from "react";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const logged = localStorage.getItem("isLoggedIn") === "true";

    if (!logged || !email) {
      setIsAuthenticated(false);
      return;
    }

    // Verifica no backend se o usuário existe
    fetch(`http://localhost:4000/users?email=${email}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Usuário não encontrado");
      })
      .then(data => setIsAuthenticated(!!data))
      .catch(() => setIsAuthenticated(false));
  }, []);

  return isAuthenticated;
}
