export interface GenerationsResponse {
    count: number
    results: {
        name: string
        url: string
    }[]
}

export interface OneGenerationResponse {
    name: string
    pokemon_species: {
        name: string
        url: string
    }[]
    types: {
        name: string
        url: string
    }[]
}

export interface PokemonSpeciesResponse {
    generation: {
        name: string
        url: string
    }
    evolution_chain: {
        url: string
    }
}

export interface PokemonDetailsResponse {
    name: string
    sprites: {
        front_default: string
    }
    types: {
        type: {
            name: string
        }
    }[]
}

export interface PokemonEvolutionChainResponse {
    chain: {
        evolves_to: {
            species: {
                name: string
                url: string
            }
        }[]
    }
}

export interface IPokeApiRepository {
    getGenerations(): Promise<GenerationsResponse>;
    getOneGeneration(url: string): Promise<OneGenerationResponse>;
    getPokemonSpecies(url: string): Promise<PokemonSpeciesResponse>;
    getPokemonEvolutionChain(url: string): Promise<PokemonEvolutionChainResponse>;
    getPokemonDetails(url: string): Promise<PokemonDetailsResponse>;
}