import type { Pokemon } from "../entities/Pokemon";

export interface IPokemonFactory {
    /**
     * Create a pokemon object by factory pattern with a pokemon id, allowing to implement another factories
     * for example create a pokemon from a database or a file
     * @param pokemonId - The id of the pokemon
     * @returns A pokemon object
     */
    createPokemon(pokemonId: number): Promise<Pokemon>;

    /**
     * Create a pokemon object by factory pattern with a pokemon name, allowing to implement another factories
     * for example create a pokemon from a database or a file
     * @param pokemonName - The name of the pokemon
     * @returns A pokemon object
     */
    createPokemonByName(pokemonName: string): Promise<Pokemon>;
}