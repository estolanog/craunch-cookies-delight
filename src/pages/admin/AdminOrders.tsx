import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const load = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    load();
  };
  const del = async (id: string) => {
    if (!confirm("Excluir este pedido?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-primary">Pedidos</h1>
        <p className="text-muted-foreground">{orders.length} pedidos no total</p>
      </div>
      <div className="space-y-3">
        {orders.length === 0 && <p className="text-muted-foreground">Nenhum pedido ainda.</p>}
        {orders.map(o => (
          <Card key={o.id} className="p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-bold text-primary text-lg">{o.customer_name}</p>
                <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("pt-BR")}</p>
                <p className="text-sm mt-1">{o.location === "vitabela" ? "📍 Vitabela (grátis)" : `📍 Outro: ${o.address ?? ""}`}</p>
                <p className="text-sm">💳 {o.payment}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl text-primary">{fmt(Number(o.subtotal))}</p>
                <p className="text-xs text-muted-foreground">{o.item_count} itens</p>
              </div>
            </div>
            <div className="mt-3 border-t pt-3 space-y-1">
              {(o.items ?? []).map((it: any, i: number) => (
                <div key={i} className="text-sm flex justify-between">
                  <span>{it.qty}× {it.name}</span>
                  <span>{fmt(Number(it.price) * it.qty)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {["novo", "preparando", "entregue", "cancelado"].map(s => (
                <Button key={s} size="sm" variant={o.status === s ? "default" : "outline"} className="rounded-full" onClick={() => setStatus(o.id, s)}>{s}</Button>
              ))}
              <Button size="icon" variant="ghost" className="ml-auto" onClick={() => del(o.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
