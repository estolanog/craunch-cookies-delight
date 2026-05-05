import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ShoppingBag, DollarSign, Cookie, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Dashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, items: 0, today: 0 });
  const [byDay, setByDay] = useState<{ day: string; orders: number; revenue: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; qty: number }[]>([]);

  useEffect(() => {
    (async () => {
      const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      const all = orders ?? [];
      const revenue = all.reduce((s: number, o: any) => s + Number(o.subtotal), 0);
      const items = all.reduce((s: number, o: any) => s + (o.item_count ?? 0), 0);
      const todayStr = new Date().toISOString().slice(0, 10);
      const today = all.filter((o: any) => o.created_at.startsWith(todayStr)).length;
      setStats({ orders: all.length, revenue, items, today });

      const map = new Map<string, { orders: number; revenue: number }>();
      for (let i = 13; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        map.set(d.toISOString().slice(0, 10), { orders: 0, revenue: 0 });
      }
      all.forEach((o: any) => {
        const k = o.created_at.slice(0, 10);
        if (map.has(k)) {
          const v = map.get(k)!;
          v.orders += 1; v.revenue += Number(o.subtotal);
        }
      });
      setByDay(Array.from(map.entries()).map(([day, v]) => ({ day: day.slice(5), ...v })));

      const counts = new Map<string, number>();
      all.forEach((o: any) => (o.items ?? []).forEach((it: any) => {
        counts.set(it.name, (counts.get(it.name) ?? 0) + (it.qty ?? 0));
      }));
      setTopProducts(Array.from(counts.entries())
        .map(([name, qty]) => ({ name, qty }))
        .sort((a, b) => b.qty - a.qty).slice(0, 6));
    })();
  }, []);

  const Stat = ({ icon: Icon, label, value }: any) => (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-3 text-primary"><Icon className="h-5 w-5" /></div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-display text-2xl text-primary">{value}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-primary">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da loja</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={ShoppingBag} label="Total de pedidos" value={stats.orders} />
        <Stat icon={DollarSign} label="Faturamento" value={fmt(stats.revenue)} />
        <Stat icon={Cookie} label="Cookies vendidos" value={stats.items} />
        <Stat icon={TrendingUp} label="Pedidos hoje" value={stats.today} />
      </div>

      <Card className="p-5">
        <h2 className="font-display text-xl text-primary mb-4">Pedidos nos últimos 14 dias</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={byDay}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-display text-xl text-primary mb-4">Sabores mais pedidos</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="qty" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
