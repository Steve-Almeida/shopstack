import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectMongo } from "@/lib/mongo";
import { Product, toDTO } from "@/models/Product";
import { getRole } from "@/lib/session";
import { productInput, slugify } from "@/lib/validation";

// proxy.ts already blocks non-admins; we re-check here too.
export async function POST(request: Request) {
  if ((await getRole()) !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = productInput.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  await connectMongo();
  const doc = await Product.create({ ...parsed.data, slug: slugify(parsed.data.title) });
  revalidateTag("products", "max");
  return NextResponse.json({ product: toDTO(doc) }, { status: 201 });
}
