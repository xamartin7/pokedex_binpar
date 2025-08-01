import type { IPokeApiRepository } from "@/server/modules/pokemon/infrastructure/interfaces/IPokeApiRepository";
import type { IGetGenerationsUseCase } from "../interfaces/IGetGenerationsUseCase";
import type { Generation } from "../../domain/entities/Generation";
import { IdsUrlExtractor } from "@/server/modules/pokemon/domain/services/IdsUrlExtractor";

export class GetGenerationsUseCase implements IGetGenerationsUseCase {
    private pokeApiRepository: IPokeApiRepository

    constructor(pokeApiRepository: IPokeApiRepository) {
        this.pokeApiRepository = pokeApiRepository
    }

    async getGenerations(): Promise<Generation[]> {
        const generations = await this.pokeApiRepository.getGenerations()
        return generations.results.map((generation) => {
            const id = Number(IdsUrlExtractor.extractIdFromUrl(generation.url))
            return {
                id,
                name: generation.name,
                url: generation.url
            }
        })
    }
}