import type { Metadata } from "next";
import { requireAdmin } from "@/lib/session";
import { connectMongo } from "@/lib/mongo";
import { Product, toDTO } from "@/models/Product";
import { createProduct, deleteProduct } from "@/actions/products";
import { inr } from "@/lib/format";

export const metadata: Metadata = { title: "Admin · Products", robots: { index: false } };

export default async function AdminProductsPage() {
  await requireAdmin();
  await connectMongo();
  const products = (await Product.find().sort({ createdAt: -1 }).lean()).map(toDTO);
  const input = "rounded-lg border bg-transparent px-3 py-2 text-sm";

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">Products</h1>

      {/* Server Action bound straight to a <form> — no fetch, no API route */}
      <form action={createProduct} className="mb-8 grid gap-3 rounded-2xl border p-4 sm:grid-cols-2">
        <input name="title" required placeholder="Title" className={input} />
        <input name="category" required placeholder="Category" className={input} />
        <input name="price" type="number" min={0} required placeholder="Price (₹)" className={input} />
        <input name="stock" type="number" min={0} required placeholder="Stock" className={input} />
        <input name="image" type="url" required placeholder="Image URL (picsum.photos / images.unsplash.com)" className={`${input} sm:col-span-2`} />
        <textarea name="description" placeholder="Description" className={`${input} sm:col-span-2`} />
        <button className="rounded-lg bg-black py-2 text-white dark:bg-white dark:text-black sm:col-span-2">Add product</button>
      </form>

      <ul className="divide-y rounded-2xl border">
        {products.map((p) => (
          <li key={p.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-sm text-neutral-500">{p.category} · {inr(p.price)} · stock {p.stock}</p>
            </div>
            <form action={deleteProduct}>
              <input type="hidden" name="id" value={p.id} />
              <button className="text-sm text-red-600 hover:underline">Delete</button>
            </form>
          </li>
        ))}
      </ul>
    </>
  );
}
