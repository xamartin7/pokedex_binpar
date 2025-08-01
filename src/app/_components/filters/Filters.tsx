"use client";

import { useEffect, useCallback } from "react";
import { useFilters } from "@/contexts/FilterContext";
import { GenerationFilter } from "./GenerationFilter";
import { TypeFilter } from "./TypeFilter";
import { SearchFilters } from "./SearchFilters";
import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import type { Generation } from "@/server/modules/generations/domain/entities/Generation";
import type { Type } from "@/server/modules/types/domain/entities/Type";

interface FiltersProps {
  generations: Generation[];
  types: Type[];
  pokemonList: Pokemon[];
}

export function Filters({ generations, types, pokemonList }: FiltersProps) {
  const { 
    filters: { selectedGeneration, selectedType, searchText },
    pokemonData,
    setSelectedGeneration,
    setSelectedType,
    setSearchText,
    initializePokemonData,
    setLoading,
    setGlobalSearchResults,
    updateFilteredList
  } = useFilters();

  // ============================================================================
  // FILTER UTILITY FUNCTIONS
  // ============================================================================
  
  const applyGenerationFilter = useCallback((pokemonList: Pokemon[], generationId: string): Pokemon[] => {
    if (generationId === "" || generationId === "all") {
      return pokemonList;
    }
    return pokemonList.filter(
      (pokemon) => pokemon.generation.id === parseInt(generationId)
    );
  }, []);

  const applyTypeFilter = useCallback((pokemonList: Pokemon[], typeId: string): Pokemon[] => {
    if (typeId === "") {
      return pokemonList;
    }
    return pokemonList.filter(
      (pokemon) => pokemon.types.some((type) => type.id === parseInt(typeId))
    );
  }, []);

  const applySearchFilter = useCallback((pokemonList: Pokemon[], searchTerm: string): Pokemon[] => {
    if (searchTerm === "") {
      return pokemonList;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    
    // Find Pokemon that match the search term
    const matchingPokemon = pokemonList.filter((pokemon) => {
      return pokemon.name.toLowerCase().includes(searchTermLower);
    });

    // Get all evolution chains from matching Pokemon
    const allEvolutionPokemon: Pokemon[] = [];
    matchingPokemon.forEach((pokemon) => {
      allEvolutionPokemon.push(...pokemon.evolutionChain);
    });

    // Remove duplicates based on Pokemon name
    return allEvolutionPokemon.filter((pokemon, index, self) => 
      index === self.findIndex((p) => p.name === pokemon.name)
    );
  }, []);

  const applyLocalFilters = useCallback((pokemonList: Pokemon[], generationId: string, typeId: string, searchTerm: string): Pokemon[] => {
    let listToFilter = pokemonList;

    // Apply generation filter
    listToFilter = applyGenerationFilter(listToFilter, generationId);
    
    // Apply type filter
    listToFilter = applyTypeFilter(listToFilter, typeId);
    
    // Apply search filter
    listToFilter = applySearchFilter(listToFilter, searchTerm);

    return listToFilter;
  }, [applyGenerationFilter, applyTypeFilter, applySearchFilter]);

  const performGlobalSearch = useCallback((pokemonList: Pokemon[], searchTerm: string): Pokemon[] => {
    if (searchTerm.trim() === "") {
      return [];
    }
    
    const searchTermLower = searchTerm.toLowerCase().trim();
    
    // Find Pokemon that match the search term by name
    const matchingPokemon = pokemonList.filter((pokemon) => {
      return pokemon.name.toLowerCase().includes(searchTermLower);
    });

    // Get all evolution chains from matching Pokemon
    const allEvolutionPokemon: Pokemon[] = [];
    matchingPokemon.forEach((pokemon) => {
      allEvolutionPokemon.push(...pokemon.evolutionChain);
    });

    // Remove duplicates based on Pokemon name
    return allEvolutionPokemon.filter((pokemon, index, self) => 
      index === self.findIndex((p) => p.name === pokemon.name)
    );
  }, []);

  // ============================================================================
  // FILTER COORDINATION HANDLERS
  // ============================================================================
  
  const handleGenerationChange = (generationId: string) => {
    setSelectedGeneration(generationId);
    // Clear global search results when generation changes
    setGlobalSearchResults(null);
    
    // Apply filters immediately with new generation
    const filteredList = applyLocalFilters(pokemonList, generationId, selectedType, searchText);
    updateFilteredList(filteredList);
  };

  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);
    // Clear global search results when filtering locally
    setGlobalSearchResults(null);
    
    // Apply filters immediately
    const filteredList = applyLocalFilters(pokemonList, selectedGeneration, typeId, searchText);
    updateFilteredList(filteredList);
  };

  const handleSearchChange = (searchValue: string) => {
    setSearchText(searchValue);
    // Clear global search results when changing search locally
    setGlobalSearchResults(null);
    
    // Apply filters immediately
    const filteredList = applyLocalFilters(pokemonList, selectedGeneration, selectedType, searchValue);
    updateFilteredList(filteredList);
  };

  const handleGlobalSearch = () => {
    if (searchText.trim().length > 0) {
      const globalResults = performGlobalSearch(pokemonList, searchText);
      updateFilteredList(globalResults);
    }
  };

  // ============================================================================
  // SIDE EFFECTS (OPTIMIZED)
  // ============================================================================
  
  // Initialize data when component mounts
  useEffect(() => {
    // Initialize the context with all data
    initializePokemonData({
      pokemonList,
      generations,
      types
    });
    
    // Clear loading state since we have all data
    setLoading(false);
    
    // Apply initial filters
    const filteredList = applyLocalFilters(pokemonList, selectedGeneration, selectedType, searchText);
    updateFilteredList(filteredList);
  }, [pokemonList, generations, types, selectedGeneration, selectedType, searchText, initializePokemonData, setLoading, applyLocalFilters, updateFilteredList]);

  // ============================================================================
  // RENDER
  // ============================================================================
  
  const isLoading = pokemonData.isLoading;

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-sm text-gray-600 font-medium">
              Loading Pokemon...
            </p>
          </div>
        </div>
      )}
      
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Filters</h2>
      
      <div className="space-y-4">
        <GenerationFilter
          generations={pokemonData.generations}
          selectedGeneration={selectedGeneration}
          onGenerationChange={handleGenerationChange}
          disabled={isLoading}
        />
        
        <TypeFilter
          types={pokemonData.types}
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          disabled={isLoading}
        />
      </div>

      <SearchFilters
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onGlobalSearch={handleGlobalSearch}
        filteredPokemonList={pokemonData.filteredList}
        disabled={isLoading}
        globalSearchLoading={false}
        globalSearchError={null}
        globalSearchIsError={false}
      />
    </div>
  );
}