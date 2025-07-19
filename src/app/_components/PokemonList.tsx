import type { Generation } from "@/server/modules/generations/domain/entities/Generation";
import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import { useState } from "react";
import { PokemonCard } from "./PokemonCard";
import type { Type } from "@/server/modules/types/domain/entities/Type";

export function PokemonList({initialData}: {initialData: {pokemonList: Pokemon[], generations: Generation[], types: Type[]}}) {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>(initialData.pokemonList);
  const [generations, setGenerations] = useState<Generation[]>(initialData.generations);
  const [types, setTypes] = useState<Type[]>(initialData.types);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pokemonList.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
}