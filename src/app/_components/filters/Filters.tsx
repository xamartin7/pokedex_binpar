"use client";

import { useEffect } from "react";
import type { Generation } from "@/server/modules/generations/domain/entities/Generation";
import type { Type } from "@/server/modules/types/domain/entities/Type";
import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import { api } from "@/trpc/react";
import { useFilters } from "@/contexts/FilterContext";
import { GenerationFilter } from "./GenerationFilter";
import { TypeFilter } from "./TypeFilter";
import { SearchFilters } from "./SearchFilters";

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
      setPokemonListFiltered(globalPokemonResult);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Handler functions for child components
  const handleGenerationChange = (generationId: string) => {
    setSelectedGeneration(generationId);
    // Reset type filter when generation changes
    setSelectedType("");
  };

  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);
    applyAllFilters(typeId);
  };

  const handleSearchChange = (searchValue: string) => {
    setSearchText(searchValue);
    applyAllFilters(undefined, searchValue);
  };

  const handleGlobalSearch = () => {
    if (searchText.trim()) {
      void searchGlobalPokemon();
    }
  };

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
          generations={generations}
          selectedGeneration={selectedGeneration}
          onGenerationChange={handleGenerationChange}
          disabled={isLoading}
        />
        
        <TypeFilter
          types={types}
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          disabled={isLoading}
        />
      </div>

      <SearchFilters
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onGlobalSearch={handleGlobalSearch}
        filteredPokemonList={filteredPokemonList}
        disabled={isLoading}
        globalSearchLoading={globalSearchLoading}
        globalSearchError={globalSearchError}
        globalSearchIsError={globalSearchIsError}
      />
    </div>
  );
}