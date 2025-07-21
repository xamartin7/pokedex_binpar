import type { Generation } from "@/server/modules/generations/domain/entities/Generation";
import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import { useState } from "react";
import { PokemonCard } from "./PokemonCard";
import type { Type } from "@/server/modules/types/domain/entities/Type";
import { PaginationSection } from "./PaginationSection";
import { Filters } from "./Filters";

interface PokemonListProps {
  initialData: {
    pokemonList: Pokemon[];
    generations: Generation[];
    types: Type[];
  };
}

export function PokemonList({initialData}: PokemonListProps) {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>(initialData.pokemonList);
  const [pokemonListFiltered, setPokemonListFiltered] = useState<Pokemon[]>(initialData.pokemonList);
  const [generations, setGenerations] = useState<Generation[]>(initialData.generations);
  const [types, setTypes] = useState<Type[]>(initialData.types);
  const [paginatedData, setPaginatedData] = useState<Pokemon[]>(initialData.pokemonList.slice(0, 12));

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <Filters generations={generations} types={types} pokemonList={pokemonList} setPokemonList={setPokemonListFiltered} />

        {/* Pagination Section */}
        <div className="mb-6">
          <PaginationSection
            pokemonList={pokemonListFiltered}
            onPaginatedDataChange={setPaginatedData}
            initialPageSize={12}
          />
        </div>

        {/* Pokemon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedData.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      </div>
    </div>
  );
}