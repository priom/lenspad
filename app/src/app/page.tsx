import { IcoCard } from "@/components/ico-card";
import { Suspense } from "react";
import { Address } from "viem";
import { ICOList } from "@/components/ico-list";

export default async function Home() {
  
  return (
    <>
      <h1>DISCOVER</h1>

        <ICOList />

      <div className="my-16 grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="bg-secondary p-8">
          <h2 className="text-3xl font-bold mb-4 uppercase">Not weird at all</h2>
          <p className="text-muted-foreground mb-6">Mary had a little lamb.</p>
        </div>
        <div className="bg-primary text-primary-foreground p-8">
          <h2 className="text-3xl font-bold mb-4 uppercase">Not weird at all</h2>
          <p className="mb-6">Not weird at all.</p>
        </div>
      </div>
    </>
  );
}
