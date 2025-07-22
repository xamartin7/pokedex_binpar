import { createTRPCRouter, publicProcedure } from "../trpc"
import { z } from "zod"
import { GetPokemonListUseCase } from "@/server/modules/pokemon/application/use-cases/getPokemonListUseCase"
import { PokemonDataGeneratorFacade } from "@/server/modules/pokemon/domain/factory/PokemonDataGeneratorFacade"
import { PokemonAPIFactory } from "@/server/modules/pokemon/domain/factory/PokemonAPIFactory"
import { PokeApiRepository } from "@/server/modules/pokemon/infrastructure/repositories/PokeApiRepository"
import { GetGenerationsUseCase } from "@/server/modules/generations/application/use-cases/GetGenerationsUseCase"
import { GetTypesUseCase } from "@/server/modules/types/application/use-cases/GetTypesUseCase"
import { GetPokemonDetailsUseCase } from "@/server/modules/pokemon/application/use-cases/GetPokemonDetailsUseCase"
import { TRPCError } from "@trpc/server"

const pokemonFactory = new PokemonAPIFactory(new PokeApiRepository())
const getPokemonListUseCase = new GetPokemonListUseCase(new PokemonDataGeneratorFacade(pokemonFactory, new PokeApiRepository()))
const getGenerationsUseCase = new GetGenerationsUseCase(new PokeApiRepository())
const getTypesUseCase = new GetTypesUseCase(new PokeApiRepository())

const getPokemonDetailsUseCase = new GetPokemonDetailsUseCase(new PokemonDataGeneratorFacade(pokemonFactory, new PokeApiRepository()))


export const pokemonRouter = createTRPCRouter({
    getPokemonList: publicProcedure.input(z.object({ generationId: z.number() })).query(async ({ input }) => {
      try {
        const pokemonList = await getPokemonListUseCase.getByGeneration(input.generationId) 
        return pokemonList
      } catch (error) {
        console.error('Error getting pokemon list:', error)
        throw error
      }
    }),
    getGenerations: publicProcedure.query(async () => {
      try {
        const generations = await getGenerationsUseCase.getGenerations()
        return generations
      } catch (error) {
        console.error('Error getting generations:', error)
        throw error
      }
    }),
    getTypes: publicProcedure.input(z.object({ generationId: z.number() })).query(async ({ input }) => {
      try {
        const types = await getTypesUseCase.getTypes(input.generationId)
        return types
      } catch (error) {
        console.error('Error getting types:', error)
        throw error
      }
    }),
    getPokemonDetails: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      try {
        const pokemonDetails = await getPokemonDetailsUseCase.execute(input.id)
        return pokemonDetails
      } catch (error) {
        console.error('Error getting pokemon details:', error)
        throw error
      }
    }),
    getPokemonDetailsByName: publicProcedure.input(z.object({ name: z.string() })).query(async ({ input }) => {
      try {
        const pokemonsDetails = await getPokemonDetailsUseCase.executeByName(input.name)
        if (pokemonsDetails.length === 0) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Pokemon not found' })
        }
        return pokemonsDetails
      } catch (error) {
        console.error('Error getting pokemon details by name:', error)
        throw error
      }
    })
  })