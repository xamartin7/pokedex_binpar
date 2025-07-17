import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";

export interface IGetPokemonListUseCase {
  execute(): Promise<Pokemon[]>;
}