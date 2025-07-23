import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { EvolutionChain } from "../_components/details/EvolutionChain";
import { ReturnOriginEvolutionButton } from "../_components/details/ReturnOriginEvolutionButton";
import { MainPokemonInfo } from "../_components/details/MainPokemonInfo";
import { PokemonStats } from "../_components/details/PokemonStats";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ originId?: string }>;
}

export default async function PokemonDetailPage({ params, searchParams }: PageProps) {
  // Await the params and searchParams
  const { id } = await params;
  const { originId } = await searchParams;
  const pokemonId = Number(id);

  if (isNaN(pokemonId)) {
    notFound();
  }

  try {
    const pokemonDetails = await api.pokemon.getPokemonDetails({ id: pokemonId });

    if (!pokemonDetails) {
      notFound();
    }

    // Fetch origin Pokemon details if originId exists and is different from current
    let originPokemon = null;
    const originPokemonId = originId ? Number(originId) : null;
    
    if (originPokemonId && !isNaN(originPokemonId) && originPokemonId !== pokemonId) {
      try {
        originPokemon = await api.pokemon.getPokemonDetails({ id: originPokemonId });
      } catch (error) {
        console.error('Error fetching origin Pokemon:', error);
      }
    }

    return (
      <div className="space-y-8">
        {/* Back to Origin Navigation */}
        {originPokemon && (
          <ReturnOriginEvolutionButton originPokemon={originPokemon} />
        )}

        {/* Main Pokemon Info */}
        <MainPokemonInfo pokemonDetails={pokemonDetails} />

        {/* Stats */}
        <PokemonStats pokemonDetails={pokemonDetails} />

        {/* Evolution Chain */}
        <EvolutionChain 
          evolutionChain={pokemonDetails.evolutionChain} 
          currentPokemonId={pokemonId}
          originId={originPokemonId ?? undefined}
        />
      </div>
    );
  } catch (error) {
    console.error('Error fetching Pokemon details:', error);
    notFound();
  }
}