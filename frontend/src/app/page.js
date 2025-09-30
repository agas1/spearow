"use client"; 

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import useFavorites from "./hooks/useFavorites";
import PokemonSearch from "./components/PokemonSearch";
import PokemonResults from "./components/PokemonResults";
import ChatWidget from "./components/ChatWidget";
import Link from 'next/link';

// Eu centralizei as URLs da API aqui para facilitar a manutenção
// Se precisar mudar o backend, é só atualizar este arquivo
import { API_URL } from "./config";

// Criei este mapeamento de cores para cada tipo de Pokémon
// Foi um trabalho manual do caramba :,(
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

// Criei este componente para exibir os Pokémon em grid
// Reutilizei o mesmo layout do PokemonResults para manter consistência
function PokemonGrid({ pokemons, isPokemonFavorited, addFavorite }) {
  // Se não há pokémons para mostrar, retorno null para não quebrar a UI
  if (!pokemons || pokemons.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
      {pokemons.map((poke) => {
        const favorited = isPokemonFavorited(poke.name);
        // Tento pegar a imagem oficial primeiro, se não tiver uso a default
        const imageUrl = poke.sprites?.other['official-artwork']?.front_default || poke.sprites?.front_default || "/default-pokemon.png";
        // Limito a 2 habilidades para não poluir visualmente
        const abilities = poke.abilities?.slice(0, 2).map(a => a.ability.name).join(', ') || 'N/A';

        return (
          <div
            key={poke.id}
            className="relative card-background rounded-2xl p-4 flex flex-col items-center 
                       transform hover:scale-[1.03] transition-transform duration-300 shadow-2xl border-2 border-neonBlue/20"
          >
            <button
              onClick={() => addFavorite({ name: poke.name, image: imageUrl })}
              className={`absolute top-3 right-3 text-xl transition-transform duration-200 hover:scale-125 z-10 
                ${favorited ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}
              aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              {favorited ? "❤️" : "🤍"}
            </button>
            
            <Link href={`/pokemon/${poke.name}`} className="w-full flex flex-col items-center group">
              <div className="relative w-32 h-32 my-2">
                <img
                  src={imageUrl}
                  alt={poke.name}
                  className="w-full h-full object-contain drop-shadow-[0_5px_15px_rgba(255,255,255,0.2)]"
                />
              </div>

              <h2 className="text-3xl font-bold capitalize text-white mb-3 mt-1 group-hover:text-neonBlue transition-colors">
                {poke.name}
              </h2>
              
              <div className="flex space-x-2 justify-center mb-3">
                {poke.types.map((typeInfo) => (
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
              
              <div className="w-full mt-2 p-2 text-center text-sm rounded-lg bg-black/40 border border-gray-700/50">
                <span className="font-semibold text-gray-400 block mb-1">Habilidades:</span>
                <span className="text-gray-200 capitalize">{abilities}</span>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();

  // --- Estados principais que controlam a página ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Adicionei estes estados para organizar melhor os Pokémon
  // Os em destaque são os clássicos que todo mundo conhece
  const [featuredPokemons, setFeaturedPokemons] = useState([]);
  const [allPokemons, setAllPokemons] = useState([]);
  const [showAllPokemons, setShowAllPokemons] = useState(false);

  // --- Estados para edição do perfil ---
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(""); 
  const [newPassword, setNewPassword] = useState("");

  // --- Estados para busca por tipo ---
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  // --- Sistema de favoritos ---
  const [userEmail, setUserEmail] = useState(null);
  const { addFavorite, favorites, loading: favoritesLoading } =
    useFavorites(userEmail);

  const isPokemonFavorited = (pokemonName) =>
    favorites.some((fav) => fav.name === pokemonName);

  // --- Funções principais ---
  const handleLogout = useCallback(() => {
    // Limpo tudo do localStorage e redireciono para login
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUser(null);
    setResults([]);
    router.push("/login");
  }, [router]);

  // Esta função busca detalhes de um Pokémon específico
  // Uso quando preciso de informações completas além do básico
  const fetchPokemonDetails = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Erro ao buscar detalhes do Pokémon.");
    return res.json();
  };

  // Criei esta função para carregar alguns Pokémon logo ao entrar
  // Escolhi os mais icônicos para chamar atenção dos usuários
  const loadInitialPokemons = async () => {
    try {
      // Estes são os Pokémon que todo fã conhece
      const featuredIds = [6, 25, 150, 94, 143, 149];
      const featuredPromises = featuredIds.map(id => 
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
      );
      
      const featuredData = await Promise.all(featuredPromises);
      setFeaturedPokemons(featuredData);

      // Carrego os primeiros 12 para a lista completa
      const listRes = await fetch("https://pokeapi.co/api/v2/pokemon?limit=12");
      const listData = await listRes.json();
      
      const detailedPromises = listData.results.map(pokemon => 
        fetchPokemonDetails(pokemon.url)
      );
      const allData = await Promise.all(detailedPromises);
      setAllPokemons(allData);

    } catch (error) {
      console.error("Erro ao carregar pokémons iniciais:", error);
    }
  };

  const handleSearchByType = useCallback(async (type) => {
    if (!type) return;
    setResults([]);
    setLoading(true);
    setShowAllPokemons(false);

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type.toLowerCase()}`);
      if (!res.ok) throw new Error("Tipo não encontrado.");
      const data = await res.json();

      const pokemonList = data.pokemon.map((p) => p.pokemon).slice(0, 20);
      const detailedResults = await Promise.all(
        pokemonList.map((item) => fetchPokemonDetails(item.url))
      );
      setResults(detailedResults);
    } catch (error) {
      setResults([]);
      console.error(error);
      alert(`Erro ao buscar por tipo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = async () => {
    if (query.trim() === "") {
      alert("Por favor, digite o nome de um Pokémon.");
      return;
    }
    setLoading(true);
    setSelectedType("");
    setShowAllPokemons(false);

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
      if (!res.ok) throw new Error("Pokémon não encontrado.");
      const data = await res.json();
      setResults([data]);
    } catch (error) {
      setResults([]);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Esta função permite carregar mais Pokémon quando o usuário quiser
  // Uso o offset baseado no tamanho atual da lista
  const loadMorePokemons = async () => {
    try {
      const nextRes = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${allPokemons.length}&limit=12`);
      const nextData = await nextRes.json();
      
      const detailedPromises = nextData.results.map(pokemon => 
        fetchPokemonDetails(pokemon.url)
      );
      const newPokemons = await Promise.all(detailedPromises);
      
      setAllPokemons(prev => [...prev, ...newPokemons]);
    } catch (error) {
      console.error("Erro ao carregar mais pokémons:", error);
    }
  };

  // Esta função atualiza o perfil do usuário
  // Tive que corrigir para usar o endpoint correto da minha API
  const handleUpdate = async (e) => {
    e.preventDefault();
    const userEmail = user?.email;
    if (!userEmail) {
      alert("Erro: Email do usuário não encontrado para atualização.");
      return;
    }

    try {
      const updateData = { 
        email: userEmail,
        newName: newName 
      };
      
      // Só atualizo a senha se o usuário preencheu o campo
      if (newPassword.trim()) {
        updateData.newPassword = newPassword;
      }

      const res = await fetch(`${API_URL}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        const data = await res.json();
        alert("Perfil atualizado com sucesso!");
        setIsEditing(false);
        setUser(data.user);
        setNewPassword("");
      } else {
        const errorData = await res.json();
        alert(`Erro ao atualizar o perfil: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  // --- Efeitos que rodam automaticamente ---
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);

    const fetchUserDataAndTypes = async () => {
      if (loggedInStatus && email) {
        setUserEmail(email);

        try {
          // Busco os dados do usuário da minha API
          // Uso encodeURIComponent para lidar com emails com caracteres especiais
          const userRes = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
          
          if (!userRes.ok) {
            throw new Error(`Erro ao carregar dados do usuário: ${userRes.status}`);
          }

          // Minha API retorna um objeto direto, não array
          const userData = await userRes.json();

          if (userData && userData.email) {
            setUser(userData);
            setNewName(userData.name);
          } else {
            console.warn("Usuário não encontrado");
            handleLogout();
            return;
          }

          // Carrego todos os tipos de Pokémon disponíveis
          const typesRes = await fetch("https://pokeapi.co/api/v2/type");
          if (!typesRes.ok) throw new Error("Erro ao carregar tipos.");
          const typesData = await typesRes.json();
          setPokemonTypes(typesData.results);

          // Só carrego os Pokémon depois que tenho o usuário
          await loadInitialPokemons();

        } catch (error) {
          console.error("Erro no carregamento inicial:", error);
          
          if (error.message.includes('Failed to fetch')) {
            alert(`Não foi possível conectar ao servidor.\n\nVerifique:\n• Se o backend está rodando\n• URL: ${API_URL}`);
          } else {
            alert(`Erro: ${error.message}`);
          }
          
          handleLogout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        router.push("/login");
      }
    };

    fetchUserDataAndTypes();
  }, [handleLogout, router]);

  useEffect(() => {
    if (selectedType) {
      setQuery("");
      handleSearchByType(selectedType);
    }
  }, [selectedType, handleSearchByType]);

  // --- Renderização da página ---
  if (loading || favoritesLoading) {
    return (
      <div 
        className="flex justify-center items-center min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/fundoHome.jpg')" }}
      >
        <div className="text-center">
          <img
            src="/play.png"
            alt="Carregando Pokédex..."
            className="h-20 w-20 animate-spin mx-auto mb-4"
          />
          <p className="text-white text-lg">Carregando sua Pokédex...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/fundoHome.jpg')" }}
    >
      <Navbar
        user={user}
        handleUpdate={handleUpdate}
        handleLogout={handleLogout}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        newName={newName}
        setNewName={setNewName}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
      />

      <div className="container mx-auto px-4 pb-12">
        <main className="w-full bg-transparent rounded-xl p-6">          
          <PokemonSearch
            query={query}
            setQuery={setQuery}
            handleSearch={handleSearch}
            pokemonTypes={pokemonTypes}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />

          {/* Mostro os destaques apenas quando não há busca ativa */}
          {/* Isso evita poluição visual para o usuário */}
          {results.length === 0 && !selectedType && (
            <>
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">⭐ Pokémon em Destaque</h2>
                <PokemonGrid 
                  pokemons={featuredPokemons}
                  isPokemonFavorited={isPokemonFavorited}
                  addFavorite={addFavorite}
                />
              </section>

              {/* Esta seção é opcional - o usuário decide se quer ver todos */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white"> Todos os Pokémons</h2>
                  <button 
                    onClick={() => setShowAllPokemons(!showAllPokemons)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    {showAllPokemons ? 'Ocultar' : 'Ver Todos'}
                  </button>
                </div>
                
                {showAllPokemons && (
                  <>
                    <PokemonGrid 
                      pokemons={allPokemons}
                      isPokemonFavorited={isPokemonFavorited}
                      addFavorite={addFavorite}
                    />
                    <div className="text-center mt-6">
                      <button 
                        onClick={loadMorePokemons}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
                      >
                        Carregar Mais Pokémon
                      </button>
                    </div>
                  </>
                )}
              </section>
            </>
          )}

          {/* Mostro os resultados da busca aqui */}
          <PokemonResults
            results={results}
            isPokemonFavorited={isPokemonFavorited}
            addFavorite={addFavorite}
          />
        </main>
      </div>

      {isLoggedIn && <ChatWidget />}
    </div>
  );
}