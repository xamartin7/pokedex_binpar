import { api, HydrateClient } from "@/trpc/server";
import { TitlePage } from "./_components/TitlePage";
import { ErrorMessageLoadingScreen } from "./_components/ErrorMessageLoadingScreen";
import { PokemonPageClient } from "./_components/PokemonPageClient";
import { Suspense } from "react";
import { InitialLoading } from "./_components/InitialLoading";

export default async function Home() {
  try {
    return (
      <Suspense fallback={<InitialLoading />}>
        <div className="min-h-screen py-8">
          <TitlePage title="Pokédex" />
          <HydrateClient>
            <PokemonPageClient />
          </HydrateClient>
        </div>
      </Suspense>
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