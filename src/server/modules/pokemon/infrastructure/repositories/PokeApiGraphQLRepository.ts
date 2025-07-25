import type { IPokeApiGraphQLRepository, AllPokemonGraphQLResponse } from "../interfaces/IPokeApiGraphQLRepository";

export class PokeApiGraphQLRepository implements IPokeApiGraphQLRepository {
    private readonly GRAPHQL_ENDPOINT = 'https://graphql.pokeapi.co/v1beta2';

    async getAllPokemonsDetails(): Promise<AllPokemonGraphQLResponse> {
        const query = `
            query GetAllPokemonDetails {
                pokemon(where: {id: {_lte: 1025}}) {
                    id
                    name
                    pokemonspecy {
                        id
                        name
                        generation {
                            id
                            name
                        }
                        evolutionchain {
                            id
                            pokemonspecies {
                                id
                                name
                                pokemons(limit: 1) {
                                    id
                                    name
                                    pokemonsprites(limit: 1) {
                                        sprites
                                    }
                                }
                            }
                        }
                    }
                    pokemonsprites(limit: 1) {
                        sprites
                    }
                    pokemontypes {
                        type {
                            id
                            name
                        }
                    }
                    pokemonstats {
                        base_stat
                        effort
                        stat {
                            id
                            name
                        }
                    }
                }
            }
        `;

        try {
            const response = await fetch(this.GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables: null,
                    operationName: 'GetAllPokemonDetails'
                }),
            });

            if (!response.ok) {
                throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
            }

            const result = await response.json() as {
                data?: AllPokemonGraphQLResponse;
                errors?: Array<{ message: string }>;
            };
            
            if (result.errors) {
                throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
            }

            if (!result.data) {
                throw new Error('No data returned from GraphQL query');
            }

            return result.data;
        } catch (error) {
            console.error('Error fetching Pokemon details via GraphQL:', error);
            throw error;
        }
    }
}