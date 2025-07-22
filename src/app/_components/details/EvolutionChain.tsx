import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import Image from "next/image";
import Link from "next/link";

export function EvolutionChain({ 
  evolutionChain, 
  currentPokemonId,
  originId
}: { 
  evolutionChain: Pokemon[];
  currentPokemonId: number;
  originId?: number;
}) {
    if (!evolutionChain || evolutionChain.length <= 1) {
      return null;
    }
  
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Evolution Chain</h3>
        <div className="flex items-center justify-center space-x-4 overflow-x-auto">
          {evolutionChain.map((pokemon, index) => (
            <div key={pokemon.id} className="flex items-center">
              <Link 
                href={`/${pokemon.id}${pokemon.id !== currentPokemonId ? `?originId=${originId ?? currentPokemonId}` : ''}`} 
                className="group"
              >
                <div className="text-center flex-shrink-0 cursor-pointer transition-transform hover:scale-105">
                  <div className="relative w-20 h-20 mx-auto mb-2 group-hover:drop-shadow-lg transition-all">
                    <Image
                      src={pokemon.image}
                      alt={pokemon.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-900 capitalize group-hover:text-blue-600 transition-colors">
                    {pokemon.name}
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors">#{pokemon.id}</p>
                </div>
              </Link>
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