"use client";

import { useEffect } from "react";
import { api } from "@/trpc/react";
import { useFilters } from "@/contexts/FilterContext";
import { GenerationFilter } from "./GenerationFilter";
import { TypeFilter } from "./TypeFilter";
import { SearchFilters } from "./SearchFilters";

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
    applyFilters
  } = useFilters();

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
  // FILTER COORDINATION HANDLERS
  // ============================================================================
  
  const handleGenerationChange = (generationId: string) => {
    setSelectedGeneration(generationId);
    // Clear dependent filters when generation changes
    setSelectedType("");
    setSearchText("");
  };

  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);
    // Clear global search results when filtering locally
    setGlobalSearchResults(null);
  };

  const handleSearchChange = (searchValue: string) => {
    setSearchText(searchValue);
    // Clear global search results when changing search locally
    setGlobalSearchResults(null);
  };

  const handleGlobalSearch = () => {
    if (searchText.trim()) {
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

  // Update Pokemon list when generation data changes (optimized dependencies)
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
    }
  }, [selectedGeneration, generationPokemonList]); // Removed stable dependencies

  // Handle global search result (simplified)
  useEffect(() => {
    if (globalPokemonResult) {
      setGlobalSearchResults(globalPokemonResult);
    }
  }, [globalPokemonResult]);

  // Apply filters when type or search text changes (but not for global search)
  useEffect(() => {
    if (!pokemonData.globalSearchResults) {
      applyFilters();
    }
  }, [selectedType, searchText, pokemonData.globalSearchResults, applyFilters]);

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