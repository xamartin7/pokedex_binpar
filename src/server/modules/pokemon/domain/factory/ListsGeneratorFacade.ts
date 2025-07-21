import type { IPokeApiRepository } from "../../infrastructure/interfaces/IPokeApiRepository";
import type { Pokemon } from "../entities/Pokemon";
import type { IPokemonFactory } from "./IPokemonFactory";

export class ListsGeneratorFacade {
    private pokemonFactory: IPokemonFactory
    private pokeApiRepository: IPokeApiRepository

    public constructor(pokemonFactory: IPokemonFactory, pokeApiRepository: IPokeApiRepository) {
        this.pokemonFactory = pokemonFactory
        this.pokeApiRepository = pokeApiRepository
    }

    async generateListByGeneration(generationId: number): Promise<Pokemon[]> {
        const generation = await this.pokeApiRepository.getOneGeneration(`https://pokeapi.co/api/v2/generation/${generationId}`)
        const pokemons = await Promise.all(generation.pokemon_species.map(async (pokemon) => {
            const pokemonId = Number(pokemon.url.split('/')[6])
            return this.pokemonFactory.createPokemon(pokemonId)
        }))
        
        pokemons.sort((a, b) => a.id - b.id)
        return pokemons
    }
}