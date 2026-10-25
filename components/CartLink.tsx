"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartLink() {
  const { count } = useCart();
  return (
    <Link href="/cart" className="rounded-full border px-3 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">
      Cart ({count})
    </Link>
  );
}
