import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";

export function PokemonCard({pokemon}: {pokemon: Pokemon}) {
  return (
    <div>
      <h1>{pokemon.name}</h1>
    </div>
  );
}