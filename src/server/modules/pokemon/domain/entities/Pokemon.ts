export interface Pokemon {
  id: number;
  name: string;
  type: string;
  generation: string;
  evolutionChain: Pokemon[];
}