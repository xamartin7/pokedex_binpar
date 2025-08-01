import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";

export interface IGetPokemonListUseCase {
  getByGeneration(generationId: number): Promise<Pokemon[]>;
  getAllPokemons(): Promise<Pokemon[]>;
}