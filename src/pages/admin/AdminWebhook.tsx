import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

export default function AdminWebhook() {
  const [url, setUrl] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("webhook_settings").select("*").eq("id", 1).single().then(({ data }) => {
      if (data) { setUrl(data.url ?? ""); setEnabled(data.enabled); }
    });
  }, []);

  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("webhook_settings").update({ url, enabled, updated_at: new Date().toISOString() }).eq("id", 1);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else toast({ title: "Salvo" });
    setBusy(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-4xl text-primary">Webhook</h1>
        <p className="text-muted-foreground">Receba uma notificação POST a cada novo pedido (Zapier, n8n, Make…)</p>
      </div>
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Webhook ativo</p>
            <p className="text-sm text-muted-foreground">Quando ligado, dispara em cada novo pedido</p>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
        <div>
          <Label>URL de destino</Label>
          <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://hooks.zapier.com/..." />
        </div>
        <div className="rounded-xl bg-secondary p-3 text-xs font-mono whitespace-pre-wrap">{`POST {sua URL}
Content-Type: application/json

{
  "event": "order.created",
  "order": {
    "id": "...", "customer_name": "...", "address": "...",
    "location": "vitabela|outro", "payment": "pix|cartão|dinheiro",
    "subtotal": 25.0, "item_count": 2,
    "items": [{ "id": "...", "name": "...", "price": 12.5, "qty": 1 }],
    "created_at": "..."
  }
}`}</div>
        <Button onClick={save} disabled={busy} className="rounded-full">Salvar</Button>
      </Card>
    </div>
  );
}
