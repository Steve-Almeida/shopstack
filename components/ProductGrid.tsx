import { connection } from "next/server";
import { getProducts } from "@/lib/products";
import ProductCard from "./ProductCard";

// Async Server Component — data fetched on the server, streamed via Suspense by the caller
export default async function ProductGrid({ category, limit }: { category?: string; limit?: number }) {
  await connection(); // request-time render (DB is not touched at build)
  const all = await getProducts(category);
  const products = limit ? all.slice(0, limit) : all;

  if (products.length === 0) {
    return <p className="py-10 text-center text-neutral-500">No products yet. Run <code>npm run seed</code>.</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
      ))}
    </div>
  );
}
