import type { Pokemon } from "../../domain/entities/Pokemon";
import type { EvolutionChainGenerator } from "../../domain/factory/EvolutionChainGenerator";
import type { IPokemonFactory } from "../../domain/factory/IPokemonFactory";
import type { IGetPokemonDetailsUseCase } from "../interfaces/IGetPokemonDetailsUseCase";

export class GetPokemonDetailsUseCase implements IGetPokemonDetailsUseCase {
    private pokemonFactory: IPokemonFactory
    private evolutionChainGenerator: EvolutionChainGenerator

    constructor(pokemonFactory: IPokemonFactory, evolutionChainGenerator: EvolutionChainGenerator) {
        this.pokemonFactory = pokemonFactory
        this.evolutionChainGenerator = evolutionChainGenerator
    }

    async execute(id: number): Promise<Pokemon> {
        const pokemon = await this.pokemonFactory.createPokemon(id)
        const evolutionChain = await this.evolutionChainGenerator.generateEvolutionChain(pokemon.evolutionChainUrl)
        pokemon.evolutionChain = evolutionChain
        return pokemon
    }
}