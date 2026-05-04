import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product } from "@/data/products";

export type CartItem = { product: Product; qty: number };

type CartCtx = {
  items: CartItem[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("crunch-cart") || "[]"); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem("crunch-cart", JSON.stringify(items)); }, [items]);

  const add = (p: Product) => setItems(prev => {
    const f = prev.find(i => i.product.id === p.id);
    return f ? prev.map(i => i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { product: p, qty: 1 }];
  });
  const remove = (id: string) => setItems(prev => prev.filter(i => i.product.id !== id));
  const setQty = (id: string, qty: number) => setItems(prev => qty <= 0 ? prev.filter(i => i.product.id !== id) : prev.map(i => i.product.id === id ? { ...i, qty } : i));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return <Ctx.Provider value={{ items, add, remove, setQty, clear, total, count }}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
};