import type { Pokemon } from "../entities/Pokemon";

export interface IPokemonsDataGeneratorFacade {
    generateListByGeneration(generationId: number): Promise<Pokemon[]>;
    getPokemonDetails(id: number): Promise<Pokemon>;
    getPokemonsDetailsByName(name: string): Promise<Pokemon[]>;
    generateAllPokemons(): Promise<Pokemon[]>;
}