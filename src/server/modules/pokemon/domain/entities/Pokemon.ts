import type { Generation } from "@/server/modules/generations/domain/entities/Generation";
import type { Type } from "@/server/modules/types/domain/entities/Type";

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: Type[];
  generation: Generation;
  evolutionChain: Pokemon[];
  evolutionChainUrl: string;
  stats: PokemonStat[]
}

export interface PokemonStat {
  base_stat: number,
  effort: number,
  stat: {
    name: string,
    url: string
  }
}