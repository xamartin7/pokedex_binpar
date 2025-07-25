import type { Pokemon } from "../entities/Pokemon";

export interface IPokemonGraphQLFactory {
    createAllPokemons(): Promise<Pokemon[]>;
}