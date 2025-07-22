import type { Pokemon } from "../../domain/entities/Pokemon";
import type { IPokemonsDataGeneratorFacade } from "../../domain/factory/IPokemonsDataGeneratorFacade";
import type { IGetPokemonDetailsUseCase } from "../interfaces/IGetPokemonDetailsUseCase";

export class GetPokemonDetailsUseCase implements IGetPokemonDetailsUseCase {
    private pokemonDataGeneratorFacade: IPokemonsDataGeneratorFacade

    constructor(pokemonDataGeneratorFacade: IPokemonsDataGeneratorFacade) {
        this.pokemonDataGeneratorFacade = pokemonDataGeneratorFacade
    }

    async execute(id: number): Promise<Pokemon> {
        const pokemon = await this.pokemonDataGeneratorFacade.getPokemonDetails(id)
        return pokemon
    }

    async executeByName(name: string): Promise<Pokemon[]> {
        const pokemons = await this.pokemonDataGeneratorFacade.getPokemonsDetailsByName(name)
        return pokemons
    }
}