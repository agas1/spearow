// app/HomePage.jsx
"use client"; // Esse componente roda no client-side (necessário no Next 13+)

// Imports de libs e componentes usados
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar"; // Componente de navegação (menu superior)
import useFavorites from "./hooks/useFavorites"; // Hook customizado para gerenciar favoritos
import PokemonSearch from "./components/PokemonSearch"; // Componente de busca de Pokémon
import PokemonResults from "./components/PokemonResults"; // Lista de resultados da busca
import ChatWidget from "./components/ChatWidget"; // Chat flutuante da pokédex

export default function HomePage() {
  const router = useRouter();

  // --- Estados principais ---
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Verifica se o usuário está logado
  const [user, setUser] = useState(null); // Dados do usuário logado
  const [loading, setLoading] = useState(true); // Controla estado de carregamento (tela inicial / buscas)
  const [query, setQuery] = useState(""); // Input de busca por nome
  const [results, setResults] = useState([]); // Resultados da busca (pokémons)

  // --- Estados do perfil ---
  const [isEditing, setIsEditing] = useState(false); // Editar nome/senha
  const [newName, setNewName] = useState(""); 
  const [newPassword, setNewPassword] = useState("");

  // --- Busca por tipo ---
  const [pokemonTypes, setPokemonTypes] = useState([]); // Lista de tipos de Pokémon
  const [selectedType, setSelectedType] = useState(""); // Tipo selecionado para busca

  // --- Favoritos ---
  const [userEmail, setUserEmail] = useState(null);
  const { addFavorite, favorites, loading: favoritesLoading } =
    useFavorites(userEmail); // Hook retorna favoritos do usuário

  // Função que checa se o Pokémon já está nos favoritos
  const isPokemonFavorited = (pokemonName) =>
    favorites.some((fav) => fav.name === pokemonName);

  // --- Funções de Lógica ---
  // Logout do usuário: limpa localStorage e redireciona para login
  const handleLogout = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUser(null);
    setResults([]);
    router.push("/login");
  }, [router]);

  // Busca os detalhes de um Pokémon individual
  const fetchPokemonDetails = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Erro ao buscar detalhes do Pokémon.");
    return res.json();
  };

  // Busca Pokémon por tipo
  const handleSearchByType = useCallback(async (type) => {
    if (!type) return;
    setResults([]);
    setLoading(true);

    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/type/${type.toLowerCase()}`
      );
      if (!res.ok) throw new Error("Tipo não encontrado.");
      const data = await res.json();

      // Pega os primeiros 20 pokémons desse tipo
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

  // Busca Pokémon por nome (query)
  const handleSearch = async () => {
    if (query.trim() === "") {
      alert("Por favor, digite o nome de um Pokémon.");
      return;
    }
    setLoading(true);
    setSelectedType(""); // Se digitar no input, limpa a seleção de tipo

    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
      );
      if (!res.ok) throw new Error("Pokémon não encontrado.");
      const data = await res.json();
      setResults([data]); // Resultado único
    } catch (error) {
      setResults([]);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Atualização do perfil do usuário (nome/senha)
  const handleUpdate = async (e) => {
    e.preventDefault();
    const userId = user?.id;

    if (!userId) {
      alert("Erro: ID do usuário não encontrado para atualização.");
      return;
    }

    try {
      const updateData = { name: newName };
      if (newPassword.trim()) updateData.password = newPassword;

      const res = await fetch(`http://localhost:4000/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        alert("Perfil atualizado com sucesso!");
        setIsEditing(false);
        const updatedUser = await res.json();
        setUser(updatedUser);
        setNewPassword("");
      } else {
        alert("Erro ao atualizar o perfil.");
      }
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  // --- Efeitos ---
  // Efeito inicial: verifica login e carrega dados do usuário + tipos de Pokémon
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);

    const fetchUserDataAndTypes = async () => {
      if (loggedInStatus && email) {
        setUserEmail(email);

        try {
          // Busca dados do usuário no backend
          const userRes = await fetch(
            `http://localhost:4000/users?email=${email}`
          );
          if (!userRes.ok)
            throw new Error("Erro ao carregar dados do usuário.");

          const userDataArray = await userRes.json();
          const userData = Array.isArray(userDataArray)
            ? userDataArray[0]
            : userDataArray;

          if (userData) {
            setUser(userData);
            setNewName(userData.name);
          } else {
            handleLogout();
            return;
          }

          // Busca tipos de Pokémon na PokeAPI
          const typesRes = await fetch("https://pokeapi.co/api/v2/type");
          if (!typesRes.ok) throw new Error("Erro ao carregar tipos.");
          const typesData = await typesRes.json();
          setPokemonTypes(typesData.results);
        } catch (error) {
          console.error("Erro no carregamento inicial:", error);
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

  // Quando muda o tipo selecionado, dispara nova busca
  useEffect(() => {
    if (selectedType) {
      setQuery("");
      handleSearchByType(selectedType);
    }
  }, [selectedType, handleSearchByType]);

  // --- Renderização ---
  // Enquanto estiver carregando (dados iniciais ou favoritos) → mostra tela de loading
  if (loading || favoritesLoading) {
    return (
      <div 
        className="flex justify-center items-center min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/fundoHome.jpg')" }}
      >
        {/* Ícone customizado (Pokémon) no lugar do spinner padrão */}
        <img
          src="/play.png" // O arquivo deve estar dentro da pasta /public
          alt="Carregando Pokédex..."
          className="h-20 w-20 animate-spin"
        />
      </div>
    );
  }

  // Conteúdo principal (após carregamento)
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/fundoHome.jpg')" }}
    >
      {/* Navbar com informações do usuário e opções de edição/logout */}
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

      {/* Espaço para header futuramente (ex: título, stats, etc.) */}
      <div className="text-center py-10"></div>

      {/* Área principal com busca + resultados */}
      <div className="container mx-auto px-4 pb-12">
        <main className="w-full bg-white rounded-xl shadow-lg p-6">
          {/* Busca Pokémon (por nome ou tipo) */}
          <PokemonSearch
            query={query}
            setQuery={setQuery}
            handleSearch={handleSearch}
            pokemonTypes={pokemonTypes}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />

          {/* Resultados da busca */}
          <PokemonResults
            results={results}
            isPokemonFavorited={isPokemonFavorited}
            addFavorite={addFavorite}
          />
        </main>
      </div>

      {/* Chat flutuante só aparece se o usuário estiver logado */}
      {isLoggedIn && <ChatWidget />}
    </div>
  );
}
