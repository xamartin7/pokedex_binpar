"use client";

import { api } from "@/trpc/react";
import { InitialLoading } from "./_components/InitialLoading";
import { PokemonList } from "./_components/PokemonList";
import { TitlePage } from "./_components/TitlePage";

const DEFAULT_GENERATION_ID = 1;

export default function Home() {
  // TODO Show initial loading at first and then load the pokemon list??
  // TODO prefetch the pokemon list of the other generations ??

  // TODO Use cache
  const { data: generations, isLoading: generationsLoading } = api.pokemon.getGenerations.useQuery();
  const { data: types, isLoading: typesLoading } = api.pokemon.getTypes.useQuery({ generationId: DEFAULT_GENERATION_ID });
  const { data: pokemonList, isLoading: pokemonLoading } = api.pokemon.getPokemonList.useQuery({ generationId: DEFAULT_GENERATION_ID });

  console.log('pokemonList', pokemonList);

  const isLoading = pokemonLoading || generationsLoading || typesLoading;

  if (isLoading) {
    return <InitialLoading />;
  }

  return (
    <div className="min-h-screen py-8">
      <TitlePage title="Pokédex" />
      <PokemonList initialData={{ pokemonList: pokemonList ?? [], generations: generations ?? [], types: types ?? [] }} />
    </div>
  );
}