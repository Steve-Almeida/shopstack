import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { inr } from "@/lib/format";

export const metadata: Metadata = { title: "Admin · Orders", robots: { index: false } };

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: { select: { name: true, email: true } }, items: true },
  });

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">All orders</h1>
      <ul className="divide-y rounded-2xl border">
        {orders.map((o) => (
          <li key={o.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">#{o.id.slice(-8)} · {o.user.name}</p>
              <p className="text-sm text-neutral-500">{o.user.email} · {o.items.length} item(s)</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{inr(o.total)}</p>
              <p className="text-xs text-neutral-500">{o.status}</p>
            </div>
          </li>
        ))}
        {orders.length === 0 && <li className="p-4 text-neutral-500">No orders yet.</li>}
      </ul>
    </>
  );
}
