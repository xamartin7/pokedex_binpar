
import { PokemonList } from "./PokemonList";
import { Filters } from "./filters/Filters";
import { api } from "@/trpc/server";



export async function PokemonPageClient() {
  const allPokemonData = await api.pokemon.getAllPokemonData()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters - Left Side */}
        <div className="lg:w-1/4 flex-shrink-0">
          <Filters generations={allPokemonData.generations} types={allPokemonData.typesByGeneration.flatMap(generation => generation.types)} />
        </div>
        
        {/* Pokemon List - Right Side */}
        <div className="lg:w-3/4 flex-grow">
          <PokemonList
            pokemonList={allPokemonData.pokemonList}
            generations={allPokemonData.generations}
            types={allPokemonData.typesByGeneration.flatMap(generation => generation.types)}
        />
        </div>
      </div>
    </div>
  );
}
