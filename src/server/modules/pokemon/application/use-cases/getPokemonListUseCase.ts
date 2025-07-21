import type { IGetPokemonListUseCase } from "../interfaces/IGetPokemonListUseCase";
import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import type { IListGeneratorFacade } from "../../domain/factory/IListGeneratorFacade";

export class GetPokemonListUseCase implements IGetPokemonListUseCase {
  private listGeneratorFacade: IListGeneratorFacade

  constructor(listGeneratorFacade: IListGeneratorFacade) {  
    this.listGeneratorFacade = listGeneratorFacade;
  }

  async getByGeneration(generationId: number): Promise<Pokemon[]> {
    const pokemon = await this.listGeneratorFacade.generateListByGeneration(generationId);
    return pokemon;
  }
}