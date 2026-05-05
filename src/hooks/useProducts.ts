import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { products as fallbackProducts, Product } from "@/data/products";

const fallbackImageBySlug = Object.fromEntries(fallbackProducts.map(p => [p.id, p.image]));

export type DbProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  sort_order: number;
  sold_out: boolean;
  active: boolean;
};

export function toDisplayProduct(p: DbProduct): Product {
  return {
    id: p.slug,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    image: p.image_url || fallbackImageBySlug[p.slug] || "",
    soldOut: p.sold_out,
  };
}

export function useProducts(opts: { onlyActive?: boolean } = { onlyActive: true }) {
  const [items, setItems] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    let q = supabase.from("products").select("*").order("sort_order", { ascending: true });
    if (opts.onlyActive) q = q.eq("active", true);
    const { data } = await q;
    setItems((data ?? []) as DbProduct[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return { items, loading, reload: load };
}