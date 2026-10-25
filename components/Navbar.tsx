import Link from "next/link";
import { Suspense } from "react";
import { getSession } from "@/lib/session";
import CartLink from "./CartLink";
import SignOutButton from "./SignOutButton";

async function AuthLinks() {
  const session = await getSession();
  if (!session) {
    return (
      <>
        <Link href="/login" className="text-sm hover:underline">Log in</Link>
        <Link href="/signup" className="rounded-full bg-black px-3 py-1 text-sm text-white dark:bg-white dark:text-black">Sign up</Link>
      </>
    );
  }
  const isAdmin = (session.user as { role?: string }).role === "ADMIN";
  return (
    <>
      <Link href="/dashboard" className="text-sm hover:underline">Dashboard</Link>
      {isAdmin && <Link href="/admin/products" className="text-sm hover:underline">Admin</Link>}
      <SignOutButton />
    </>
  );
}

export default function Navbar() {
  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold tracking-tight">ShopStack</Link>
          <Link href="/products" className="text-sm hover:underline">Products</Link>
        </div>
        <div className="flex items-center gap-3">
          <CartLink />
          {/* session read is request-time data → streamed behind Suspense */}
          <Suspense fallback={<span className="h-6 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />}>
            <AuthLinks />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
