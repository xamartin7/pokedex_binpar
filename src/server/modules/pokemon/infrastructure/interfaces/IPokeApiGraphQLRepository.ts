// GraphQL Response Types
export interface PokemonGraphQLResponse {
  id: number;
  name: string;
  pokemonspecy: {
    id: number;
    name: string;
    generation: {
      id: number;
      name: string;
    };
    evolutionchain: {
      id: number;
      pokemonspecies: {
        id: number;
        name: string;
        pokemons: {
          id: number;
          name: string;
          pokemonsprites: {
            sprites: string;
          }[];
        }[];
      }[];
    };
  };
  pokemonsprites: {
    sprites: string;
  }[];
  pokemontypes: {
    type: {
      id: number;
      name: string;
    };
  }[];
  pokemonstats: {
    base_stat: number;
    effort: number;
    stat: {
      id: number;
      name: string;
    };
  }[];
}

export interface AllPokemonGraphQLResponse {
  pokemon: PokemonGraphQLResponse[];
}

export interface IPokeApiGraphQLRepository {
    getAllPokemonsDetails(): Promise<AllPokemonGraphQLResponse>;
}