import { Button } from "@/components/ui/button";
import { CartProvider, useCart } from "@/context/CartContext";
import { CartSheet } from "@/components/CartSheet";
import { products, heroChocolate } from "@/data/products";
import logo from "@/assets/logo.png";
import { Plus, Truck, Instagram, MessageCircle, MapPin } from "lucide-react";
import { useProducts, toDisplayProduct } from "@/hooks/useProducts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex items-center justify-between py-3">
        <a href="#top" className="flex items-center gap-3">
          <img src={logo} alt="Crunch Cookies" className="h-12 w-12 rounded-xl" />
          <span className="font-display text-xl text-primary hidden sm:block">CRUNCH<span className="font-script ml-1 text-base">cookies</span></span>
        </a>
        <nav className="hidden md:flex gap-6 font-bold text-primary/80">
          <a href="#cardapio" className="hover:text-primary">Cardápio</a>
          <a href="#entrega" className="hover:text-primary">Entrega</a>
          <a href="#contato" className="hover:text-primary">Contato</a>
        </nav>
        <CartSheet />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-primary text-primary-foreground">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(hsl(var(--primary-foreground) / 0.35) 1.5px, transparent 1.5px), radial-gradient(hsl(var(--primary-foreground) / 0.2) 1px, transparent 1px)`,
          backgroundSize: `28px 28px, 28px 28px`,
          backgroundPosition: `0 0, 14px 14px`,
        }}
      />
      <div className="container relative grid gap-10 py-16 md:grid-cols-2 md:py-24 md:items-center">
        <div>
          <span className="inline-block rounded-full bg-primary-foreground/15 px-4 py-1 font-script text-xl">cookies recheados artesanais</span>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] sm:text-7xl">
            CRUNCH<br />
            <span className="font-script text-4xl sm:text-5xl">cookies que estouram de sabor</span>
          </h1>
          <p className="mt-6 max-w-md text-lg opacity-90">
            Crocantes por fora, recheios cremosos por dentro. Feitos no capricho e entregues fresquinhos pra você.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <a href="#cardapio">Ver cardápio</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
              <a href="#entrega"><Truck className="mr-2 h-5 w-5" /> Entrega Vitabela grátis</a>
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 rounded-[3rem] bg-primary-foreground/10 blur-2xl" />
          <video
            src="/video-hero.mp4"
            autoPlay loop muted playsInline
            className="relative aspect-square w-full rounded-[2rem] object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p }: { p: typeof products[number] }) {
  const { add } = useCart();
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        {p.soldOut && (
          <div className="absolute left-3 top-3 -rotate-6 rounded-md bg-destructive px-3 py-1 text-sm font-display text-destructive-foreground shadow-lg">
            ESGOTADO
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl text-primary">{p.name}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-2xl text-primary">{fmt(p.price)}</span>
          <Button
            size="sm"
            disabled={p.soldOut}
            onClick={() => add(p)}
            className="rounded-full"
          >
            <Plus className="mr-1 h-4 w-4" /> Adicionar
          </Button>
        </div>
      </div>
    </article>
  );
}

function Catalog() {
  const { items } = useProducts({ onlyActive: true });
  const list = items.length ? items.map(toDisplayProduct) : products;
  return (
    <section id="cardapio" className="container py-20">
      <div className="mb-10 text-center">
        <p className="font-script text-2xl text-primary/70">nosso cardápio</p>
        <h2 className="font-display text-4xl text-primary sm:text-6xl">SABORES IRRESISTÍVEIS</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}

function Featured() {
  return (
    <section className="relative overflow-hidden bg-secondary py-20">
      <div className="container grid gap-10 md:grid-cols-2 md:items-center">
        <img src={heroChocolate} alt="Cookie de chocolate recheado" loading="lazy" className="mx-auto w-full max-w-md rounded-[2rem] shadow-[var(--shadow-cookie)]" />
        <div>
          <p className="font-script text-2xl text-primary/70">recheio que escorre</p>
          <h2 className="font-display text-4xl text-primary sm:text-5xl">CADA MORDIDA<br />É UMA EXPLOSÃO</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Massa crocante por fora, fofinha por dentro e aquele recheio cremoso que faz qualquer dia ficar melhor. Receitas próprias, ingredientes selecionados e muito carinho em cada cookie.
          </p>
        </div>
      </div>
    </section>
  );
}

function Delivery() {
  return (
    <section id="entrega" className="container py-20">
      <div className="rounded-[2rem] bg-primary p-10 text-primary-foreground sm:p-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-script text-2xl opacity-80">entrega</p>
            <h2 className="font-display text-4xl sm:text-5xl">COMO RECEBER<br />SEUS COOKIES</h2>
          </div>
          <div className="space-y-5 text-lg">
            <div className="flex gap-4">
              <MapPin className="h-7 w-7 shrink-0" />
              <div>
                <p className="font-bold">Condomínio Vitabela</p>
                <p className="opacity-80">Entrega <strong>grátis</strong> direto na sua porta.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Truck className="h-7 w-7 shrink-0" />
              <div>
                <p className="font-bold">Demais endereços</p>
                <p className="opacity-80">Taxa de entrega combinada via WhatsApp conforme sua região.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <MessageCircle className="h-7 w-7 shrink-0" />
              <div>
                <p className="font-bold">Pedido pelo WhatsApp</p>
                <p className="opacity-80">Monte seu carrinho e envie em 1 clique. Confirmamos por lá.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contato" className="bg-primary py-12 text-primary-foreground">
      <div className="container flex flex-col items-center gap-4 text-center">
        <img src={logo} alt="Crunch Cookies" className="h-16 w-16 rounded-2xl" />
        <p className="font-display text-2xl">CRUNCH <span className="font-script text-xl">cookies</span></p>
        <div className="flex gap-4">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-full bg-primary-foreground/10 p-3 hover:bg-primary-foreground/20">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="rounded-full bg-primary-foreground/10 p-3 hover:bg-primary-foreground/20">
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
        <p className="text-sm opacity-70">© {new Date().getFullYear()} Crunch Cookies — feito com muito amor 🍪</p>
      </div>
    </footer>
  );
}

const Index = () => (
  <CartProvider>
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Catalog />
        <Featured />
        <Delivery />
      </main>
      <Footer />
    </div>
  </CartProvider>
);

export default Index;
