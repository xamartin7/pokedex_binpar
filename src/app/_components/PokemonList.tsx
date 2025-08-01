"use client";

import { PokemonCard } from "./PokemonCard";
import { PaginationSection } from "./PaginationSection";
import { useFilters } from "@/contexts/FilterContext";
import { useEffect } from "react";
import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import type { Generation } from "@/server/modules/generations/domain/entities/Generation";
import type { Type } from "@/server/modules/types/domain/entities/Type";


export function PokemonList({ pokemonList, generations, types }: { pokemonList: Pokemon[], generations: Generation[], types: Type[] }) {
  const { initializePokemonData, pokemonData } = useFilters();

  useEffect(() => {
    initializePokemonData({
      pokemonList,
      generations,
      types,
    })
  }, [pokemonList, generations, types, initializePokemonData])

  return (
    <div className="space-y-6">
      {/* Pagination Section */}
      <div id="pagination-section" className="scroll-mt-4">
        <PaginationSection
          pokemonList={pokemonData.filteredList}
        />
      </div>

      {/* Pokemon Grid */}
      <div
        id="pokemon-list-container"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {pokemonData.paginatedList.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
}