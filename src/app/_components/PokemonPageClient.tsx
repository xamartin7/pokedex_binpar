"use client";

import { useEffect } from "react";
import { PokemonList } from "./PokemonList";
import { Filters } from "./filters/Filters";
import { useFilters } from "@/contexts/FilterContext";
import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import type { Generation } from "@/server/modules/generations/domain/entities/Generation";
import type { Type } from "@/server/modules/types/domain/entities/Type";

interface PokemonPageClientProps {
  initialData: {
    pokemonList: Pokemon[];
    generations: Generation[];
    types: Type[];
  };
}

export function PokemonPageClient({ initialData }: PokemonPageClientProps) {
  const { initializePokemonData, pokemonData } = useFilters();

  // Initialize context with server-hydrated data
  useEffect(() => {
    if (pokemonData.originalList.length === 0) {
      console.log('Client: Initializing with server data...')
      console.log(`Client: ${initialData.pokemonList.length} Pokemon, ${initialData.generations.length} generations, ${initialData.types.length} types`)
      
      initializePokemonData({
        pokemonList: initialData.pokemonList,
        generations: initialData.generations,
        types: initialData.types,
      });
    }
  }, [initialData, initializePokemonData, pokemonData.originalList.length]);

  // Show loading until context is initialized
  if (pokemonData.originalList.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Pokemon data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters - Left Side */}
        <div className="lg:w-1/4 flex-shrink-0">
          <Filters />
        </div>
        
        {/* Pokemon List - Right Side */}
        <div className="lg:w-3/4 flex-grow">
          <PokemonList />
        </div>
      </div>
    </div>
  );
}
