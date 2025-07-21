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

        const pokemon: Pokemon = {
            id: pokemonId,
            name: pokemonDetails.name,
            image: pokemonDetails.sprites.front_default ?? '',
            types: pokemonDetails.types.map((type) => ({
                id: Number(type.type.url.split('/')[6]),
                name: type.type.name,
                url: type.type.url
            })),
            generation: {
                id: Number(pokemonSpecies.generation.url.split('/')[6]),
                name: pokemonSpecies.generation.name,
                url: pokemonSpecies.generation.url
            },
            evolutionChain: [],
            evolutionChainUrl: pokemonSpecies.evolution_chain.url,
            stats: pokemonDetails.stats.map((stat) => ({
                base_stat: stat.base_stat,
                effort: stat.effort,
                stat: {
                    name: stat.stat.name,
                    url: stat.stat.url
                }
            }))
        }

        return pokemon
    }
}