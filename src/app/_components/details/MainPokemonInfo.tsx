import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import type { Type } from "@/server/modules/types/domain/entities/Type";
import Image from "next/image";

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

export function MainPokemonInfo({ pokemonDetails }: { pokemonDetails: Pokemon }) {
  return (
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
  );
}