"use client";

import { api } from "@/trpc/react";
import { InitialLoading } from "./_components/InitialLoading";

export default function Home() {
  // TODO Use cache
  const { data: pokemonList, isLoading: pokemonLoading } = api.pokemon.getPokemonList.useQuery({ generationId: 1 });
  const { data: generations, isLoading: generationsLoading } = api.pokemon.getGenerations.useQuery();
  const { data: types, isLoading: typesLoading } = api.pokemon.getTypes.useQuery({ generationId: 1 });

  const isLoading = pokemonLoading || generationsLoading || typesLoading;

  if (isLoading) {
    return <InitialLoading />;
  }

  return (
    <div>
      <h1>Hello World</h1>
      <pre>{JSON.stringify(pokemonList, null, 2)}</pre>
      <pre>{JSON.stringify(generations, null, 2)}</pre>
      <pre>{JSON.stringify(types, null, 2)}</pre>
    </div>
  );
}