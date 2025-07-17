import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";

export interface IGetPokemonsRepository {
  findAllByGeneration(generationId: number): Promise<Pokemon[]>;
  findById(id: string): Promise<Pokemon | null>;
}