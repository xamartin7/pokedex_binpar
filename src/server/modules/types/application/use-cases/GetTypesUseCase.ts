import { IdsUrlExtractor } from "@/server/modules/pokemon/domain/services/IdsUrlExtractor";
import type { Type } from "../../domain/entities/Type";
import type { IGetTypesUseCase, TypesByGeneration } from "../interfaces/IGetTypesUseCase";
import type { IPokeApiRepository } from "@/server/modules/pokemon/infrastructure/interfaces/IPokeApiRepository";

export class GetTypesUseCase implements IGetTypesUseCase {
    private pokeApiRepository: IPokeApiRepository

    constructor(pokeApiRepository: IPokeApiRepository) {
        this.pokeApiRepository = pokeApiRepository
    }
                
    async getTypes(generationId: number): Promise<Type[]> {
        const generation = await this.pokeApiRepository.getOneGeneration(generationId)
        return generation.types.map((type) => {
            const id = Number(IdsUrlExtractor.extractIdFromUrl(type.url))
            return {
                id,
                name: type.name
            }
        })
    }

    async getAllTypesByGeneration(): Promise<TypesByGeneration[]> {
        const allGenerations = await this.pokeApiRepository.getAllGenerations()
        
        return allGenerations.map((generation, index) => {
            const generationId = index + 1 // Generations are 1-indexed
            const types = generation.types.map((type) => {
                const id = Number(IdsUrlExtractor.extractIdFromUrl(type.url))
                return {
                    id,
                    name: type.name
                }
            })
            
            return {
                generationId,
                generationName: generation.name,
                types
            }
        })
    }
}