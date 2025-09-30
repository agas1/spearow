"use client";
import useFavorites from "../hooks/useFavorites";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const typeColors = {
  fire: 'bg-red-600 shadow-red-600/50',
  water: 'bg-blue-600 shadow-blue-600/50',
  grass: 'bg-green-600 shadow-green-600/50',
  electric: 'bg-yellow-500 shadow-yellow-500/50',
  poison: 'bg-purple-600 shadow-purple-600/50',
  normal: 'bg-gray-500 shadow-gray-500/50',
  bug: 'bg-lime-600 shadow-lime-600/50',
  flying: 'bg-indigo-400 shadow-indigo-400/50',
  ground: 'bg-amber-700 shadow-amber-700/50',
  rock: 'bg-stone-600 shadow-stone-600/50',
  ghost: 'bg-indigo-600 shadow-indigo-600/50',
  steel: 'bg-slate-500 shadow-slate-500/50',
  psychic: 'bg-pink-500 shadow-pink-500/50',
  ice: 'bg-cyan-400 shadow-cyan-400/50',
  dragon: 'bg-violet-600 shadow-violet-600/50',
  dark: 'bg-gray-800 shadow-gray-800/50',
  fairy: 'bg-pink-300 shadow-pink-300/50',
  fighting: 'bg-orange-700 shadow-orange-700/50'
};

const getTypeClass = (type) => typeColors[type] || 'bg-gray-700 shadow-gray-700/50';

export default function FavoritesPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  const [pokemonDetails, setPokemonDetails] = useState({});

  // 1. Pega o email do usuário do localStorage ao carregar a página
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn || !email) {
      router.push("/login");
      return;
    }
    setUserEmail(email);
  }, [router]);
  
  const { favorites, removeFavorite, loading } = useFavorites(userEmail);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (favorites.length > 0) {
        const details = {};
        
        for (const pokemon of favorites) {
          try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
            if (res.ok) {
              const data = await res.json();
              details[pokemon.name] = data;
            }
          } catch (error) {
            console.error(`Erro ao buscar detalhes de ${pokemon.name}:`, error);
          }
        }
        
        setPokemonDetails(details);
      }
    };

    fetchPokemonDetails();
  }, [favorites]);

  // Exibe o carregamento enquanto espera o email e os favoritos
  if (loading || userEmail === null) {
    return (
      <div 
        className="flex justify-center items-center min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/fundoHome.jpg')" }}
      >
        <img
          src="/play.png"
          alt="Carregando..."
          className="h-20 w-20 animate-spin"
        />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed p-6"
      style={{ backgroundImage: "url('/fundoHome.jpg')" }}
    >
      <div className="container mx-auto">
        {/* Header - Posições invertidas */}
        <div className="flex justify-between items-center mb-8">
          {/* Botão Voltar na esquerda */}
          <Link 
            href="/"
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 border border-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Voltar para Home</span>
          </Link>

          {/* Título na direita */}
          <h2 className="text-3xl font-bold text-white">⭐ Pokémons Favoritos</h2>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg mb-4">Nenhum Pokémon favorito ainda.</p>
            <Link 
              href="/"
              className="text-blue-400 hover:text-blue-300 underline text-lg"
            >
              Explorar Pokémon
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
            {favorites.map((pokemon) => {
              const details = pokemonDetails[pokemon.name];
              const imageUrl = details?.sprites?.other['official-artwork']?.front_default || pokemon.image;
              const abilities = details?.abilities?.slice(0, 2).map(a => a.ability.name).join(', ') || 'N/A';

              return (
                <div
                  key={`${pokemon.name}-${pokemon.id || Date.now()}-${Math.random()}`}
                  className="relative card-background rounded-2xl p-4 flex flex-col items-center transform hover:scale-[1.03] transition-transform duration-300 shadow-2xl border-2 border-neonBlue/20"
                >
                  {/* Botão de Remover discreto no canto */}
                  <button
                    onClick={() => removeFavorite(pokemon.name)}
                    className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-full transition-all duration-200 hover:scale-110 z-10"
                    aria-label="Remover dos favoritos"
                    title="Remover dos favoritos"
                  >
                    <span className="text-white text-sm font-bold">×</span>
                  </button>
                  
                  <Link href={`/pokemon/${pokemon.name}`} className="w-full flex flex-col items-center group">
                    
                    <div className="relative w-32 h-32 my-2">
                      <img
                        src={imageUrl}
                        alt={pokemon.name}
                        className="w-full h-full object-contain drop-shadow-[0_5px_15px_rgba(255,255,255,0.2)]"
                      />
                    </div>

                    <h2 className="text-3xl font-bold capitalize text-white mb-3 mt-1 group-hover:text-neonBlue transition-colors">
                      {pokemon.name}
                    </h2>
                    
                    {details?.types && (
                      <div className="flex space-x-2 justify-center mb-3">
                        {details.types.map((typeInfo) => (
                          <span
                            key={typeInfo.type.name}
                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize text-white shadow-md ${
                              getTypeClass(typeInfo.type.name)
                            }`}
                          >
                            {typeInfo.type.name}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="w-full mt-2 p-2 text-center text-sm rounded-lg bg-black/40 border border-gray-700/50">
                      <span className="font-semibold text-gray-400 block mb-1">Habilidades:</span>
                      <span className="text-gray-200 capitalize">{abilities}</span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}