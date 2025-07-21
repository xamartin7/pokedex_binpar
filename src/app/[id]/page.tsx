import { api } from "@/trpc/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Pokemon, PokemonStat } from "@/server/modules/pokemon/domain/entities/Pokemon";
import type { Type } from "@/server/modules/types/domain/entities/Type";

interface PageProps {
  params: { id: string };
}

function TypeBadge({ type }: { type: Type }) {
  const getTypeColor = (typeName: string) => {
    const colors: Record<string, string> = {
      normal: "bg-gray-400",
      fire: "bg-red-500",
      water: "bg-blue-500",
      electric: "bg-yellow-400",
      grass: "bg-green-500",
      ice: "bg-blue-300",
      fighting: "bg-red-700",
      poison: "bg-purple-500",
      ground: "bg-yellow-600",
      flying: "bg-indigo-400",
      psychic: "bg-pink-500",
      bug: "bg-green-400",
      rock: "bg-yellow-800",
      ghost: "bg-purple-700",
      dragon: "bg-indigo-700",
      dark: "bg-gray-800",
      steel: "bg-gray-500",
      fairy: "bg-pink-300",
    };
    return colors[typeName.toLowerCase()] ?? "bg-gray-400";
  };

  return (
    <span 
      className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${getTypeColor(type.name)}`}
    >
      {type.name}
    </span>
  );
}

function StatBar({ stat }: { stat: PokemonStat }) {
  const getStatColor = (value: number) => {
    if (value >= 100) return "bg-green-500";
    if (value >= 80) return "bg-yellow-500";
    if (value >= 60) return "bg-orange-500";
    return "bg-red-500";
  };

  const maxStat = 200; // Maximum possible stat value for width calculation
  const percentage = Math.min((stat.base_stat / maxStat) * 100, 100);

  return (
    <div className="flex items-center space-x-3">
      <span className="w-20 text-sm font-medium text-gray-700 capitalize">
        {stat.stat.name.replace('-', ' ')}
      </span>
      <div className="flex-1 bg-gray-200 rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all duration-300 ${getStatColor(stat.base_stat)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-12 text-sm font-bold text-gray-800">
        {stat.base_stat}
      </span>
    </div>
  );
}

function EvolutionChain({ evolutionChain }: { evolutionChain: Pokemon[] }) {
  if (!evolutionChain || evolutionChain.length <= 1) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Evolution Chain</h3>
      <div className="flex items-center justify-center space-x-4 overflow-x-auto">
        {evolutionChain.map((pokemon, index) => (
          <div key={pokemon.id} className="flex items-center">
            <div className="text-center flex-shrink-0">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <Image
                  src={pokemon.image}
                  alt={pokemon.name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {pokemon.name}
              </p>
              <p className="text-xs text-gray-500">#{pokemon.id}</p>
            </div>
            {index < evolutionChain.length - 1 && (
              <svg 
                className="w-6 h-6 text-gray-400 mx-2 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function PokemonDetailPage({ params }: PageProps) {
  const { id } = params;
  const pokemonId = Number(id);

  if (isNaN(pokemonId)) {
    notFound();
  }

  try {
    const pokemonDetails = await api.pokemon.getPokemonDetails({ id: pokemonId });

    if (!pokemonDetails) {
      notFound();
    }

    return (
      <div className="space-y-8">
        {/* Main Pokemon Info */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold capitalize mb-2">
                  {pokemonDetails.name}
                </h1>
                <p className="text-blue-100 text-lg">
                  #{pokemonDetails.id.toString().padStart(3, '0')}
                </p>
                <p className="text-blue-100">
                  Generation {pokemonDetails.generation.name}
                </p>
              </div>
              <div className="relative w-32 h-32">
                <Image
                  src={pokemonDetails.image}
                  alt={pokemonDetails.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Types</h3>
              <div className="flex gap-2">
                {pokemonDetails.types.map((type, index) => (
                  <TypeBadge key={index} type={type} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
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

        {/* Evolution Chain */}
        <EvolutionChain evolutionChain={pokemonDetails.evolutionChain} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching Pokemon details:', error);
    notFound();
  }
}