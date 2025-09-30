"use client";

import useFavorites from "../hooks/useFavorites";

// Componente para exibir card de Pokémon com opção de favoritar
export default function PokemonCard({ pokemon, userEmail }) { 
  // Hook recebe o email para identificar qual usuário está favoritando
  const { addFavorite } = useFavorites(userEmail); 

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
      <h2 style={{ textTransform: "capitalize" }}>{pokemon.name}</h2>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <button
        onClick={() =>
          addFavorite({
            name: pokemon.name,
            image: pokemon.sprites.front_default,
          })
        }
      >
        Favoritar
      </button>
    </div>
  );
}