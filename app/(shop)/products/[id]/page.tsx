import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import { getProduct } from "@/lib/products";
import { inr } from "@/lib/format";

// Exp 9: dynamic SEO metadata generated from the product itself
export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.description.slice(0, 155),
    openGraph: { title: product.title, description: product.description.slice(0, 155), images: [product.image] },
  };
}

// Exp 1: dynamic segment [id]
export default async function ProductPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100">
        <Image src={product.image} alt={product.title} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
      </div>
      <div>
        <p className="text-sm uppercase tracking-wide text-neutral-500">{product.category}</p>
        <h1 className="mt-1 text-3xl font-bold">{product.title}</h1>
        <p className="mt-3 text-2xl font-semibold">{inr(product.price)}</p>
        <p className="mt-4 text-neutral-600 dark:text-neutral-300">{product.description}</p>
        <p className="mt-4 text-sm text-neutral-500">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
        <div className="mt-6">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
