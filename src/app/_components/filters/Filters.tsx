"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/trpc/react";
import { useFilters } from "@/contexts/FilterContext";
import { GenerationFilter } from "./GenerationFilter";
import { TypeFilter } from "./TypeFilter";
import { SearchFilters } from "./SearchFilters";
import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";

export function Filters() {
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
  
  const [globalSearchTriggered, setGlobalSearchTriggered] = useState(0);

  // ============================================================================
  // API QUERIES
  // ============================================================================
  
  // Fetch generation-specific Pokemon when generation changes
  const { data: generationPokemonList, isLoading: pokemonLoading } = api.pokemon.getPokemonList.useQuery(
    { generationId: Number(selectedGeneration) },
    { 
      enabled: selectedGeneration !== "",
      staleTime: 60 * 60 * 1000, // 1 hour cache
      gcTime: 60 * 60 * 1000, // 1 hour cache
    }
  );

  // Global Pokemon search by name
  const { 
    data: globalPokemonResult, 
    isLoading: globalSearchLoading,
    error: globalSearchError,
    isError: globalSearchIsError,
    refetch: searchGlobalPokemon 
  } = api.pokemon.getPokemonDetailsByName.useQuery(
    { name: searchText.toLowerCase().trim() },
    { 
      enabled: false, // Only trigger manually
      staleTime: 60 * 60 * 1000, // 1 hour cache
      gcTime: 60 * 60 * 1000, // 1 hour cache
      retry: false, // Don't retry on 404 errors
    }
  );

  // ============================================================================
  // FILTER UTILITY FUNCTIONS
  // ============================================================================
  
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

  const applyLocalFilters = useCallback((pokemonList: Pokemon[], typeId: string, searchTerm: string): Pokemon[] => {
    let listToFilter = pokemonList;

    // Apply type filter
    listToFilter = applyTypeFilter(listToFilter, typeId);
    
    // Apply search filter
    listToFilter = applySearchFilter(listToFilter, searchTerm);

    return listToFilter;
  }, [applyTypeFilter, applySearchFilter]);

  // ============================================================================
  // FILTER COORDINATION HANDLERS
  // ============================================================================
  
  const handleGenerationChange = (generationId: string) => {
    setSelectedGeneration(generationId);
    // Clear global search results when generation changes
    setGlobalSearchResults(null);
    // Note: Filters will be applied when generationPokemonList updates via useEffect
  };

  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);
    // Clear global search results when filtering locally
    setGlobalSearchResults(null);
    
    // Apply filters immediately if not using global search
    if (!pokemonData.globalSearchResults) {
      const filteredList = applyLocalFilters(pokemonData.originalList, typeId, searchText);
      updateFilteredList(filteredList);
    }
  };

  const handleSearchChange = (searchValue: string) => {
    setSearchText(searchValue);
    // Clear global search results when changing search locally
    setGlobalSearchResults(null);
    
    // Apply filters immediately if not using global search
    if (!pokemonData.globalSearchResults) {
      const filteredList = applyLocalFilters(pokemonData.originalList, selectedType, searchValue);
      updateFilteredList(filteredList);
    }
  };

  const handleGlobalSearch = () => {
    if (searchText.trim().length > 0) {
      setGlobalSearchTriggered(prev => prev + 1);
      void searchGlobalPokemon();
    }
  };

  // ============================================================================
  // SIDE EFFECTS (OPTIMIZED)
  // ============================================================================
  
  // Update context loading state
  useEffect(() => {
    setLoading(pokemonLoading || globalSearchLoading);
  }, [pokemonLoading, globalSearchLoading, setLoading]);

  // Update Pokemon list when generation data changes and apply initial filters
  useEffect(() => {
    if (generationPokemonList && selectedGeneration !== "") {
      // Update the original list with generation-specific Pokemon
      initializePokemonData({
        pokemonList: generationPokemonList,
        generations: pokemonData.generations,
        types: pokemonData.types
      });
      
      // Clear any previous global search results
      setGlobalSearchResults(null);
      
      // Apply current filters to the new generation data
      const filteredList = applyLocalFilters(generationPokemonList, selectedType, searchText);
      updateFilteredList(filteredList);
    }
  }, [selectedGeneration, generationPokemonList, selectedType, searchText, initializePokemonData, setGlobalSearchResults, applyLocalFilters, updateFilteredList, pokemonData.generations, pokemonData.types]);

  // Handle global search result
  useEffect(() => {
    if (globalPokemonResult) {
      // setGlobalSearchResults(globalPokemonResult);
      // Update filtered list with global search results
      const pokemonsEvolutions = globalPokemonResult.map((pokemon) => pokemon.evolutionChain).flat();
      updateFilteredList(pokemonsEvolutions);
    }
  }, [globalPokemonResult, globalSearchTriggered, setGlobalSearchResults, updateFilteredList]);

  // ============================================================================
  // RENDER
  // ============================================================================
  
  const isLoading = pokemonLoading || globalSearchLoading;

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-sm text-gray-600 font-medium">
              {pokemonLoading ? "Loading Pokemon..." : "Searching globally..."}
            </p>
          </div>
        </div>
      )}
      
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Filters</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        globalSearchLoading={globalSearchLoading}
        globalSearchError={globalSearchError}
        globalSearchIsError={globalSearchIsError}
      />
    </div>
  );
}