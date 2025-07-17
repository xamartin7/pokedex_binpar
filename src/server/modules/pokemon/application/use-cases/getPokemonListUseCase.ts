import type { IGetPokemonsRepository } from "@/server/modules/pokemon/infrastructure/interfaces/IGetPokemonsRepository";
import type { IGetPokemonListUseCase } from "../interfaces/IGetPokemonListUseCase";
import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";

export class GetPokemonListUseCase implements IGetPokemonListUseCase {
  private pokemonRepository: IGetPokemonsRepository;

  constructor(pokemonRepository: IGetPokemonsRepository) {
    this.pokemonRepository = pokemonRepository;
  }

  async getByGeneration(generationId: number): Promise<Pokemon[]> {
    const pokemon = await this.pokemonRepository.findAllByGeneration(generationId);
    return pokemon;
  }
}