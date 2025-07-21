import type { IGetPokemonListUseCase } from "../interfaces/IGetPokemonListUseCase";
import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import type { IPokemonsDataGeneratorFacade } from "../../domain/factory/IPokemonsDataGeneratorFacade";

export class GetPokemonListUseCase implements IGetPokemonListUseCase {
  private listGeneratorFacade: IPokemonsDataGeneratorFacade

  constructor(listGeneratorFacade: IPokemonsDataGeneratorFacade) {  
    this.listGeneratorFacade = listGeneratorFacade;
  }

  async getByGeneration(generationId: number): Promise<Pokemon[]> {
    const pokemon = await this.listGeneratorFacade.generateListByGeneration(generationId);
    return pokemon;
  }
}