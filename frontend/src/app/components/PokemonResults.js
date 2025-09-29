// components/PokemonResults.jsx
import Link from 'next/link';

// Mapeamento de cores para os tipos, como na imagem
const typeColors = {
  fire: 'bg-red-600 shadow-red-600/50',
  water: 'bg-blue-600 shadow-blue-600/50',
  grass: 'bg-green-600 shadow-green-600/50',
  electric: 'bg-yellow-500 shadow-yellow-500/50',
  poison: 'bg-purple-600 shadow-purple-600/50',
  normal: 'bg-gray-500 shadow-gray-500/50',
  bug: 'bg-lime-600 shadow-lime-600/50',
  flying: 'bg-indigo-400 shadow-indigo-400/50',
  // Adicione outros tipos conforme necessário
};

// Função auxiliar para obter a cor do tipo
const getTypeClass = (type) => typeColors[type] || 'bg-gray-700 shadow-gray-700/50';

export default function PokemonResults({ results, isPokemonFavorited, addFavorite }) {

  // REMOVA ou COMENTE esta parte para não mostrar mensagem quando não há resultados
  // if (results.length === 0) {
  //   return (
  //     <div 
  //       // Estilo Neon para mensagem de erro/vazio
  //       className="mt-12 text-center text-gray-400 p-6 rounded-lg border border-neonPurple/30 bg-darkBackground/70 shadow-lg"
  //     >
  //       Nenhum Pokémon encontrado. Tente outra busca por nome ou selecione um tipo.
  //     </div>
  //   );
  // }

  // Se não há resultados, retorna nada (vazio)
  if (results.length === 0) {
    return null;
  }

  return (
    // Colunas ajustadas para o layout centralizado da imagem
    <div className="mt-8 w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
      {results.map((poke) => {
        const favorited = isPokemonFavorited(poke.name);
        // Usando a arte oficial de alta qualidade para um visual melhor
        const imageUrl = poke.sprites?.other['official-artwork']?.front_default || poke.sprites?.front_default || "/default-pokemon.png";
        
        // Pega as duas primeiras habilidades (usadas na imagem)
        const abilities = poke.abilities?.slice(0, 2).map(a => a.ability.name).join(', ') || 'N/A';

        return (
          <div
            key={poke.id}
            // Classe principal do Card: Fundo de vidro + Sombra de transição
            className="relative card-background rounded-2xl p-4 flex flex-col items-center 
                       transform hover:scale-[1.03] transition-transform duration-300 shadow-2xl border-2 border-neonBlue/20"
          >
            {/* Botão de Favorito no canto superior (Posicionamento ABSOLUTO) */}
            <button
              onClick={() => addFavorite({ name: poke.name, image: imageUrl })}
              className={`absolute top-3 right-3 text-xl transition-transform duration-200 hover:scale-125 z-10 
                ${favorited ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}
              aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              {favorited ? "❤️" : "🤍"}
            </button>
            
            <Link href={`/pokemon/${poke.name}`} className="w-full flex flex-col items-center group">
              {/* Imagem do Pokémon */}
              <div className="relative w-32 h-32 my-2">
                <img
                  src={imageUrl}
                  alt={poke.name}
                  // Sombra no Pokémon para simular iluminação
                  className="w-full h-full object-contain drop-shadow-[0_5px_15px_rgba(255,255,255,0.2)]"
                />
              </div>

              {/* Nome do Pokémon */}
              <h2 className="text-3xl font-bold capitalize text-white mb-3 mt-1 group-hover:text-neonBlue transition-colors">
                {poke.name}
              </h2>
              
              {/* Tipos */}
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
              
              {/* Habilidades (Fundo escuro e texto claro) */}
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