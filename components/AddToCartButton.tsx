"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { ProductDTO } from "@/models/Product";

export default function AddToCartButton({ product }: { product: ProductDTO }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      disabled={product.stock === 0}
      onClick={() => {
        add({ productId: product.id, title: product.title, price: product.price, image: product.image });
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      className="rounded-full bg-black px-6 py-2.5 text-white disabled:opacity-40 dark:bg-white dark:text-black"
    >
      {product.stock === 0 ? "Sold out" : added ? "Added ✓" : "Add to cart"}
    </button>
  );
}
