"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { productId: string; title: string; price: number; image: string; qty: number };

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: Omit<CartItem, "qty">) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "shopstack-cart";

// Lives in the ROOT layout, so cart state survives client-side navigation
// between every route group (shop / auth / dashboard).
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.qty * i.price, 0),
      add: (item) =>
        setItems((prev) => {
          const found = prev.find((p) => p.productId === item.productId);
          return found
            ? prev.map((p) => (p.productId === item.productId ? { ...p, qty: p.qty + 1 } : p))
            : [...prev, { ...item, qty: 1 }];
        }),
      setQty: (productId, qty) =>
        setItems((prev) =>
          qty <= 0 ? prev.filter((p) => p.productId !== productId) : prev.map((p) => (p.productId === productId ? { ...p, qty } : p))
        ),
      clear: () => setItems([]),
    }),
    [items]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
