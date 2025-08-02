import type { Type } from "../../domain/entities/Type";

export interface TypesByGeneration {
    generationId: number;
    generationName: string;
    types: Type[];
}

export interface IGetTypesUseCase {
    getTypes(generationId: number): Promise<Type[]>;
    getAllTypesByGeneration(): Promise<TypesByGeneration[]>;
}