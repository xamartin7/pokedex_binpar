import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import Image from "next/image";
import Link from "next/link";

export function ReturnOriginEvolutionButton({ originPokemon }: { originPokemon: Pokemon }) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
            <Link 
            href={`/${originPokemon.id}`}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
            >
            <svg 
                className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
                />
            </svg>
            <div className="flex items-center">
                <div className="relative w-10 h-10 mr-3">
                <Image
                    src={originPokemon.image}
                    alt={originPokemon.name}
                    fill
                    className="object-contain"
                />
                </div>
                <div>
                <span className="font-medium text-sm text-gray-600">Back to origin</span>
                <p className="font-bold text-lg capitalize">
                    {originPokemon.name} (#{originPokemon.id})
                </p>
                </div>
            </div>
            </Link>
            <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
            🏠 Origin
            </div>
        </div>
    </div>
  );
}