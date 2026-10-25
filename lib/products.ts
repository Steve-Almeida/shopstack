import { cacheLife, cacheTag } from "next/cache";
import { connectMongo } from "@/lib/mongo";
import { Product, toDTO, ProductDTO } from "@/models/Product";

// Caching layer: "use cache" + tag. Mutations call revalidateTag("products").

export async function getProducts(category?: string): Promise<ProductDTO[]> {
  "use cache";
  cacheTag("products");
  cacheLife("minutes");
  await connectMongo();
  const docs = await Product.find(category ? { category } : {})
    .sort({ createdAt: -1 })
    .lean();
  return docs.map(toDTO);
}

export async function getProduct(id: string): Promise<ProductDTO | null> {
  "use cache";
  cacheTag("products");
  cacheLife("minutes");
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  await connectMongo();
  const doc = await Product.findById(id).lean();
  return doc ? toDTO(doc) : null;
}

export async function getCategories(): Promise<string[]> {
  "use cache";
  cacheTag("products");
  cacheLife("minutes");
  await connectMongo();
  return (await Product.distinct("category")) as string[];
}
