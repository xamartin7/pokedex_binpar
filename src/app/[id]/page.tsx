import { api } from "@/trpc/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Type } from "@/server/modules/types/domain/entities/Type";
import StatBar from "../_components/details/StatBar";
import { EvolutionChain } from "../_components/details/EvolutionChain";

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