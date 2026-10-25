import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { inr } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };

export default async function DashboardPage() {
  const { user } = await requireUser();
  const [agg, recent] = await Promise.all([
    prisma.order.aggregate({ where: { userId: user.id }, _count: true, _sum: { total: true } }),
    prisma.order.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
  ]);

  const stats = [
    { label: "Orders", value: agg._count },
    { label: "Total spent", value: inr(agg._sum.total ?? 0) },
    { label: "Last order", value: recent ? recent.createdAt.toLocaleDateString("en-IN") : "—" },
  ];

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">Hi, {user.name} 👋</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border p-5">
            <p className="text-sm text-neutral-500">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
