import { createTRPCRouter, publicProcedure } from "../trpc"
import { z } from "zod"
import { GetPokemonListUseCase } from "@/server/modules/pokemon/application/use-cases/getPokemonListUseCase"
import { ListsGeneratorFacade } from "@/server/modules/pokemon/domain/factory/ListsGeneratorFacade"
import { PokemonAPIFactory } from "@/server/modules/pokemon/domain/factory/PokemonAPIFactory"
import { PokeApiRepository } from "@/server/modules/pokemon/infrastructure/repositories/PokeApiRepository"

const pokemonFactory = new PokemonAPIFactory(new PokeApiRepository())
const getPokemonListUseCase = new GetPokemonListUseCase(new ListsGeneratorFacade(pokemonFactory, new PokeApiRepository()))

export const pokemonRouter = createTRPCRouter({
    getPokemonList: publicProcedure.input(z.object({ generationId: z.number() })).query(async ({ input }) => {
      const pokemonList = await getPokemonListUseCase.getByGeneration(input.generationId) 
      return pokemonList
    })
  })