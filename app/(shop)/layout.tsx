import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { getCategories } from "@/lib/products";

async function CategoryBar() {
  await connection();
  const cats = await getCategories();
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/products" className="rounded-full border px-3 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">All</Link>
      {cats.map((c) => (
        <Link key={c} href={`/products?category=${encodeURIComponent(c)}`} className="rounded-full border px-3 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">
          {c}
        </Link>
      ))}
    </div>
  );
}

// Route-group sub-layout: only the (shop) pages get the category bar.
// It stays mounted while the pages below change.
export default function ShopLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Suspense fallback={<div className="h-8" />}>
        <CategoryBar />
      </Suspense>
      <div className="mt-6">{children}</div>
    </div>
  );
}
