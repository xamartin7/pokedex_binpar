"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import type { Generation } from "@/server/modules/generations/domain/entities/Generation";
import type { Type } from "@/server/modules/types/domain/entities/Type";

interface FilterState {
  selectedGeneration: string;
  selectedType: string;
  searchText: string;
  currentPage: number;
  pageSize: number;
}

interface PokemonDataState {
  originalList: Pokemon[];
  filteredList: Pokemon[];
  paginatedList: Pokemon[];
  generations: Generation[];
  types: Type[];
  isLoading: boolean;
  globalSearchResults: Pokemon[] | null;
}

interface FilterContextType {
  filters: FilterState;
  pokemonData: PokemonDataState;
  // Filter actions
  setSelectedGeneration: (value: string) => void;
  setSelectedType: (value: string) => void;
  setSearchText: (value: string) => void;
  setCurrentPage: (value: number) => void;
  setPageSize: (value: number) => void;
  resetFilters: () => void;
  // Pokemon data actions
  initializePokemonData: (data: {
    pokemonList: Pokemon[];
    generations: Generation[];
    types: Type[];
  }) => void;
  updateFilteredList: (pokemonList: Pokemon[]) => void;
  updatePaginatedList: (pokemonList: Pokemon[]) => void;
  setLoading: (loading: boolean) => void;
  setGlobalSearchResults: (results: Pokemon[] | null) => void;
  // Utility functions
  applyFilters: () => void;
}

const defaultFilterState: FilterState = {
  selectedGeneration: "1", // Default to first generation
  selectedType: "",
  searchText: "",
  currentPage: 1,
  pageSize: 12,
};

const defaultPokemonDataState: PokemonDataState = {
  originalList: [],
  filteredList: [],
  paginatedList: [],
  generations: [],
  types: [],
  isLoading: false,
  globalSearchResults: null,
};

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);
  const [pokemonData, setPokemonData] = useState<PokemonDataState>(defaultPokemonDataState);

  const setSelectedGeneration = useCallback((value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      selectedGeneration: value,
      selectedType: "", // Reset type when generation changes
      searchText: "", // Reset search when generation changes
      currentPage: 1 // Reset page when filters change
    }));
  }, []);

  const setSelectedType = useCallback((value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      selectedType: value,
      currentPage: 1 // Reset page when filters change
    }));
  }, []);

  const setSearchText = useCallback((value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      searchText: value,
      currentPage: 1 // Reset page when filters change
    }));
  }, []);

  const setCurrentPage = useCallback((value: number) => {
    setFilters(prev => ({ ...prev, currentPage: value }));
  }, []);

  const setPageSize = useCallback((value: number) => {
    setFilters(prev => ({ ...prev, pageSize: value, currentPage: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilterState);
    setPokemonData(prev => ({
      ...prev,
      filteredList: prev.originalList,
      globalSearchResults: null,
    }));
  }, []);

  const initializePokemonData = useCallback((data: {
    pokemonList: Pokemon[];
    generations: Generation[];
    types: Type[];
  }) => {
    setPokemonData(prev => ({
      ...prev,
      originalList: data.pokemonList,
      filteredList: data.pokemonList,
      generations: data.generations,
      types: data.types,
    }));
  }, []);

  const updateFilteredList = useCallback((pokemonList: Pokemon[]) => {
    setPokemonData(prev => ({
      ...prev,
      filteredList: pokemonList,
    }));
  }, []);

  const updatePaginatedList = useCallback((pokemonList: Pokemon[]) => {
    setPokemonData(prev => ({
      ...prev,
      paginatedList: pokemonList,
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setPokemonData(prev => ({
      ...prev,
      isLoading: loading,
    }));
  }, []);

  const setGlobalSearchResults = useCallback((results: Pokemon[] | null) => {
    setPokemonData(prev => ({
      ...prev,
      globalSearchResults: results,
    }));
    // If we have global search results, update the filtered list
    if (results) {
      updateFilteredList(results);
    }
  }, [updateFilteredList]);

  // Pure filter functions
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

  const applyFilters = useCallback(() => {
    // If we have global search results, don't apply local filters
    if (pokemonData.globalSearchResults) {
      return;
    }

    let listToFilter = pokemonData.originalList;

    // Apply type filter
    listToFilter = applyTypeFilter(listToFilter, filters.selectedType);
    
    // Apply search filter
    listToFilter = applySearchFilter(listToFilter, filters.searchText);

    updateFilteredList(listToFilter);
  }, [pokemonData.originalList, pokemonData.globalSearchResults, filters.selectedType, filters.searchText, applyTypeFilter, applySearchFilter, updateFilteredList]);

  return (
    <FilterContext.Provider value={{
      filters,
      pokemonData,
      setSelectedGeneration,
      setSelectedType,
      setSearchText,
      setCurrentPage,
      setPageSize,
      resetFilters,
      initializePokemonData,
      updateFilteredList,
      updatePaginatedList,
      setLoading,
      setGlobalSearchResults,
      applyFilters,
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
} 