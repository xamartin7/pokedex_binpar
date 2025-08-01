import type { IPokeApiRepository, OneGenerationResponse, PokemonSpeciesResponse, GenerationsResponse, PokemonEvolutionChainResponse, PokemonDetailsResponse, AllPokemonsResponse } from "../interfaces/IPokeApiRepository";

const POKEMON_API_URL = 'https://pokeapi.co/api/v2'
const POKEMON_SPECIES_API_URL = `${POKEMON_API_URL}/pokemon-species`
const POKEMON_EVOLUTION_CHAIN_API_URL = `${POKEMON_API_URL}/evolution-chain`
const POKEMON_DETAILS_API_URL = `${POKEMON_API_URL}/pokemon`
const POKEMON_GENERATION_API_URL = `${POKEMON_API_URL}/generation`

const LIMIT_POKEMONS = 1025

export class PokeApiRepository implements IPokeApiRepository {

    async getGenerations(): Promise<GenerationsResponse> {
        try {
            const response = await this.fetchWithRetry(POKEMON_GENERATION_API_URL);
            return response.json() as Promise<GenerationsResponse>;
        } catch (error) {
            console.error('Error fetching generations:', error);
            throw error;
        }
    }

    async getOneGeneration(id: number): Promise<OneGenerationResponse> {
        try {
            const response = await this.fetchWithRetry(`${POKEMON_GENERATION_API_URL}/${id}`);
            return response.json() as Promise<OneGenerationResponse>;
        } catch (error) {
            console.error('Error fetching one generation:', error);
            throw error;
        }
    }

    async getPokemonSpecies(id: number): Promise<PokemonSpeciesResponse> {
        try {
            const response = await this.fetchWithRetry(`${POKEMON_SPECIES_API_URL}/${id}`);
            return response.json() as Promise<PokemonSpeciesResponse>;
        } catch (error) {
            console.error('Error fetching pokemon species:', error);
            throw error;
        }
    }

    async getPokemonEvolutionChain(id: number): Promise<PokemonEvolutionChainResponse> {
        try {
            const response = await this.fetchWithRetry(`${POKEMON_EVOLUTION_CHAIN_API_URL}/${id}`);
            return response.json() as Promise<PokemonEvolutionChainResponse>;
        } catch (error) {
            console.error('Error fetching pokemon evolution chain:', error);
            throw error;
        }
    }

    async getPokemonDetails(id: number): Promise<PokemonDetailsResponse> {
        try {
            const response = await this.fetchWithRetry(`${POKEMON_DETAILS_API_URL}/${id}`);
            return response.json() as Promise<PokemonDetailsResponse>;
        } catch (error) {
            console.error('Error fetching pokemon details:', error);
            throw error;
        }
    }

    async getPokemonDetailsByName(name: string): Promise<PokemonDetailsResponse> {
        try {
            const response = await this.fetchWithRetry(`${POKEMON_DETAILS_API_URL}/${name}`);
            return response.json() as Promise<PokemonDetailsResponse>;
        } catch (error) {
            console.error('Error fetching pokemon details by name:', error);
            throw error;
        }
    }

    async getPokemonSpeciesByName(name: string): Promise<PokemonSpeciesResponse> {
        try {
            const response = await this.fetchWithRetry(`${POKEMON_SPECIES_API_URL}/${name}`);
            return response.json() as Promise<PokemonSpeciesResponse>;
        } catch (error) {
            console.error('Error fetching pokemon species by name:', error);
            throw error;
        }
    }

    async getAllPokemons(): Promise<AllPokemonsResponse> {
        try {
            const response = await this.fetchWithRetry(`${POKEMON_DETAILS_API_URL}?limit=${LIMIT_POKEMONS}`);
            return response.json() as Promise<AllPokemonsResponse>;
        } catch (error) {
            console.error('Error fetching all pokemons:', error);
            throw error;
        }
    }

    private async fetchWithRetry(url: string, maxRetries = 3, delayMs = 2000): Promise<Response> {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(url);
                
                if (response.status === 429) {
                    if (attempt === maxRetries) {
                        throw new Error(`Rate limit exceeded after ${maxRetries} attempts`);
                    }
                    
                    console.warn(`Rate limit exceeded (attempt ${attempt}/${maxRetries}). Retrying in ${delayMs}ms...`);
                    await this.sleep(delayMs);
                    continue;
                }
                
                return response;
            } catch (error) {
                if (attempt === maxRetries) {
                    throw error;
                }
                
                console.warn(`Request failed (attempt ${attempt}/${maxRetries}). Retrying in ${delayMs}ms...`, error);
                await this.sleep(delayMs);
            }
        }
        
        throw new Error('Max retries exceeded');
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getAllGenerations(): Promise<OneGenerationResponse[]> {
        try {
            const generationsResponse = await this.getGenerations();
            const generationIds = generationsResponse.results.map(gen => {
                const id = Number(gen.url.split('/')[6]);
                return id;
            });

            // Fetch all generations data in parallel for better performance
            const allGenerations = await Promise.all(
                generationIds.map(id => this.getOneGeneration(id))
            );

            return allGenerations;
        } catch (error) {
            console.error('Error fetching all generations:', error);
            throw error;
        }
    }
}