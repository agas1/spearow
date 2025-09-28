// components/PokemonSearch.jsx
"use client";
import React from 'react';

export default function PokemonSearch({ query, setQuery, handleSearch, pokemonTypes, selectedType, setSelectedType }) {
  
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Buscar Pokémon</h1>
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Busca por Nome */}
        <div className="flex-1 w-full">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Buscar por nome.."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium"
            >
              🔍 Buscar
            </button>
          </div>
        </div>

        {/* Busca por Tipo */}
        <div className="w-full md:w-64">
          <select
            value={selectedType}
            onChange={handleTypeChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white"
          >
            <option value="">Buscar por Tipo</option>
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
    </div>
  );
}