"use client";
import useFavorites from "../hooks/useFavorites"; // Mantenha o caminho ajustado
import Link from "next/link";
import { useEffect, useState } from "react"; // Importar useState e useEffect
import { useRouter } from "next/navigation"; // Importar useRouter para redirecionamento

export default function FavoritesPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);

  // 1. Pega o email do usuário do localStorage ao carregar a página
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    // Proteção: Se não estiver logado, redireciona para o login
    if (!isLoggedIn || !email) {
      router.push("/login");
      return;
    }
    setUserEmail(email);
  }, [router]);
  
  // 2. O hook AGORA RECEBE o email. A busca só ocorre quando userEmail for definido.
  const { favorites, removeFavorite, loading } = useFavorites(userEmail);

  // Exibe o carregamento enquanto espera o email e os favoritos
  if (loading || userEmail === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Carregando favoritos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Pokémons Favoritos
      </h2>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          Nenhum Pokémon favorito ainda.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((pokemon) => (
            <div
              key={pokemon.name}
              className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center transform hover:scale-105 transition-transform duration-300"
            >
              <Link href={`/pokemon/${pokemon.name}`} className="w-full flex flex-col items-center">
                <strong className="text-xl font-semibold capitalize text-gray-800">
                  {pokemon.name}
                </strong>
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  width={150}
                  height={150}
                  className="my-4 rounded-full border-2 border-gray-200"
                />
              </Link>
              <button
                onClick={() => removeFavorite(pokemon.name)}
                className="mt-2 w-full bg-red-500 text-white font-medium py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}