import Link from "next/link";

import { LatestPost } from "@/app/_components/post";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  /*const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }*/

  const pokemonList = await api.pokemon.getPokemonList({ generationId: 1 });
  console.log(pokemonList)

  return (
    <div>
      <h1>Hello World</h1>
      <pre>{JSON.stringify(pokemonList, null, 2)}</pre>
    </div>
  );
}
