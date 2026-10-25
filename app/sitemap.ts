import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getProducts } from "@/lib/products";
import { siteUrl } from "@/lib/format";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const base = siteUrl();
  const staticPages = [{ url: base }, { url: `${base}/products` }];
  try {
    const products = await getProducts();
    return [...staticPages, ...products.map((p) => ({ url: `${base}/products/${p.id}` }))];
  } catch {
    return staticPages; // DB unreachable → still serve a valid sitemap
  }
}
