import type { Pokemon } from "../../domain/entities/Pokemon";
import type { IListGeneratorFacade } from "../../domain/factory/IListGeneratorFacade";
import type { IGetPokemonDetailsUseCase } from "../interfaces/IGetPokemonDetailsUseCase";

export class GetPokemonDetailsUseCase implements IGetPokemonDetailsUseCase {
    private listGeneratorFacade: IListGeneratorFacade

    constructor(listGeneratorFacade: IListGeneratorFacade) {
        this.listGeneratorFacade = listGeneratorFacade
    }

    async execute(id: number): Promise<Pokemon> {
        const pokemon = await this.listGeneratorFacade.getPokemonDetails(id)
        return pokemon
    }
}