"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ClipboardList, FileText, LayoutDashboard, LoaderCircle, LogOut, PlusCircle, Settings, User, AlertTriangle } from "lucide-react";
import { Role } from "@prisma/client";

const roleBase: Record<Role, string> = {
  REMONTEUR: "/remonteur",
  RESPONSABLE_HSE: "/hse",
  DIRECTEUR: "/directeur"
};

export function AppShell({ role, name, children }: { role: Role; name: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const base = roleBase[role];
  const items =
    role === "REMONTEUR"
      ? [
          { href: "/remonteur", label: "Declarer un HAZARD", icon: PlusCircle },
          { href: "/remonteur/mes-remontees", label: "Mes declarations", icon: ClipboardList },
          { href: "/remonteur/profil", label: "Profil", icon: User }
        ]
      : [
          { href: base, label: "Tableau de bord", icon: LayoutDashboard },
          { href: `${base}/remontees`, label: "Liste des hazards", icon: ClipboardList },
          { href: `${base}/rapports`, label: "Rapports", icon: FileText },
          { href: `${base}/parametres`, label: "Parametres", icon: Settings }
        ];

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed");
      window.location.replace("/");
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-background md:grid md:grid-cols-[240px_1fr]">
      <aside className="flex flex-col bg-navy p-3 text-white md:sticky md:top-0 md:h-screen md:p-4">
        <div className="mb-3 flex items-center gap-3 px-1 md:mb-8">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-white text-navy"><AlertTriangle size={24} /></div>
          <div>
            <div className="font-bold">VigiSafe</div>
            <div className="text-xs text-white/70">{role === "REMONTEUR" ? "Rapporteur" : role === "RESPONSABLE_HSE" ? "Responsable HSE" : "Directeur"}</div>
          </div>
        </div>
        <nav className="flex flex-1 gap-1 overflow-x-auto pb-1 md:flex-col md:gap-2 md:overflow-visible md:pb-0">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`focus-ring flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold md:gap-3 md:py-3 ${active ? "bg-primary text-white shadow-sm" : "text-white/80 hover:bg-white/10 hover:text-white"}`}>
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={logout} disabled={loggingOut} className="focus-ring mt-2 hidden items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-white/85 hover:bg-white/10 disabled:cursor-wait disabled:opacity-70 md:flex">
          {loggingOut ? <LoaderCircle className="animate-spin" size={18} /> : <LogOut size={18} />} {loggingOut ? "Deconnexion..." : "Deconnexion"}
        </button>
      </aside>
      <main className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur md:justify-end md:px-6">
          <div className="text-sm font-bold text-navy md:hidden">Espace HSE</div>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-navy text-sm font-bold text-white">{name.slice(0, 2).toUpperCase()}</div>
            <div className="text-sm">
              <div className="font-bold">{name}</div>
              <div className="text-xs text-slate-500">{role.replace("_", " ")}</div>
            </div>
          </div>
        </header>
        <div className="mx-auto w-full max-w-[1600px] p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
