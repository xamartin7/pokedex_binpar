import type { Pokemon } from "../../domain/entities/Pokemon";

export interface IGetPokemonDetailsUseCase {
    execute(id: number): Promise<Pokemon>;
}