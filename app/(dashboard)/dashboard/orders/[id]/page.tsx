import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { inr } from "@/lib/format";

export const metadata: Metadata = { title: "Order details", robots: { index: false } };

export default async function OrderPage({ params }: PageProps<"/dashboard/orders/[id]">) {
  const { id } = await params;
  const { user } = await requireUser();
  // Scoped by userId so one user can never read another user's order
  const order = await prisma.order.findFirst({ where: { id, userId: user.id }, include: { items: true } });
  if (!order) notFound();

  return (
    <>
      <h1 className="text-2xl font-semibold">Order #{order.id.slice(-8)}</h1>
      <p className="mb-4 text-sm text-neutral-500">{order.status} · {order.createdAt.toLocaleString("en-IN")}</p>
      <ul className="divide-y rounded-2xl border">
        {order.items.map((i) => (
          <li key={i.id} className="flex justify-between p-4">
            <span>{i.title} × {i.qty}</span>
            <span>{inr(i.price * i.qty)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-right text-lg font-semibold">Total: {inr(order.total)}</p>
    </>
  );
}
