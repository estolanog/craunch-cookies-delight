import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Upload, Trash2 } from "lucide-react";

type Media = { id: string; key: string; label: string; url: string; kind: string };

const PRESET_KEYS = [
  { key: "hero_video", label: "Vídeo do Hero (topo da página)" },
  { key: "featured_image", label: "Imagem da seção 'Cada mordida'" },
];

export default function AdminMedia() {
  const [items, setItems] = useState<Media[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("media").select("*").order("updated_at", { ascending: false });
    setItems((data ?? []) as Media[]);
  };
  useEffect(() => { load(); }, []);

  const uploadFor = async (file: File, key: string, label: string) => {
    setBusy(key);
    const path = `media/${key}-${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, file);
    if (error) { toast({ title: "Erro upload", description: error.message, variant: "destructive" }); setBusy(null); return; }
    const { data: pub } = supabase.storage.from("site-assets").getPublicUrl(path);
    const kind = file.type.startsWith("video") ? "video" : "image";
    const { error: upErr } = await supabase.from("media").upsert({ key, label, url: pub.publicUrl, kind, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (upErr) toast({ title: "Erro", description: upErr.message, variant: "destructive" });
    else { toast({ title: "Mídia atualizada" }); load(); }
    setBusy(null);
  };

  const remove = async (id: string) => {
    if (!confirm("Remover essa mídia?")) return;
    await supabase.from("media").delete().eq("id", id);
    load();
  };

  const findByKey = (k: string) => items.find(i => i.key === k);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-primary">Mídias do site</h1>
        <p className="text-muted-foreground">Substitua o vídeo do hero e imagens da página inicial.</p>
      </div>

      <div className="grid gap-4">
        {PRESET_KEYS.map(({ key, label }) => {
          const cur = findByKey(key);
          return (
            <Card key={key} className="p-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="h-20 w-32 bg-secondary rounded-xl overflow-hidden shrink-0">
                  {cur?.kind === "video" && <video src={cur.url} className="h-full w-full object-cover" muted />}
                  {cur?.kind === "image" && <img src={cur.url} className="h-full w-full object-cover" alt="" />}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-primary">{label}</p>
                  <p className="text-xs text-muted-foreground">key: <code>{key}</code></p>
                </div>
                <label className="cursor-pointer">
                  <input type="file" accept="image/*,video/*" hidden onChange={e => e.target.files?.[0] && uploadFor(e.target.files[0], key, label)} />
                  <Button type="button" variant="outline" disabled={busy === key} asChild>
                    <span><Upload className="mr-2 h-4 w-4" /> {busy === key ? "Enviando..." : "Substituir"}</span>
                  </Button>
                </label>
                {cur && <Button size="icon" variant="ghost" onClick={() => remove(cur.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
