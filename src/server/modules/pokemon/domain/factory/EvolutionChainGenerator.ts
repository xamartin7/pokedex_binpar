import type { IPokeApiRepository, ChainLink } from "../../infrastructure/interfaces/IPokeApiRepository";
import type { Pokemon } from "../entities/Pokemon";
import type { IPokemonFactory } from "./IPokemonFactory";

export class EvolutionChainGenerator {
    private pokemonFactory: IPokemonFactory
    private pokeApiRepository: IPokeApiRepository

    public constructor(pokemonFactory: IPokemonFactory, pokeApiRepository: IPokeApiRepository) {
        this.pokemonFactory = pokemonFactory
        this.pokeApiRepository = pokeApiRepository
    }

    public async generateEvolutionChain(id: number): Promise<Pokemon[]> {
        const evolutionChain = await this.pokeApiRepository.getPokemonEvolutionChain(id)
        
        // Extract all species from the evolution chain tree
        const speciesInChain = this.extractSpeciesFromChain(evolutionChain.chain)
        
        // Create simplified Pokemon objects for the evolution chain
        const evolutionChainPokemon = await Promise.all(
            speciesInChain.map(async (species) => {
                const pokemonId = Number(species.url.split('/')[6])
                
                const pokemon = await this.pokemonFactory.createPokemon(pokemonId)
                return pokemon
            })
        )

        return evolutionChainPokemon
    }

    private extractSpeciesFromChain(chainLink: ChainLink): Array<{ name: string; url: string }> {
        const species: Array<{ name: string; url: string }> = []
        
        // Add current species
        species.push(chainLink.species)
        
        // Recursively add evolved forms
        if (chainLink.evolves_to && chainLink.evolves_to.length > 0) {
            for (const evolution of chainLink.evolves_to) {
                species.push(...this.extractSpeciesFromChain(evolution))
            }
        }
        
        return species
    }
}