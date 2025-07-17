import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import type { IGetPokemonsRepository } from "../interfaces/IGetPokemonsRepository";

interface PokemonGenerationResponse {
    count: number
    next: string | null
    previous: string | null
    results: {
        name: string
        url: string
    }[]
}

interface PokemonResponse {
    types: {
        type: {
            name: string
        }
    }[]
}

interface GenerationResponse {
    name: string
    pokemon_species: {
        name: string
        url: string
    }[]
}


export class GetPokemonsRepository implements IGetPokemonsRepository {
    
    async findAllByGeneration(generationId: number): Promise<Pokemon[]> {
        const generation = await fetch(`https://pokeapi.co/api/v2/generation/${generationId}`)
        const { name, pokemon_species } = await generation.json() as GenerationResponse
        const generationLimits = this.getGenerationLimits(generationId)
        if (!generationLimits) {
            throw new Error(`Generation ${generationId} not found`)
        }

        const pokemonsGeneration = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${generationLimits.limit}&offset=${generationLimits.offset}`)
        const { results } = await pokemonsGeneration.json() as PokemonGenerationResponse
        const pokemons = await Promise.all(results.map(async (pokemon) => {
            const pokemonId = Number(pokemon.url.split('/').pop())
            const pokemonDetails = await fetch(pokemon.url)
            const { types } = await pokemonDetails.json() as PokemonResponse
            const pokemonEvolutionChain = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${pokemonId}`)
            // TODO Evolution chain
            const pokemonObject: Pokemon = {
                id: pokemonId,
                name: pokemon.name,
                type: types[0]?.type?.name ?? 'unknown',
                generation: name,
                evolutionChain: []
            }
            return pokemonObject
        }))

       return pokemons
    }

    async findById(id: string): Promise<Pokemon | null> {
        return null;
    }

    private getGenerationLimits(generationId: number): { limit: number, offset: number } | undefined {
        const generationLimits = {
            1: { limit: 151, offset: 0 },
            2: { limit: 100, offset: 151 },
            3: { limit: 135, offset: 251 },
            4: { limit: 107, offset: 386 },
            5: { limit: 156, offset: 493 },
            6: { limit: 72, offset: 649 },
            7: { limit: 88, offset: 721 },
            8: { limit: 96, offset: 809 },
            9: { limit: 100, offset: 905 }
        }
        return generationLimits[generationId as keyof typeof generationLimits]
    }
}