import type { IPokeApiRepository } from "../../infrastructure/interfaces/IPokeApiRepository";
import type { Pokemon } from "../entities/Pokemon";
import { EvolutionChainGenerator } from "./EvolutionChainGenerator";
import type { IPokemonsDataGeneratorFacade } from "./IPokemonsDataGeneratorFacade";
import type { IPokemonFactory } from "./IPokemonFactory";
import { IdsUrlExtractor } from "../services/IdsUrlExtractor";

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
        const generation = await this.pokeApiRepository.getOneGeneration(generationId)

        const pokemons = await Promise.all(generation.pokemon_species.map(async (pokemon) => {
            const pokemonId = IdsUrlExtractor.extractIdFromUrl(pokemon.url)
            if (pokemonId === null) throw new Error(`Pokemon ID is null for ${pokemon.url}`)
            const pokemonObj = await this.pokemonFactory.createPokemon(pokemonId)
            pokemonObj.evolutionChain = await this.evolutionChainGenerator.generateEvolutionChain(IdsUrlExtractor.extractIdFromUrl(pokemonObj.evolutionChainUrl)!)
            return pokemonObj
        }))

        return pokemons.sort((a, b) => a.id - b.id)
    }

    async getPokemonDetails(id: number): Promise<Pokemon> {
        const pokemon = await this.pokemonFactory.createPokemon(id)
        pokemon.evolutionChain = await this.evolutionChainGenerator.generateEvolutionChain(IdsUrlExtractor.extractIdFromUrl(pokemon.evolutionChainUrl)!)
        return pokemon
    }

    async getPokemonsDetailsByName(name: string): Promise<Pokemon[]> {
        const allPokemons = await this.pokeApiRepository.getAllPokemons()
        const pokemonsMatch = allPokemons.results.filter((pokemon) => pokemon.name.includes(name))
        const pokemonsIds = pokemonsMatch
            .map((pokemon) => IdsUrlExtractor.extractIdFromUrl(pokemon.url))
            .filter((id): id is number => id !== null)

        const pokemons = await Promise.all(pokemonsIds.map(async (id) => {
            const pokemon = await this.pokemonFactory.createPokemon(id)
            const evolutionChain = await this.evolutionChainGenerator.generateEvolutionChain(IdsUrlExtractor.extractIdFromUrl(pokemon.evolutionChainUrl)!)
            pokemon.evolutionChain = evolutionChain
            return pokemon
        }))
        return pokemons
    }

    async generateAllPokemons(): Promise<Pokemon[]> {
        const allGenerations = await this.pokeApiRepository.getAllGenerations()
        
        // Get all unique Pokemon from all generations
        const allPokemonSpecies = new Map<string, { name: string; url: string }>()
        
        allGenerations.forEach(generation => {
            generation.pokemon_species.forEach(pokemon => {
                allPokemonSpecies.set(pokemon.name, pokemon)
            })
        })

        // Convert to array and process
        const uniquePokemonList = Array.from(allPokemonSpecies.values())
        
        const pokemons = await Promise.all(uniquePokemonList.map(async (pokemon) => {
            const pokemonId = IdsUrlExtractor.extractIdFromUrl(pokemon.url)
            if (pokemonId === null) throw new Error(`Pokemon ID is null for ${pokemon.url}`)
            const pokemonObj = await this.pokemonFactory.createPokemon(pokemonId)
            pokemonObj.evolutionChain = await this.evolutionChainGenerator.generateEvolutionChain(IdsUrlExtractor.extractIdFromUrl(pokemonObj.evolutionChainUrl)!)
            return pokemonObj
        }))

        return pokemons.sort((a, b) => a.id - b.id)
    }
}