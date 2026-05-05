import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

export default function Auth() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Bem-vindo!" });
        nav("/admin");
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast({ title: "Conta criada", description: "Faça login para entrar." });
        setMode("login");
      }
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-6">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Crunch" className="h-16 w-16 rounded-2xl mb-3" />
          <h1 className="font-display text-3xl text-primary">Painel Admin</h1>
          <p className="text-sm text-muted-foreground">Crunch Cookies</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" disabled={busy} className="w-full rounded-full">
            {busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {mode === "login" ? (
            <button onClick={() => setMode("signup")} className="text-primary hover:underline">Criar conta admin</button>
          ) : (
            <button onClick={() => setMode("login")} className="text-primary hover:underline">Já tenho conta</button>
          )}
        </div>
        <p className="mt-4 text-xs text-muted-foreground text-center">
          As 2 primeiras contas criadas viram admin automaticamente.
        </p>
        <Link to="/" className="mt-4 block text-center text-xs text-muted-foreground hover:text-primary">← voltar para a loja</Link>
      </Card>
    </div>
  );
}