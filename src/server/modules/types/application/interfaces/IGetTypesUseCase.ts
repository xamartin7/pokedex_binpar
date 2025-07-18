import type { Type } from "../../domain/entities/Type";

export interface IGetTypesUseCase {
    getTypes(generationId: number): Promise<Type[]>;
}