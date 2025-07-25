import type { IPokeApiGraphQLRepository } from "../../infrastructure/interfaces/IPokeApiGraphQLRepository";
import type { Pokemon } from "../entities/Pokemon";
import type { IPokemonGraphQLFactory } from "./IPokemonGraphQLFactory";

export class PokemonGraphQLFactory implements IPokemonGraphQLFactory {
    private pokeApiGraphQLRepository: IPokeApiGraphQLRepository

    public constructor(pokeApiGraphQLRepository: IPokeApiGraphQLRepository) {
        this.pokeApiGraphQLRepository = pokeApiGraphQLRepository;
    }

    async createAllPokemons(): Promise<Pokemon[]> {
        const allPokemons = await this.pokeApiGraphQLRepository.getAllPokemonsDetails();
        return [];
    }
}