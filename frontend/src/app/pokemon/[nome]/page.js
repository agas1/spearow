"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useFavorites from "../../hooks/useFavorites";

export default function PokemonDetails() {
  const { nome } = useParams();
  const [userEmail, setUserEmail] = useState(null);

  // Pega o email do usuário do localStorage ao carregar a página
  useEffect(() => {
    setUserEmail(localStorage.getItem("userEmail"));
  }, []);

  // Agora o hook recebe o email
  const { addFavorite, favorites, loading } = useFavorites(userEmail);

  const [pokemon, setPokemon] = useState(null);
  const [pokemonLoading, setPokemonLoading] = useState(true);
  
  // Use o nome do Pokémon para verificar se ele já está nos favoritos
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
        const data = await res.json();
        setPokemon(data);
        // Verifica se o Pokémon já está nos favoritos após o carregamento
        setIsFavorited(favorites.some(fav => fav.name === data.name));
      } catch (error) {
        console.error("Erro ao carregar Pokémon:", error);
      } finally {
        setPokemonLoading(false);
      }
    };
    if (nome) {
      fetchPokemon();
    }
  }, [nome, favorites]);

  if (pokemonLoading || loading) return <p className="text-center text-xl font-semibold mt-10">Carregando...</p>;
  if (!pokemon) return <p className="text-center text-xl font-semibold mt-10 text-red-500">Erro ao carregar Pokémon.</p>;

  const handleFavorite = () => {
    addFavorite({
      name: pokemon.name,
      image:
        pokemon.sprites.other?.["official-artwork"]?.front_default ||
        pokemon.sprites.front_default ||
        "/placeholder.png",
    });
    // Atualiza o estado para refletir a mudança
    setIsFavorited(true);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 capitalize mb-4">
          {pokemon.name}
        </h1>
        <img
          src={
            pokemon.sprites.other?.["official-artwork"]?.front_default ||
            pokemon.sprites.front_default
          }
          alt={pokemon.name}
          className="mx-auto w-64 h-64 sm:w-80 sm:h-80 object-contain mb-6"
        />

        <button
          onClick={handleFavorite}
          disabled={isFavorited}
          className={`
            mb-6 px-6 py-2 rounded-full font-semibold transition-all duration-300
            ${isFavorited 
              ? "bg-yellow-400 text-gray-800 cursor-not-allowed" 
              : "bg-blue-600 text-white hover:bg-blue-700"}
          `}
        >
          {isFavorited ? "⭐ Já está nos Favoritos" : "⭐ Adicionar aos Favoritos"}
        </button>

        <div className="mt-6 text-left">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Detalhes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p className="text-lg">
              <strong className="font-medium">ID:</strong> {pokemon.id}
            </p>
            <p className="text-lg">
              <strong className="font-medium">Altura:</strong> {pokemon.height / 10} m
            </p>
            <p className="text-lg">
              <strong className="font-medium">Peso:</strong> {pokemon.weight / 10} kg
            </p>
            <p className="text-lg">
              <strong className="font-medium">Tipo(s):</strong>{" "}
              <span className="capitalize">
                {pokemon.types.map((t) => t.type.name).join(", ")}
              </span>
            </p>
          </div>
          <p className="text-lg mt-4">
            <strong className="font-medium">Habilidades:</strong>{" "}
            <span className="capitalize">
              {pokemon.abilities.map((a) => a.ability.name).join(", ")}
            </span>
          </p>
        </div>

        <div className="mt-6 text-left">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Movimentos</h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm text-gray-600 max-h-48 overflow-y-auto custom-scrollbar">
            {pokemon.moves.map((move) => (
              <li key={move.move.name} className="bg-gray-200 py-1 px-3 rounded-md text-center capitalize">
                {move.move.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}