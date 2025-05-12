import { IcoCard } from "@/components/ico-card";
import { dummyICOs } from "@/dummy-data";
import { Suspense } from "react";
// TODO:
// Simulate fetching data with a delay
async function fetchICOsWithDelay() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return dummyICOs;
}

async function ICOList() {
  const icos = await fetchICOsWithDelay();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 my-16">
      {icos.map((ico) => <IcoCard {...ico} key={ico.id} />)}
    </div>
  );
}

export default async function Home() {
  return (
    <>
      <h1>DISCOVER</h1>

      <Suspense fallback={<div className="my-16">Simulating ICOs load time...</div>}>
        <ICOList />
      </Suspense>

      <div className="my-16 grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="bg-secondary p-8">
          <h2 className="text-3xl font-bold mb-4 uppercase">Bucking Fitch</h2>
          <p className="text-muted-foreground mb-6">Mary had a little lamb.</p>
        </div>
        <div className="bg-primary text-primary-foreground p-8">
          <h2 className="text-3xl font-bold mb-4 uppercase">Fucking Bitch</h2>
          <p className="mb-6">Bucking fitch bucking fitch bucking fitch.</p>
        </div>
      </div>
    </>
  );
}
