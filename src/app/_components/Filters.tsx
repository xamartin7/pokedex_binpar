"use client";

import { useEffect } from "react";
import type { Generation } from "@/server/modules/generations/domain/entities/Generation";
import type { Type } from "@/server/modules/types/domain/entities/Type";
import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import { api } from "@/trpc/react";
import { useFilters } from "@/contexts/FilterContext";

interface FiltersProps {
  generations: Generation[];
  types: Type[];
  setPokemonListFiltered: (pokemonList: Pokemon[]) => void;
  initialPokemonList: Pokemon[];
  filteredPokemonList: Pokemon[];
  setInitialPokemonList: (pokemonList: Pokemon[]) => void;
}

export function Filters({
  generations, 
  types, 
  setPokemonListFiltered, 
  initialPokemonList, 
  filteredPokemonList, 
  setInitialPokemonList
}: FiltersProps) {
  const { 
    filters: { selectedGeneration, selectedType, searchText },
    setSelectedGeneration,
    setSelectedType,
    setSearchText
  } = useFilters();

  // Fetch generation-specific Pokemon when generation is selected
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

  // Update filtered list when generation data changes
  useEffect(() => {
    if (selectedGeneration === "") {
      if (initialPokemonList.length > 0) {
        setInitialPokemonList(initialPokemonList);
      }
    } else if (generationPokemonList) {
      setInitialPokemonList(generationPokemonList);
      setPokemonListFiltered(generationPokemonList);
    }
  }, [selectedGeneration, generationPokemonList, initialPokemonList, setInitialPokemonList, setPokemonListFiltered]);

  // Handle global search result
  useEffect(() => {
    if (globalPokemonResult) {
      // Add the globally found Pokemon to the filtered list
      setPokemonListFiltered([globalPokemonResult]);
    }
  }, [globalPokemonResult, setPokemonListFiltered]);

  // Reapply filters when component mounts if there are active filter states
  useEffect(() => {
    if (initialPokemonList.length > 0) {
      // Check if we have active filters that need to be reapplied
      const hasActiveTypeFilter = selectedType !== "";
      const hasActiveSearchFilter = searchText !== "";
      
      if (hasActiveTypeFilter || hasActiveSearchFilter) {
        // Reapply filters using the existing logic
        applyCurrentFilters();
      }
    }
  }, [initialPokemonList.length]); // Only run when initialPokemonList is first populated

  // Pure function to apply type filter
  const applyTypeFilter = (pokemonList: Pokemon[], typeId: string): Pokemon[] => {
    if (typeId === "") {
      return pokemonList;
    }
    return pokemonList.filter(
      (pokemon) => pokemon.types.some((type) => type.id === parseInt(typeId))
    );
  };

  // Pure function to apply search filter (includes evolution chains)
  const applySearchFilter = (pokemonList: Pokemon[], searchTerm: string): Pokemon[] => {
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
  };

  const applyCurrentFilters = () => {
    applyAllFilters();
  };

  // Common function to apply all filters with optional overrides
  const applyAllFilters = (typeOverride?: string, searchOverride?: string) => {
    let listToFilter = selectedGeneration !== "" && generationPokemonList 
      ? generationPokemonList 
      : initialPokemonList;

    // Apply type filter (use override if provided, otherwise current state)
    const typeToUse = typeOverride ?? selectedType;
    listToFilter = applyTypeFilter(listToFilter, typeToUse);
    
    // Apply search filter (use override if provided, otherwise current state)
    const searchToUse = searchOverride ?? searchText;
    listToFilter = applySearchFilter(listToFilter, searchToUse);

    setPokemonListFiltered(listToFilter);
  };

  const handleGenerationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGeneration(event.target.value);
    // Reset type filter when generation changes
    setSelectedType("");
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
    applyAllFilters(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    applyAllFilters(undefined, event.target.value);
  };

  const handleGlobalSearch = () => {
    if (searchText.trim()) {
      void searchGlobalPokemon();
    }
  };

  // Check if we should show the global search button
  const shouldShowGlobalSearchButton = 
    searchText.trim().length > 0 && 
    filteredPokemonList.length === 0 && 
    !pokemonLoading && 
    !globalSearchLoading &&
    !globalSearchIsError; // Don't show button if there's an error

  // Check if we should show the error message
  const shouldShowErrorMessage = 
    globalSearchIsError && 
    searchText.trim().length > 0 && 
    !globalSearchLoading;

  // Get error message based on error type
  const getErrorMessage = () => {
    if (!globalSearchError) return "";
    
    // Check if it's a "NOT_FOUND" error
    if (globalSearchError.data?.code === "NOT_FOUND") {
      return `Pokemon "${searchText}" not found. Please check the spelling and try again.`;
    }
    
    // Handle other types of errors
    return `Error searching for Pokemon: ${globalSearchError.message}`;
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
      {/* Loading Overlay */}
      {(pokemonLoading || globalSearchLoading) && (
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
            disabled={pokemonLoading || globalSearchLoading}
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
            disabled={pokemonLoading || globalSearchLoading}
          >
            <option key="all-types" value="">All Types</option>
            {types.map((type) => (
              <option key={`type-${type.id}`} value={type.id}>
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
          disabled={pokemonLoading || globalSearchLoading}
        />
        <p className="mt-1 text-xs text-gray-500">
          Type to search Pokemon names and their evolutions in real time
        </p>
        
        {/* Global Search Button */}
        {shouldShowGlobalSearchButton && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700 mb-2">
              No results found in current selection. Search globally for &ldquo;{searchText}&rdquo;?
            </p>
            <button
              onClick={handleGlobalSearch}
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Search globally for &ldquo;{searchText}&rdquo;
            </button>
          </div>
        )}

        {/* Error Message */}
        {shouldShowErrorMessage && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">
                  Search Error
                </p>
                <p className="text-sm text-red-600 mt-1">
                  {getErrorMessage()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}