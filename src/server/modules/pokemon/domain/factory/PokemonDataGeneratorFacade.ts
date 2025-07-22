import type { IPokeApiRepository } from "../../infrastructure/interfaces/IPokeApiRepository";
import type { Pokemon } from "../entities/Pokemon";
import { EvolutionChainGenerator } from "./EvolutionChainGenerator";
import type { IPokemonsDataGeneratorFacade } from "./IPokemonsDataGeneratorFacade";
import type { IPokemonFactory } from "./IPokemonFactory";

export class PokemonDataGeneratorFacade implements IPokemonsDataGeneratorFacade {
    private pokemonFactory: IPokemonFactory
    private pokeApiRepository: IPokeApiRepository
    private evolutionChainGenerator: EvolutionChainGenerator

    public constructor(pokemonFactory: IPokemonFactory, pokeApiRepository: IPokeApiRepository) {
        this.pokemonFactory = pokemonFactory
        this.pokeApiRepository = pokeApiRepository
        this.evolutionChainGenerator = new EvolutionChainGenerator(pokemonFactory, pokeApiRepository)
    }

    async generateListByGeneration(generationId: number): Promise<Pokemon[]> {
        const generation = await this.pokeApiRepository.getOneGeneration(`https://pokeapi.co/api/v2/generation/${generationId}`)
        const pokemons = await Promise.all(generation.pokemon_species.map(async (pokemon) => {
            const pokemonId = Number(pokemon.url.split('/')[6])
            const pokemonObj = await this.pokemonFactory.createPokemon(pokemonId)
            const evolutionChain = await this.evolutionChainGenerator.generateEvolutionChain(pokemonObj.evolutionChainUrl)
            pokemonObj.evolutionChain = evolutionChain
            return pokemonObj
        }))
        
        pokemons.sort((a, b) => a.id - b.id)
        return pokemons
    }

    async getPokemonDetails(id: number): Promise<Pokemon> {
        const pokemon = await this.pokemonFactory.createPokemon(id)
        const evolutionChain = await this.evolutionChainGenerator.generateEvolutionChain(pokemon.evolutionChainUrl)
        pokemon.evolutionChain = evolutionChain
        return pokemon
    }

    async getPokemonDetailsByName(name: string): Promise<Pokemon> {
        const pokemon = await this.pokemonFactory.createPokemonByName(name)
        const evolutionChain = await this.evolutionChainGenerator.generateEvolutionChain(pokemon.evolutionChainUrl)
        pokemon.evolutionChain = evolutionChain
        return pokemon
    }
}