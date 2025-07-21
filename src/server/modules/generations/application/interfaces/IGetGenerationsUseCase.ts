import type { Generation } from "../../domain/entities/Generation";

export interface IGetGenerationsUseCase {
    getGenerations(): Promise<Generation[]>;
}