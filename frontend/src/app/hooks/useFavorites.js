"use client";
import { useState, useEffect } from "react";

// O hook  aceita o e-mail do usuário como parâmetro
export default function useFavorites(userEmail) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar os favoritos do servidor quando o componente for montado ou o e-mail mudar
  useEffect(() => {
    // Se não houver e-mail de usuário, não há favoritos para carregar rs
    if (!userEmail) {
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        // Busca o usuário pelo e-mail
        const res = await fetch(`http://localhost:4000/users?email=${userEmail}`);
        const user = await res.json();
        
        // A resposta da  API é o objeto do usuário, não uma lista.
        if (user && user.favorites) {
          // Define os favoritos com base no que foi retornado da API
          setFavorites(user.favorites);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userEmail]);

  const saveFavorites = async (updatedFavorites) => {
    if (!userEmail) return;

    try {
      const patchRes = await fetch(`http://localhost:4000/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail, newFavorites: updatedFavorites }),
      });

      if (!patchRes.ok) {
        throw new Error("Erro ao salvar favoritos no servidor.");
      }
    } catch (error) {
      console.error("Erro ao salvar favoritos:", error);
    }
  };

  const addFavorite = (pokemon) => {
    
    if (favorites.some((p) => p.name === pokemon.name)) {
      return;
    }

    const updated = [...favorites, pokemon];
    setFavorites(updated);
    saveFavorites(updated); 
  };

  const removeFavorite = (pokemonName) => {
    const updated = favorites.filter((p) => p.name !== pokemonName);
    setFavorites(updated);
    saveFavorites(updated); 
  };

  return { favorites, addFavorite, removeFavorite, loading };
}