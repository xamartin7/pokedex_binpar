"use client";

import { PokemonCard } from "./PokemonCard";
import { PaginationSection } from "./PaginationSection";
import { useFilters } from "@/contexts/FilterContext";


export function PokemonList() {
  const { pokemonData } = useFilters();

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