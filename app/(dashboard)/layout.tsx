import { Suspense } from "react";
import Link from "next/link";
import { requireUser } from "@/lib/session";

async function Frame({ children }: { children: React.ReactNode }) {
  const session = await requireUser(); // 2nd line of defence after proxy.ts
  const isAdmin = (session.user as { role?: string }).role === "ADMIN";
  const link = "block rounded-lg px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800";
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[200px_1fr]">
      <aside className="space-y-1">
        <p className="px-3 pb-2 text-xs uppercase tracking-wide text-neutral-500">{session.user.name}</p>
        <Link href="/dashboard" className={link}>Overview</Link>
        <Link href="/dashboard/orders" className={link}>My orders</Link>
        {isAdmin && (
          <>
            <p className="px-3 pt-4 pb-1 text-xs uppercase tracking-wide text-neutral-500">Admin</p>
            <Link href="/admin/products" className={link}>Products</Link>
            <Link href="/admin/orders" className={link}>All orders</Link>
          </>
        )}
      </aside>
      <main>{children}</main>
    </div>
  );
}

// Shared frame for /dashboard/* and /admin/* (route group, not part of the URL)
export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl p-6"><div className="h-40 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" /></div>}>
      <Frame>{children}</Frame>
    </Suspense>
  );
}
