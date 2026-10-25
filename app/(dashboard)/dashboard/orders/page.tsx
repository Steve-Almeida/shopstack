import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { inr } from "@/lib/format";

export const metadata: Metadata = { title: "My orders", robots: { index: false } };

export default async function OrdersPage() {
  const { user } = await requireUser();
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">My orders</h1>
      {orders.length === 0 ? (
        <p className="text-neutral-500">No orders yet.</p>
      ) : (
        <ul className="divide-y rounded-2xl border">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/dashboard/orders/${o.id}`} className="flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900">
                <div>
                  <p className="font-medium">#{o.id.slice(-8)}</p>
                  <p className="text-sm text-neutral-500">{o.items.length} item(s) · {o.createdAt.toLocaleDateString("en-IN")}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{inr(o.total)}</p>
                  <p className="text-xs text-neutral-500">{o.status}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
