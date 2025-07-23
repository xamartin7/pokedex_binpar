"use client";

import { api } from "@/trpc/react";
import { InitialLoading } from "./_components/InitialLoading";
import { PokemonList } from "./_components/PokemonList";
import { TitlePage } from "./_components/TitlePage";
import { useEffect, useState } from "react";
import { useFilters } from "@/contexts/FilterContext";

const DEFAULT_GENERATION_ID = 1;

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const { initializePokemonData, applyFilters, pokemonData } = useFilters();
  
  // Load initial data with default generation
  const { data: generations, isLoading: generationsLoading } = api.pokemon.getGenerations.useQuery(
    undefined, // no input parameters
    {
      enabled: true,
      staleTime: 60 * 60 * 1000, // 1 hour cache
      gcTime: 60 * 60 * 1000 * 24, // 24 hours cache
    }
  );
  
  const { data: types, isLoading: typesLoading } = api.pokemon.getTypes.useQuery(
    { generationId: DEFAULT_GENERATION_ID },
    {
      enabled: true,
      staleTime: 60 * 60 * 1000, // 1 hour cache
      gcTime: 60 * 60 * 1000 * 24, // 24 hours cache
    }
  );
  
  const { data: pokemonList, isLoading: pokemonLoading } = api.pokemon.getPokemonList.useQuery(
    { generationId: DEFAULT_GENERATION_ID },
    {
      enabled: true,
      staleTime: 60 * 60 * 1000, // 1 hour cache
      gcTime: 60 * 60 * 1000 * 24, // 24 hours cache
    }
  );

  // Check if all essential data is loaded
  const allDataLoaded = !pokemonLoading && !generationsLoading && !typesLoading && 
                       generations && types && pokemonList;

  // Initialize context with data when all data is loaded
  useEffect(() => {
    if (allDataLoaded && pokemonData.originalList.length === 0 && pokemonList && generations && types) {
      initializePokemonData({
        pokemonList,
        generations,
        types
      });
    }
  }, [allDataLoaded, pokemonList, generations, types, initializePokemonData, pokemonData.originalList.length]);

  // Apply initial filters when data is initialized
  useEffect(() => {
    if (pokemonData.originalList.length > 0) {
      applyFilters();
    }
  }, [pokemonData.originalList.length, applyFilters]);

  useEffect(() => {
    if (allDataLoaded && pokemonData.originalList.length > 0) {
      setShowContent(true);
    }
  }, [allDataLoaded, pokemonData.originalList.length]);

  // Show loading spinner immediately
  if (!showContent) {
    return (
      <div className="min-h-screen py-8">
        <TitlePage title="Pokédex" />
        <InitialLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <TitlePage title="Pokédex" />
      <PokemonList />
    </div>
  );
}