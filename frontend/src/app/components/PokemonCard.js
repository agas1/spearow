"use client";
// Importamos o useEffect e useState para pegar o email, mas o ideal é receber via prop
import useFavorites from "../hooks/useFavorites";

// AGORA RECEBE O userEmail COMO PROP
export default function PokemonCard({ pokemon, userEmail }) { 
  // O hook agora recebe o email para saber onde salvar!
  // Se userEmail for null/undefined, o hook não fará nada.
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