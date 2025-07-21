import type { IPokeApiRepository } from "@/server/modules/pokemon/infrastructure/interfaces/IPokeApiRepository";
import type { IGetGenerationsUseCase } from "../interfaces/IGetGenerationsUseCase";
import type { Generation } from "../../domain/entities/Generation";

export class GetGenerationsUseCase implements IGetGenerationsUseCase {
    private pokeApiRepository: IPokeApiRepository

    constructor(pokeApiRepository: IPokeApiRepository) {
        this.pokeApiRepository = pokeApiRepository
    }

    async getGenerations(): Promise<Generation[]> {
        const generations = await this.pokeApiRepository.getGenerations()
        return generations.results.map((generation) => {
            const id = Number(generation.url.split('/')[6])
            return {
                id,
                name: generation.name
            }
        })
    }
}