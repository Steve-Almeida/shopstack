"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useCart } from "@/components/CartProvider";
import { authClient } from "@/lib/auth-client";
import { checkout } from "@/actions/orders";
import { inr } from "@/lib/format";

export default function CartPage() {
  const { items, total, setQty, clear } = useCart();
  const { data: session } = authClient.useSession();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-neutral-500">Your cart is empty.</p>
        <Link href="/products" className="mt-3 inline-block underline">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-semibold">Your cart</h1>
      <ul className="divide-y rounded-2xl border">
        {items.map((i) => (
          <li key={i.productId} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium">{i.title}</p>
              <p className="text-sm text-neutral-500">{inr(i.price)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-7 w-7 rounded border" onClick={() => setQty(i.productId, i.qty - 1)}>−</button>
              <span className="w-6 text-center">{i.qty}</span>
              <button className="h-7 w-7 rounded border" onClick={() => setQty(i.productId, i.qty + 1)}>+</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-lg font-semibold">Total: {inr(total)}</p>
        {session ? (
          <button
            disabled={pending}
            onClick={() =>
              start(async () => {
                setError(null);
                const res = await checkout(items.map((i) => ({ productId: i.productId, qty: i.qty })));
                // checkout() redirects on success; we only get here on error
                if (res?.error) setError(res.error);
                else clear();
              })
            }
            className="rounded-full bg-black px-6 py-2.5 text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {pending ? "Placing order…" : "Checkout"}
          </button>
        ) : (
          <Link href="/login?next=/cart" className="rounded-full bg-black px-6 py-2.5 text-white dark:bg-white dark:text-black">
            Log in to checkout
          </Link>
        )}
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
