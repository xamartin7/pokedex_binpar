import { createTRPCRouter, publicProcedure } from "../trpc"
import { z } from "zod"
import { GetPokemonListUseCase } from "@/server/modules/pokemon/application/use-cases/getPokemonListUseCase"
import { PokemonDataGeneratorFacade } from "@/server/modules/pokemon/domain/factory/PokemonDataGeneratorFacade"
import { PokemonAPIFactory } from "@/server/modules/pokemon/domain/factory/PokemonAPIFactory"
import { PokeApiRepository } from "@/server/modules/pokemon/infrastructure/repositories/PokeApiRepository"
import { GetGenerationsUseCase } from "@/server/modules/generations/application/use-cases/GetGenerationsUseCase"
import { GetTypesUseCase } from "@/server/modules/types/application/use-cases/GetTypesUseCase"
import { GetPokemonDetailsUseCase } from "@/server/modules/pokemon/application/use-cases/GetPokemonDetailsUseCase"

const pokemonFactory = new PokemonAPIFactory(new PokeApiRepository())
const getPokemonListUseCase = new GetPokemonListUseCase(new PokemonDataGeneratorFacade(pokemonFactory, new PokeApiRepository()))
const getGenerationsUseCase = new GetGenerationsUseCase(new PokeApiRepository())
const getTypesUseCase = new GetTypesUseCase(new PokeApiRepository())

const getPokemonDetailsUseCase = new GetPokemonDetailsUseCase(new PokemonDataGeneratorFacade(pokemonFactory, new PokeApiRepository()))


export const pokemonRouter = createTRPCRouter({
    getPokemonList: publicProcedure.input(z.object({ generationId: z.number() })).query(async ({ input }) => {
      const pokemonList = await getPokemonListUseCase.getByGeneration(input.generationId) 
      return pokemonList
    }),
    getGenerations: publicProcedure.query(async () => {
      const generations = await getGenerationsUseCase.getGenerations()
      return generations
    }),
    getTypes: publicProcedure.input(z.object({ generationId: z.number() })).query(async ({ input }) => {
      const types = await getTypesUseCase.getTypes(input.generationId)
      return types
    }),
    getPokemonDetails: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const pokemonDetails = await getPokemonDetailsUseCase.execute(input.id)
      return pokemonDetails
    }),
    getPokemonDetailsByName: publicProcedure.input(z.object({ name: z.string() })).query(async ({ input }) => {
      const pokemonDetails = await getPokemonDetailsUseCase.executeByName(input.name)
      return pokemonDetails
    })
  })