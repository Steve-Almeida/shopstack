import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { ProductDTO } from "@/models/Product";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "All products",
  description: "Browse the full ShopStack catalog.",
};

// Native fetch inside a Server Component, calling our own Route Handler.
// The Data Cache entry is tagged "products" so mutations can revalidate it.
async function ProductList({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const qs = category ? `?category=${encodeURIComponent(category)}` : "";
  const res = await fetch(`${siteUrl()}/api/products${qs}`, { next: { tags: ["products"], revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to load products");
  const { products } = (await res.json()) as { products: ProductDTO[] };

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">{category ?? "All products"}</h1>
      {products.length === 0 ? (
        <p className="text-neutral-500">Nothing here yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}

export default function ProductsPage(props: PageProps<"/products">) {
  return <ProductList searchParams={props.searchParams as Promise<{ category?: string }>} />;
}
