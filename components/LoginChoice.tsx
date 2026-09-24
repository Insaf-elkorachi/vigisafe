"use client";

import { useState } from "react";
import { BarChart3, ChevronRight, HardHat, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import { Toast } from "@/components/ui/Toast";

const profiles = [
  { label: "Rapporteur", sub: "Declarer un HAZARD", email: "karim@example.com", target: "/remonteur", icon: HardHat },
  { label: "Responsable HSE", sub: "Suivre et traiter les hazards", email: "hse@example.com", target: "/hse", icon: ShieldCheck },
  { label: "Directeur", sub: "Vue globale et indicateurs", email: "directeur@example.com", target: "/directeur", icon: BarChart3 }
];

export function LoginChoice() {
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  async function login(email: string, target: string) {
    setLoading(email);
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password: "DemoHSE2026!" })
    });
    if (!response.ok) {
      setError("Connexion impossible. Lancez le seed Prisma pour creer les comptes demo.");
      setLoading("");
      return;
    }
    window.location.replace(target);
  }

  return (
    <>
      <div className="rounded-lg border border-slate-200/80 bg-white shadow-lift">
        <div className="border-b border-slate-100 px-6 py-6 md:px-8">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase text-primary">
            <LockKeyhole size={15} /> Acces securise
          </div>
          <h2 className="text-2xl font-extrabold text-navy">Connexion</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Selectionnez votre espace de travail pour continuer.</p>
        </div>
        <div className="grid gap-3 px-6 py-5 md:px-8">
          {profiles.map((profile, index) => {
            const Icon = profile.icon;
            const primary = index === 0;
            return (
              <button
                key={profile.email}
                disabled={Boolean(loading)}
                onClick={() => login(profile.email, profile.target)}
                className={`focus-ring group flex min-h-20 items-center justify-between rounded-md border p-4 text-left disabled:cursor-wait disabled:opacity-70 ${primary ? "border-primary bg-primary text-white shadow-[0_8px_20px_rgba(0,120,212,0.2)] hover:bg-[#006cbe]" : "border-slate-200 bg-white text-navy hover:border-primary/60 hover:bg-primary/[0.035]"}`}
              >
                <span className="flex items-center gap-4">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-md ${primary ? "bg-white/15" : "bg-slate-100 text-primary group-hover:bg-primary/10"}`}><Icon size={23} /></span>
                  <span>
                    <span className="block font-bold">{profile.label}</span>
                    <span className={`mt-0.5 block text-xs ${primary ? "text-white/80" : "text-slate-500"}`}>{profile.sub}</span>
                  </span>
                </span>
                {loading === profile.email ? <LoaderCircle className="animate-spin" size={20} /> : <ChevronRight className="transition-transform group-hover:translate-x-0.5" size={20} />}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-xs text-slate-500 md:px-8">
          <span>Comptes de demonstration</span>
          <span className="flex items-center gap-1.5 font-semibold text-success"><span className="h-2 w-2 rounded-full bg-success" /> Systeme disponible</span>
        </div>
      </div>
      <Toast message={error} type="error" />
    </>
  );
}
