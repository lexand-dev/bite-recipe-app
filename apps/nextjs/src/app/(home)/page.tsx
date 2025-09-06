export default function HomePage() {
  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Bite <span className="text-primary">T3</span>
        </h1>

        <div className="w-full max-w-2xl"></div>
      </div>
    </main>
  );
}

/* import { HydrateClient, prefetch, trpc } from "~/trpc/server"; */
/*   prefetch(trpc.recipe.all.queryOptions());

  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Bite <span className="text-primary">T3</span>
          </h1>

          <div className="w-full max-w-2xl">
            <Suspense
              fallback={
                <div className="flex w-full flex-col gap-4">loading...</div>
              }
            >

              Hola
            </Suspense>
          </div>
        </div>
      </main>
    </HydrateClient> */
