import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

const WHATSAPP = "5511999999999"; // placeholder — usuário pode trocar

export function CartSheet() {
  const { items, count, total, setQty, remove, clear } = useCart();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("vitabela");
  const [payment, setPayment] = useState("pix");

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const sendWhatsApp = () => {
    if (!items.length) return;
    const lines = [
      "*Novo Pedido — Crunch Cookies* 🍪",
      "",
      `*Cliente:* ${name || "—"}`,
      `*Endereço:* ${address || "—"}`,
      `*Local:* ${location === "vitabela" ? "Condomínio Vitabela (entrega grátis)" : "Outro endereço (taxa de entrega a combinar)"}`,
      `*Pagamento:* ${payment.toUpperCase()}`,
      "",
      "*Itens:*",
      ...items.map(i => `• ${i.qty}x ${i.product.name} — ${fmt(i.product.price * i.qty)}`),
      "",
      `*Subtotal:* ${fmt(total)}`,
      location !== "vitabela" ? "_Taxa de entrega será combinada por aqui._" : "_Entrega grátis no Vitabela._",
    ];
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="relative rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
          <ShoppingBag className="mr-2 h-5 w-5" /> Carrinho
          {count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-background text-primary border-2 border-primary text-xs font-bold">
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display text-3xl text-primary">Seu Pedido</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <p className="mt-10 text-center text-muted-foreground">Seu carrinho está vazio. Escolha seus cookies! 🍪</p>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map(i => (
              <div key={i.product.id} className="flex gap-3 rounded-2xl bg-secondary p-3">
                <img src={i.product.image} alt={i.product.name} className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-primary">{i.product.name}</p>
                      <p className="text-sm text-muted-foreground">{fmt(i.product.price)}</p>
                    </div>
                    <button onClick={() => remove(i.product.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-7 w-7 rounded-full" onClick={() => setQty(i.product.id, i.qty - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center font-bold">{i.qty}</span>
                    <Button size="icon" variant="outline" className="h-7 w-7 rounded-full" onClick={() => setQty(i.product.id, i.qty + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-3 pt-4 border-t">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" />
              </div>
              <div>
                <Label htmlFor="addr">Endereço / Apartamento</Label>
                <Input id="addr" value={address} onChange={e => setAddress(e.target.value)} placeholder="Rua, número, bloco, apto" />
              </div>
              <div>
                <Label>Local de entrega</Label>
                <RadioGroup value={location} onValueChange={setLocation} className="mt-2 space-y-2">
                  <div className="flex items-center gap-2 rounded-xl border p-3">
                    <RadioGroupItem value="vitabela" id="vita" />
                    <Label htmlFor="vita" className="flex-1 cursor-pointer">
                      <span className="font-bold">Condomínio Vitabela</span>
                      <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">Entrega grátis</span>
                    </Label>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border p-3">
                    <RadioGroupItem value="outro" id="outro" />
                    <Label htmlFor="outro" className="flex-1 cursor-pointer">
                      <span className="font-bold">Outro endereço</span>
                      <span className="ml-2 text-xs text-muted-foreground">Taxa combinada no WhatsApp</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>Forma de pagamento</Label>
                <RadioGroup value={payment} onValueChange={setPayment} className="mt-2 grid grid-cols-3 gap-2">
                  {["pix", "cartão", "dinheiro"].map(p => (
                    <div key={p} className="flex items-center gap-2 rounded-xl border p-2">
                      <RadioGroupItem value={p} id={p} />
                      <Label htmlFor={p} className="cursor-pointer capitalize">{p}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-bold">Total</span>
                <span className="font-display text-2xl text-primary">{fmt(total)}</span>
              </div>

              <Button onClick={sendWhatsApp} className="w-full rounded-full bg-[#25D366] py-6 text-base font-bold hover:bg-[#1fb358]">
                Enviar pedido pelo WhatsApp
              </Button>
              <Button onClick={clear} variant="ghost" className="w-full">Limpar carrinho</Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}