import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import Image from "next/image";
import Link from "next/link";

const typeColors: Record<string, string> = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-500",
  psychic: "bg-purple-500",
  ice: "bg-cyan-500",
  dragon: "bg-indigo-500",
  dark: "bg-gray-800",
  fairy: "bg-pink-500",
  normal: "bg-gray-500",
  fighting: "bg-red-700",
  poison: "bg-purple-700",
  ground: "bg-yellow-700",
  flying: "bg-blue-300",
  bug: "bg-green-700",
  rock: "bg-yellow-800",
  ghost: "bg-purple-800",
  steel: "bg-gray-600",
};

export function PokemonCard({pokemon}: {pokemon: Pokemon}) {
  return (
    <Link href={`/${pokemon.id}`} className="block hover:scale-105 transition-transform duration-100">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-100 overflow-hidden border border-gray-200 cursor-pointer">
        <div className="relative h-32 bg-gray-50 flex items-center justify-center">
          <Image 
            src={pokemon.image} 
            alt={pokemon.name} 
            width={80} 
            height={80}
            className="object-contain hover:scale-110 transition-transform duration-100"
          />
        </div>
        
        <div className="p-3">
          <h3 className="text-lg font-bold text-gray-800 mb-2 capitalize">
            {pokemon.name}
          </h3>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 font-medium">Type:</span>
              <div className="flex gap-1 flex-wrap">
                {pokemon.types.map((type) => {
                  const typeColor = typeColors[type.name.toLowerCase()] ?? "bg-gray-500";
                  return (
                    <span 
                      key={type.id}
                      className={`px-2 py-0.5 rounded-full text-white text-xs font-medium ${typeColor} capitalize`}
                    >
                      {type.name}
                    </span>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 font-medium">Generation:</span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                {pokemon.generation.name}
              </span>
            </div>
          </div>
          
          <div className="mt-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}