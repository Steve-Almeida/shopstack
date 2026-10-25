"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { connectMongo } from "@/lib/mongo";
import { Product } from "@/models/Product";
import { requireUser } from "@/lib/session";

type CartLine = { productId: string; qty: number };

// Exp 5: transactional order creation (Postgres) coordinated with stock (Mongo).
// Prices are re-read server-side — never trust the client.
export async function checkout(lines: CartLine[]) {
  const session = await requireUser();
  const clean = lines.filter((l) => l.qty > 0).slice(0, 50);
  if (clean.length === 0) return { error: "Cart is empty" };

  await connectMongo();
  const docs = await Product.find({ _id: { $in: clean.map((l) => l.productId) } }).lean();
  const byId = new Map(docs.map((d) => [String(d._id), d]));

  for (const l of clean) {
    const p = byId.get(l.productId);
    if (!p) return { error: "A product in your cart no longer exists" };
    if (p.stock < l.qty) return { error: `Not enough stock for ${p.title}` };
  }

  const items = clean.map((l) => {
    const p = byId.get(l.productId)!;
    return { productId: l.productId, title: p.title, price: p.price, qty: l.qty };
  });
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  // Relational transaction: order + items succeed or fail together
  const order = await prisma.$transaction(async (tx) => {
    return tx.order.create({
      data: {
        userId: session.user.id,
        total,
        status: "PAID",
        items: { create: items },
      },
    });
  });

  // Decrement catalog stock (separate store)
  await Promise.all(
    items.map((i) => Product.updateOne({ _id: i.productId }, { $inc: { stock: -i.qty } }))
  );

  revalidateTag("products", "max");
  revalidatePath("/dashboard/orders");
  redirect(`/dashboard/orders/${order.id}`);
}
