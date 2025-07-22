import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import StatBar from "./StatBar";

export function PokemonStats({ pokemonDetails }: { pokemonDetails: Pokemon }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Base Stats</h3>
          <div className="space-y-3">
            {pokemonDetails.stats.map((stat, index) => (
              <StatBar key={index} stat={stat} />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total: {pokemonDetails.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}</span>
              <span>Average: {Math.round(pokemonDetails.stats.reduce((sum, stat) => sum + stat.base_stat, 0) / pokemonDetails.stats.length)}</span>
            </div>
          </div>
        </div>
  );
}