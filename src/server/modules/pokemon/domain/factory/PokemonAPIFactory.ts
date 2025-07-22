import type { IPokeApiRepository } from "../../infrastructure/interfaces/IPokeApiRepository";
import type { Pokemon } from "../entities/Pokemon";
import type { IPokemonFactory } from "./IPokemonFactory";

export class PokemonAPIFactory implements IPokemonFactory {

    private pokeApiRepository: IPokeApiRepository

    public constructor(pokeApiRepository: IPokeApiRepository) {
        this.pokeApiRepository = pokeApiRepository
    }

    async createPokemon(pokemonId: number): Promise<Pokemon> {
        try {
            return this.buildPokemon(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`, `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
        } catch (error) {
            console.error('Error creating pokemon by id:', error)
            throw error
        }
    }

    async createPokemonByName(pokemonName: string): Promise<Pokemon> {
        try {
            return this.buildPokemon(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`, `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
        } catch (error) {
            console.error('Error creating pokemon by name:', error)
            throw error
        }
    }

    private async buildPokemon(detailsUrl: string, speciesUrl: string): Promise<Pokemon> {
        const pokemonDetails = await this.pokeApiRepository.getPokemonDetails(detailsUrl)
        const pokemonSpecies = await this.pokeApiRepository.getPokemonSpecies(speciesUrl)

        const pokemon: Pokemon = {
            id: Number(pokemonDetails.id),
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