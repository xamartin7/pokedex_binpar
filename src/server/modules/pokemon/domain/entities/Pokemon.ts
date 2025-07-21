export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  generation: string;
  evolutionChain: Pokemon[];
}