import type { IGetPokemonListUseCase } from "../interfaces/IGetPokemonListUseCase";
import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import type { ListsGeneratorFacade } from "../../domain/factory/ListsGeneratorFacade";

export class GetPokemonListUseCase implements IGetPokemonListUseCase {
  private listsGeneratorFacade: ListsGeneratorFacade

  constructor(listsGeneratorFacade: ListsGeneratorFacade) {  
    this.listsGeneratorFacade = listsGeneratorFacade;
  }

  async getByGeneration(generationId: number): Promise<Pokemon[]> {
    const pokemon = await this.listsGeneratorFacade.generateListByGeneration(generationId);
    return pokemon;
  }
}