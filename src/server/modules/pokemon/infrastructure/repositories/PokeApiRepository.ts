import type { IPokeApiRepository, OneGenerationResponse, PokemonSpeciesResponse, GenerationsResponse, PokemonEvolutionChainResponse, PokemonDetailsResponse } from "../interfaces/IPokeApiRepository";

export class PokeApiRepository implements IPokeApiRepository {

    async getGenerations(): Promise<GenerationsResponse> {
        try {
            const response = await this.fetchWithRetry('https://pokeapi.co/api/v2/generation');
            return response.json() as Promise<GenerationsResponse>;
        } catch (error) {
            console.error('Error fetching generations:', error);
            throw error;
        }
    }

    async getOneGeneration(url_generation: string): Promise<OneGenerationResponse> {
        try {
            const response = await this.fetchWithRetry(url_generation);
            return response.json() as Promise<OneGenerationResponse>;
        } catch (error) {
            console.error('Error fetching one generation:', error);
            throw error;
        }
    }

    async getPokemonSpecies(url: string): Promise<PokemonSpeciesResponse> {
        try {
            const response = await this.fetchWithRetry(url);
            return response.json() as Promise<PokemonSpeciesResponse>;
        } catch (error) {
            console.error('Error fetching pokemon species:', error);
            throw error;
        }
    }

    async getPokemonEvolutionChain(url: string): Promise<PokemonEvolutionChainResponse> {
        try {
            const response = await this.fetchWithRetry(url);
            return response.json() as Promise<PokemonEvolutionChainResponse>;
        } catch (error) {
            console.error('Error fetching pokemon evolution chain:', error);
            throw error;
        }
    }

    async getPokemonDetails(url: string): Promise<PokemonDetailsResponse> {
        try {
            const response = await this.fetchWithRetry(url);
            return response.json() as Promise<PokemonDetailsResponse>;
        } catch (error) {
            console.error('Error fetching pokemon details:', error);
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
}