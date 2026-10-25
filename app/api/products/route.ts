import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

// Exp 4: public read endpoint — GET /api/products?category=Audio
export async function GET(request: Request) {
  const category = new URL(request.url).searchParams.get("category") ?? undefined;
  const products = await getProducts(category);
  return NextResponse.json({ products });
}
