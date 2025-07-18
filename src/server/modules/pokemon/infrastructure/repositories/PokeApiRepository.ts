import type { IPokeApiRepository, OneGenerationResponse, PokemonSpeciesResponse, GenerationsResponse, PokemonEvolutionChainResponse, PokemonDetailsResponse } from "../interfaces/IPokeApiRepository";

export class PokeApiRepository implements IPokeApiRepository {

    async getGenerations(): Promise<GenerationsResponse> {
        const response = await fetch('https://pokeapi.co/api/v2/generation')
        return response.json() as Promise<GenerationsResponse>
    }

    async getOneGeneration(url_generation: string): Promise<OneGenerationResponse> {
        const response = await fetch(url_generation)
        return response.json() as Promise<OneGenerationResponse>
    }

    async getPokemonSpecies(url: string): Promise<PokemonSpeciesResponse> {
        const response = await fetch(url)
        return response.json() as Promise<PokemonSpeciesResponse>
    }

    async getPokemonEvolutionChain(url: string): Promise<PokemonEvolutionChainResponse> {
        const response = await fetch(url)
        return response.json() as Promise<PokemonEvolutionChainResponse>
    }

    async getPokemonDetails(url: string): Promise<PokemonDetailsResponse> {
        const response = await fetch(url)
        return response.json() as Promise<PokemonDetailsResponse>
    }
}