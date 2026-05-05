import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Cookie, ShoppingBag, Image as ImageIcon, Webhook, LogOut } from "lucide-react";
import logo from "@/assets/logo.png";
import { useEffect } from "react";

const links = [
  { to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/produtos", label: "Produtos", icon: Cookie },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/admin/midias", label: "Mídias", icon: ImageIcon },
  { to: "/admin/webhook", label: "Webhook", icon: Webhook },
];

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && !user) nav("/auth");
  }, [user, loading, nav]);

  if (loading) return <div className="p-10 text-center">Carregando...</div>;
  if (!user) return null;
  if (!isAdmin) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 gap-4">
      <h1 className="font-display text-3xl text-primary">Acesso negado</h1>
      <p className="text-muted-foreground">Sua conta não tem permissão de admin.</p>
      <Button onClick={async () => { await supabase.auth.signOut(); nav("/auth"); }}>Sair</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/50 flex">
      <aside className="w-60 bg-primary text-primary-foreground p-5 hidden md:flex flex-col gap-1 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <img src={logo} alt="" className="h-10 w-10 rounded-xl" />
          <span className="font-display text-lg leading-tight">CRUNCH<br /><span className="text-xs font-script">admin</span></span>
        </Link>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.end}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${isActive ? "bg-primary-foreground text-primary" : "hover:bg-primary-foreground/10"}`}>
            <l.icon className="h-4 w-4" /> {l.label}
          </NavLink>
        ))}
        <div className="mt-auto pt-4 border-t border-primary-foreground/20">
          <p className="text-xs opacity-70 mb-2 truncate">{user.email}</p>
          <Button variant="secondary" size="sm" className="w-full" onClick={async () => { await supabase.auth.signOut(); nav("/auth"); }}>
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 inset-x-0 z-30 bg-primary text-primary-foreground px-4 py-3 flex items-center gap-2 overflow-x-auto">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.end}
            className={({ isActive }) => `flex items-center gap-1 rounded-full px-3 py-1.5 text-xs whitespace-nowrap ${isActive ? "bg-primary-foreground text-primary" : "bg-primary-foreground/10"}`}>
            <l.icon className="h-3 w-3" /> {l.label}
          </NavLink>
        ))}
      </div>

      <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10 max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
}