import type { IPokeApiRepository, PokemonDetailsResponse, PokemonSpeciesResponse } from "../../infrastructure/interfaces/IPokeApiRepository";
import type { Pokemon } from "../entities/Pokemon";
import type { IPokemonFactory } from "./IPokemonFactory";

export class PokemonAPIFactory implements IPokemonFactory {

    private pokeApiRepository: IPokeApiRepository

    public constructor(pokeApiRepository: IPokeApiRepository) {
        this.pokeApiRepository = pokeApiRepository
    }

    async createPokemon(pokemonId: number): Promise<Pokemon> {
        try {
            const pokemonDetails = await this.pokeApiRepository.getPokemonDetails(pokemonId)
            const pokemonSpecies = await this.pokeApiRepository.getPokemonSpecies(pokemonId)
            return this.buildPokemon(pokemonDetails, pokemonSpecies)
        } catch (error) {
            console.error('Error creating pokemon by id:', error)
            throw error
        }
    }

    async createPokemonByName(pokemonName: string): Promise<Pokemon> {
        try {
            const pokemonDetails = await this.pokeApiRepository.getPokemonDetailsByName(pokemonName)
            const pokemonSpecies = await this.pokeApiRepository.getPokemonSpeciesByName(pokemonName)
            return this.buildPokemon(pokemonDetails, pokemonSpecies)
        } catch (error) {
            console.error('Error creating pokemon by name:', error)
            throw error
        }
    }

    private async buildPokemon(pokemonDetails: PokemonDetailsResponse, pokemonSpecies: PokemonSpeciesResponse): Promise<Pokemon> {
        try {
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
        } catch (error) {
            if (error instanceof Error && error.message.includes('404')) {
                throw new Error('Pokemon not found')
            }
            console.error('Error building pokemon:', error)
            throw error
        }        
    }
}