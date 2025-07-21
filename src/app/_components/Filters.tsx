"use client";

import { useState } from "react";
import type { Generation } from "@/server/modules/generations/domain/entities/Generation";
import type { Type } from "@/server/modules/types/domain/entities/Type";
import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";

interface FiltersProps {
    generations: Generation[];
    types: Type[];
    setPokemonListFiltered: (pokemonList: Pokemon[]) => void;
    initialPokemonList: Pokemon[];
}

export function Filters({generations, types, setPokemonListFiltered, initialPokemonList}: FiltersProps) {
  const [selectedGeneration, setSelectedGeneration] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  const handleGenerationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGeneration(event.target.value);
    // TODO: Call to backend
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
    if (event.target.value === "") {
      // Show all Pokemon when "All Types" is selected
      setPokemonListFiltered(initialPokemonList);
    } else {
      setPokemonListFiltered(initialPokemonList.filter(
        (pokemon) => pokemon.types.some((type) => type.toLowerCase() === event.target.value.toLowerCase()))
      );
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Filters</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Generation Filter */}
        <div className="flex flex-col">
          <label htmlFor="generation-select" className="mb-2 text-sm font-medium text-gray-700">
            Generation
          </label>
          <select
            id="generation-select"
            value={selectedGeneration}
            onChange={handleGenerationChange}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {generations.map((generation) => (
              <option key={`generation-${generation.id}`} value={generation.id.toString()}>
                {generation.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex flex-col">
          <label htmlFor="type-select" className="mb-2 text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="type-select"
            value={selectedType}
            onChange={handleTypeChange}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option key="all-types" value="">All Types</option>
            {types.map((type) => (
              <option key={`type-${type.id}`} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Filter */}
      <div className="mt-4">
        <label htmlFor="search-input" className="mb-2 text-sm font-medium text-gray-700 block">
          Search Pokemon
        </label>
        <input
          id="search-input"
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search by name or evolution..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Type to search Pokemon names and their evolutions in real time
        </p>
      </div>
    </div>
  );
}