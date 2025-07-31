import { api, HydrateClient } from "@/trpc/server";
import { TitlePage } from "./_components/TitlePage";
import { ErrorMessageLoadingScreen } from "./_components/ErrorMessageLoadingScreen";
import { PokemonPageClient } from "./_components/PokemonPageClient";

export default async function Home() {
  try {
    console.log('Server: Fetching all Pokemon data...')
    const allPokemonData = await api.pokemon.getAllPokemonData()
    console.log('Server: Data fetched successfully')

    return (
      <div className="min-h-screen py-8">
        <TitlePage title="Pokédex" />
        <HydrateClient>
          <PokemonPageClient initialData={allPokemonData} />
        </HydrateClient>
      </div>
    );
  } catch (error) {
    console.error('Server: Error loading data:', error)
    return (
      <div className="min-h-screen py-8">
        <TitlePage title="Pokédex" />
        <ErrorMessageLoadingScreen error={'Error loading data'} />
      </div>
    )
  }
}