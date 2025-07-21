import type { Type } from "../../domain/entities/Type";
import type { IGetTypesUseCase } from "../interfaces/IGetTypesUseCase";
import type { IPokeApiRepository } from "@/server/modules/pokemon/infrastructure/interfaces/IPokeApiRepository";

export class GetTypesUseCase implements IGetTypesUseCase {
    private pokeApiRepository: IPokeApiRepository

    constructor(pokeApiRepository: IPokeApiRepository) {
        this.pokeApiRepository = pokeApiRepository
    }

    async getTypes(generationId: number): Promise<Type[]> {
        const generation = await this.pokeApiRepository.getOneGeneration(`https://pokeapi.co/api/v2/generation/${generationId}`)
        return generation.types.map((type) => {
            const id = Number(type.url.split('/')[6])
            return {
                id,
                name: type.name
            }
        })
    }
}