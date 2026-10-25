"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { connectMongo } from "@/lib/mongo";
import { Product } from "@/models/Product";
import { requireAdmin } from "@/lib/session";
import { productInput, slugify } from "@/lib/validation";

// Exp 4: Server Actions for mutations (no fetch boilerplate)
export async function createProduct(formData: FormData) {
  await requireAdmin();
  const parsed = productInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return; // form-level validation kept minimal
  await connectMongo();
  await Product.create({ ...parsed.data, slug: slugify(parsed.data.title) });
  revalidateTag("products", "max");
  revalidatePath("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await connectMongo();
  await Product.findByIdAndDelete(id);
  revalidateTag("products", "max");
  revalidatePath("/admin/products");
}
