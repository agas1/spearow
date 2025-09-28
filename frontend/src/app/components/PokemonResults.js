// components/PokemonResults.jsx
import Link from 'next/link';

export default function PokemonResults({ results, isPokemonFavorited, addFavorite }) {

  if (results.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-600 p-4 bg-white rounded-lg shadow-md">
        Nenhum Pokémon encontrado. Tente outra busca por nome ou selecione um tipo.
      </div>
    );
  }

  return (
    <div className="mt-8 w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((poke) => {
        const favorited = isPokemonFavorited(poke.name);
        const imageUrl = poke.sprites?.front_default || "/default-pokemon.png"; // Adicionado fallback

        return (
          <div
            key={poke.id}
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center transform hover:scale-105 transition-transform duration-300"
          >
            <Link href={`/pokemon/${poke.name}`} className="w-full flex flex-col items-center">
              <img
                src={imageUrl}
                alt={poke.name}
                className="w-24 h-24 mb-2"
              />
              <h2 className="text-xl font-semibold text-gray-800 capitalize">{poke.name}</h2>
            </Link>
            <button
              onClick={() => addFavorite({ name: poke.name, image: imageUrl })}
              disabled={favorited}
              className={`mt-4 px-4 py-2 rounded-md font-semibold text-sm transition-all duration-300 ${
                  favorited 
                      ? "bg-yellow-400 text-gray-800 cursor-not-allowed" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {favorited ? "⭐ Já está nos Favoritos" : "⭐ Adicionar aos Favoritos"}
            </button>
          </div>
        );
      })}
    </div>
  );    
}