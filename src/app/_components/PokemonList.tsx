"use client";

import { PokemonCard } from "./PokemonCard";
import { PaginationSection } from "./PaginationSection";
import { Filters } from "./filters/Filters";
import { useFilters } from "@/contexts/FilterContext";


export function PokemonList() {
  const { pokemonData } = useFilters();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <Filters />

        {/* Pagination Section */}
        <div id="pagination-section" className="mb-6 scroll-mt-4">
          <PaginationSection
            pokemonList={pokemonData.filteredList}
          />
        </div>

        {/* Pokemon Grid */}
        <div
          id="pokemon-list-container"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pokemonData.paginatedList.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      </div>
    </div>
  );
}