import { Suspense } from "react";
import Link from "next/link";
import ProductGrid, { GridSkeleton } from "@/components/ProductGrid";

export default function Home() {
  return (
    <>
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 px-8 py-14 text-white">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Gear up, the full-stack way.</h1>
        <p className="mt-3 max-w-xl text-white/85">
          A small marketplace built with Next.js 16 — catalog in MongoDB, orders in Postgres, secured with Better Auth.
        </p>
        <Link href="/products" className="mt-6 inline-block rounded-full bg-white px-5 py-2 font-medium text-indigo-700">
          Browse products
        </Link>
      </section>

      <h2 className="mt-10 mb-4 text-xl font-semibold">Latest arrivals</h2>
      {/* Streaming: the hero renders instantly, the grid streams in */}
      <Suspense fallback={<GridSkeleton />}>
        <ProductGrid limit={4} />
      </Suspense>
    </>
  );
}
