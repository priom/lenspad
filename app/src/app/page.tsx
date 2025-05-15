import { ICOList } from "@/components/ico-list";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      {/* Hero / Intro */}
      <section className="text-center py-16 px-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Discover & Launch ICOs on Lens Chain
        </h1>
        <p className="text-muted-foreground text-lg">
          Support the next wave of crypto projects by participating in token sales or launch your own ICO with just a few clicks.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/create"
            className="px-6 py-3 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Launch Your ICO
          </Link>
        </div>
      </section>

      {/* ICO List */}
      <section id="explore" className="px-4">
        <h2 className="text-2xl font-bold mb-6 text-center uppercase tracking-wide">
          Live Token Sales
        </h2>
        <ICOList />
      </section>

      {/* Platform Highlights */}
      <section className="my-24 grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="bg-secondary p-8">
          <h2 className="text-3xl font-bold mb-4 uppercase">Fast & Simple</h2>
          <p className="text-muted-foreground">
            Our no-code interface lets anyone launch an ICO with optional token creation, funding caps, and on-chain ownership.
          </p>
        </div>
        <div className="bg-primary text-primary-foreground p-8">
          <h2 className="text-3xl font-bold mb-4 uppercase">Community-Powered</h2>
          <p>
            Discover projects by community members. Support ideas you believe in and help bring them to life.
          </p>
        </div>
      </section>
    </>
  );
}
