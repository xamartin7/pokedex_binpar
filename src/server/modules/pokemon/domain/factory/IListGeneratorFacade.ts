import type { Pokemon } from "../entities/Pokemon";

export interface IListGeneratorFacade {
    generateListByGeneration(generationId: number): Promise<Pokemon[]>;
    getPokemonDetails(id: number): Promise<Pokemon>;
}