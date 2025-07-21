import type { Generation } from "@/server/modules/generations/domain/entities/Generation";
import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import { useState, useMemo } from "react";
import { PokemonCard } from "./PokemonCard";
import type { Type } from "@/server/modules/types/domain/entities/Type";
import { PaginationSection } from "./PaginationSection";
import { Filters } from "./Filters";

export function PokemonList({initialData}: {initialData: {pokemonList: Pokemon[], generations: Generation[], types: Type[]}}) {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>(initialData.pokemonList);
  const [generations, setGenerations] = useState<Generation[]>(initialData.generations);
  const [types, setTypes] = useState<Type[]>(initialData.types);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return pokemonList.slice(startIndex, endIndex);
  }, [pokemonList, currentPage, pageSize]);

  const handlePaginationChange = (newCurrentPage: number, newPageSize: number) => {
    setCurrentPage(newCurrentPage);
    setPageSize(newPageSize);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <Filters generations={generations} types={types} pokemonList={pokemonList} setPokemonList={setPokemonList} />

        {/* Pagination Section */}
        <div className="mb-6">
          <PaginationSection
            pokemonList={pokemonList}
            onPaginationChange={handlePaginationChange}
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