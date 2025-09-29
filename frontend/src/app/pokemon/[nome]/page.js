"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useFavorites from "../../hooks/useFavorites";
import Link from "next/link";

// Cores para cada tipo de Pokémon
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

// Pega a cor do tipo ou cor padrão
const getTypeClass = (type) => typeColors[type] || 'bg-gray-700 shadow-gray-700/50';

export default function PokemonDetails() {
  const { nome } = useParams(); // pega o nome do Pokémon da rota
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);

  // Verifica se usuário está logado e pega email
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    
    if (!isLoggedIn || !email) {
      router.push("/login"); // redireciona se não estiver logado
      return;
    }
    setUserEmail(email);
  }, [router]);

  const { addFavorite, favorites, loading } = useFavorites(userEmail);
  const [pokemon, setPokemon] = useState(null);
  const [pokemonLoading, setPokemonLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  // Busca detalhes do Pokémon
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
        const data = await res.json();
        setPokemon(data);
        setIsFavorited(favorites.some(fav => fav.name === data.name)); // checa se já é favorito
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

  // Enquanto carrega mostra spinner
  if (pokemonLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-fixed"
           style={{ backgroundImage: "url('/fundoHome.jpg')" }}>
        <img src="/play.png" alt="Carregando..." className="h-20 w-20 animate-spin" />
      </div>
    );
  }

  // Caso não encontre Pokémon
  if (!pokemon) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-cover bg-center bg-fixed"
           style={{ backgroundImage: "url('/fundoHome.jpg')" }}>
        <p className="text-white text-2xl mb-4">Erro ao carregar Pokémon.</p>
        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200">
          Voltar para Home
        </Link>
      </div>
    );
  }

  // Adiciona Pokémon aos favoritos
  const handleFavorite = () => {
    addFavorite({
      name: pokemon.name,
      image: pokemon.sprites?.other?.["official-artwork"]?.front_default || pokemon.sprites?.front_default || "/default-pokemon.png",
    });
    setIsFavorited(true);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed py-8" style={{ backgroundImage: "url('/fundoHome.jpg')" }}>
      <div className="container mx-auto px-4">

        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105">
            ← Voltar para Home
          </Link>
          <h1 className="text-4xl font-bold text-white capitalize text-center">{pokemon.name}</h1>
          <div className="w-32"></div> {/* Espaço para centralizar */}
        </div>

        {/* Card principal */}
        <div className="max-w-4xl mx-auto">
          <div className="card-background rounded-2xl p-8 flex flex-col items-center shadow-2xl border-2 border-neonBlue/20">
            
            {/* Imagem */}
            <div className="relative w-64 h-64 mb-6">
              <img src={pokemon.sprites?.other?.["official-artwork"]?.front_default || pokemon.sprites?.front_default || "/default-pokemon.png"}
                   alt={pokemon.name}
                   className="w-full h-full object-contain drop-shadow-[0_5px_15px_rgba(255,255,255,0.2)]" />
            </div>

            {/* Botão Favoritar */}
            <button onClick={handleFavorite} disabled={isFavorited}
                    className={`mb-8 px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
                      isFavorited 
                        ? "bg-red-600 text-white cursor-not-allowed border-2 border-red-500/30" 
                        : "bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-500/30"
                    }`}>
              {isFavorited ? "❤️ Pokémon Favoritado" : "⭐ Adicionar aos Favoritos"}
            </button>

            {/* Informações */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

              {/* Estatísticas */}
              <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50">
                <h2 className="text-2xl font-bold text-white mb-4 text-center">📊 Estatísticas</h2>
                <div className="space-y-3">
                  <DetailItem label="ID" value={pokemon.id} />
                  <DetailItem label="Altura" value={`${pokemon.height / 10} m`} />
                  <DetailItem label="Peso" value={`${pokemon.weight / 10} kg`} />
                  <DetailItem label="Experiência Base" value={pokemon.base_experience} />
                </div>
              </div>

              {/* Tipos */}
              <div className="space-y-6">
                <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-bold text-white mb-3 text-center">🎨 Tipos</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {pokemon.types.map((typeInfo) => (
                      <span key={typeInfo.type.name}
                            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize text-white shadow-md ${getTypeClass(typeInfo.type.name)}`}>
                        {typeInfo.type.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Habilidades */}
                <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-bold text-white mb-3 text-center">⚡ Habilidades</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {pokemon.abilities.map((a) => (
                      <span key={a.ability.name}
                            className="px-3 py-1 bg-blue-600/80 text-white rounded-lg text-sm capitalize border border-blue-400/30">
                        {a.ability.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Movimentos */}
            <div className="w-full bg-black/40 rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">🎯 Movimentos</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-64 overflow-y-auto pr-2">
                {pokemon.moves.map((move) => (
                  <span key={move.move.name}
                        className="px-3 py-2 bg-gray-700/50 text-gray-200 rounded-lg text-sm text-center capitalize border border-gray-600/50 hover:bg-gray-600/50 transition-colors duration-200">
                    {move.move.name}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg border border-gray-600/50">
      <span className="text-gray-300 font-medium">{label}:</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}
