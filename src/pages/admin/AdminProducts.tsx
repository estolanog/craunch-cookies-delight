import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProducts, DbProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";

const empty: Partial<DbProduct> = { slug: "", name: "", description: "", price: 0, image_url: "", sort_order: 0, sold_out: false, active: true };

export default function AdminProducts() {
  const { items, reload } = useProducts({ onlyActive: false });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<DbProduct>>(empty);
  const [uploading, setUploading] = useState(false);

  const openNew = () => { setEditing(empty); setOpen(true); };
  const openEdit = (p: DbProduct) => { setEditing(p); setOpen(true); };

  const upload = async (file: File) => {
    setUploading(true);
    const path = `products/${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Erro upload", description: error.message, variant: "destructive" }); setUploading(false); return; }
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    setEditing(prev => ({ ...prev, image_url: data.publicUrl }));
    setUploading(false);
  };

  const save = async () => {
    const payload = {
      slug: (editing.slug ?? "").trim(),
      name: (editing.name ?? "").trim(),
      description: editing.description ?? "",
      price: Number(editing.price),
      image_url: editing.image_url ?? "",
      sort_order: Number(editing.sort_order ?? 0),
      sold_out: !!editing.sold_out,
      active: editing.active !== false,
    };
    const op = editing.id
      ? supabase.from("products").update(payload).eq("id", editing.id)
      : supabase.from("products").insert(payload);
    const { error } = await op;
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Salvo!" });
    setOpen(false); reload();
  };

  const remove = async (id: string) => {
    if (!confirm("Remover este produto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Removido" }); reload(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-primary">Produtos</h1>
          <p className="text-muted-foreground">Gerencie o catálogo</p>
        </div>
        <Button onClick={openNew} className="rounded-full"><Plus className="mr-2 h-4 w-4" /> Novo</Button>
      </div>

      <div className="grid gap-3">
        {items.map(p => (
          <Card key={p.id} className="p-4 flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-secondary overflow-hidden shrink-0">
              {p.image_url && <img src={p.image_url} className="h-full w-full object-cover" alt="" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-primary">{p.name}</p>
                {!p.active && <span className="text-xs bg-muted px-2 py-0.5 rounded">oculto</span>}
                {p.sold_out && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">esgotado</span>}
              </div>
              <p className="text-sm text-muted-foreground truncate">{p.description}</p>
              <p className="text-sm font-bold">R$ {Number(p.price).toFixed(2)}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing.id ? "Editar" : "Novo"} produto</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Imagem</Label>
              <div className="flex items-center gap-3 mt-1">
                <div className="h-20 w-20 rounded-xl bg-secondary overflow-hidden">
                  {editing.image_url && <img src={editing.image_url} className="h-full w-full object-cover" alt="" />}
                </div>
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" hidden onChange={e => e.target.files?.[0] && upload(e.target.files[0])} />
                  <Button type="button" variant="outline" disabled={uploading} asChild>
                    <span><Upload className="mr-2 h-4 w-4" /> {uploading ? "Enviando..." : "Enviar imagem"}</span>
                  </Button>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Nome</Label><Input value={editing.name ?? ""} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Slug (id)</Label><Input value={editing.slug ?? ""} onChange={e => setEditing({ ...editing, slug: e.target.value })} placeholder="ex: red-velvet" /></div>
            </div>
            <div><Label>Descrição</Label><Textarea value={editing.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Preço (R$)</Label><Input type="number" step="0.01" value={editing.price ?? 0} onChange={e => setEditing({ ...editing, price: parseFloat(e.target.value) })} /></div>
              <div><Label>Ordem</Label><Input type="number" value={editing.sort_order ?? 0} onChange={e => setEditing({ ...editing, sort_order: parseInt(e.target.value) })} /></div>
            </div>
            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2"><Switch checked={editing.active !== false} onCheckedChange={v => setEditing({ ...editing, active: v })} /> Ativo</label>
              <label className="flex items-center gap-2"><Switch checked={!!editing.sold_out} onCheckedChange={v => setEditing({ ...editing, sold_out: v })} /> Esgotado</label>
            </div>
            <Button onClick={save} className="w-full rounded-full">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
