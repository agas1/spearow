"use client";
import React from 'react';

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

export default function PokemonSearch({ query, setQuery, handleSearch, pokemonTypes, selectedType, setSelectedType }) {
  
  const handleTypeClick = (typeName) => {
    if (selectedType === typeName) {
      setSelectedType("");
    } else {
      setSelectedType(typeName);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8 mb-12">
      {/* Container da busca - MESMO estilo dos cards */}
      <div className="w-full max-w-2xl mx-auto">
        <div className="card-background rounded-2xl p-2 shadow-2xl border-2 border-neonBlue/20">
          <div className="flex w-full">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Procure por nome ou número (ex: pikachu / 25)"
              className="flex-grow p-4 text-lg rounded-l-xl bg-black/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-neonBlue border-r-0 border border-gray-700/50 transition-all duration-200"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-8 rounded-r-xl transition-all duration-200 transform hover:scale-105 border-2 border-blue-500/30"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Botões de Tipo - MESMO estilo dos tipos da home */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="card-background rounded-2xl p-6 shadow-2xl border-2 border-neonBlue/20">
          <h3 className="text-2xl font-bold text-white text-center mb-6">
            🔍 Buscar por Tipo
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {pokemonTypes
              .filter(type => type.name !== "unknown" && type.name !== "shadow")
              .map(type => (
                <button
                  key={type.name}
                  onClick={() => handleTypeClick(type.name)}
                  className={`py-3 px-6 rounded-full text-sm font-semibold capitalize transition-all duration-200 transform hover:scale-110 shadow-lg border-2 ${
                    selectedType === type.name
                      ? `${getTypeClass(type.name)} border-white scale-110` // Estilo Selecionado
                      : 'bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 border-gray-600/50' // Estilo Padrão
                  }`}
                >
                  {type.name}
                </button>
              ))}
          </div>
          
          {/* Indicador de tipo selecionado */}
          {selectedType && (
            <div className="text-center mt-4">
              <span className="text-gray-300 text-sm">
                Tipo selecionado: 
                <span className={`ml-2 px-3 py-1 rounded-full text-white font-semibold ${getTypeClass(selectedType)}`}>
                  {selectedType}
                </span>
                <button
                  onClick={() => setSelectedType("")}
                  className="ml-3 text-red-400 hover:text-red-300 text-sm"
                >
                  ✕ Limpar
                </button>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Dropdown escondido hehe */}
      <div className="hidden">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-transparent text-white"
        >
          <option value="">Buscar por Tipo (Dropdown)</option>
          {pokemonTypes
            .filter(type => type.name !== "unknown" && type.name !== "shadow")
            .map(type => (
              <option key={type.name} value={type.name}>
                {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}