"use client";

import { api } from "@/trpc/react";
import { InitialLoading } from "./_components/InitialLoading";
import { PokemonList } from "./_components/PokemonList";
import { TitlePage } from "./_components/TitlePage";
import { useEffect, useState } from "react";

const DEFAULT_GENERATION_ID = 1;

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  
  // Load data with individual loading states and custom cache settings
  const { data: generations, isLoading: generationsLoading } = api.pokemon.getGenerations.useQuery(
    undefined, // no input parameters
  );
  
  const { data: types, isLoading: typesLoading } = api.pokemon.getTypes.useQuery(
    { generationId: DEFAULT_GENERATION_ID },
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

  useEffect(() => {
    if (allDataLoaded) {
      // Small delay to ensure smooth transition
      //const timer = setTimeout(() => setShowContent(true), 100);
      setShowContent(true);
      //return () => clearTimeout(timer);
    }
  }, [allDataLoaded]);

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
      <PokemonList 
        initialData={{ 
          pokemonList: pokemonList ?? [], 
          generations: generations ?? [], 
          types: types ?? [] 
        }} 
      />
    </div>
  );
}