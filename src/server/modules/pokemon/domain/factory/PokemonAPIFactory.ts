import type { IPokeApiRepository } from "../../infrastructure/interfaces/IPokeApiRepository";
import type { Pokemon } from "../entities/Pokemon";
import type { IPokemonFactory } from "./IPokemonFactory";

export class PokemonAPIFactory implements IPokemonFactory {

    private pokeApiRepository: IPokeApiRepository

    public constructor(pokeApiRepository: IPokeApiRepository) {
        this.pokeApiRepository = pokeApiRepository
    }

    async createPokemon(pokemonId: number): Promise<Pokemon> {
        const pokemonDetails = await this.pokeApiRepository.getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        const pokemonSpecies = await this.pokeApiRepository.getPokemonSpecies(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
        
        // TODO Evolution chain

        const pokemon: Pokemon = {
            id: pokemonId,
            name: pokemonDetails.name,
            image: pokemonDetails.sprites.front_default ?? '',
            types: pokemonDetails.types.map((type) => type.type.name),
            generation: pokemonSpecies.generation.name,
            evolutionChain: []
        }

        return pokemon
    }
}