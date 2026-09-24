import Link from "next/link";
import { AlertTriangle, ArrowRight, BadgeCheck, Clock3, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { LoginChoice } from "@/components/LoginChoice";
import { SafetyChat } from "@/components/public/SafetyChat";
import { SafetyRulesPanel } from "@/components/public/SafetyRulesPanel";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rules = await prisma.safetyRule.findMany({ orderBy: { title: "asc" } });

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <a href="#top" className="flex items-center gap-2 text-lg font-extrabold text-navy"><span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-white"><ShieldCheck size={21} /></span> VigiSafe</a>
          <nav className="flex items-center gap-2"><a href="#sst" className="hidden px-3 py-2 text-sm font-semibold text-slate-600 hover:text-navy sm:block">Consignes SST</a><a href="#assistant" className="hidden px-3 py-2 text-sm font-semibold text-slate-600 hover:text-navy md:block">Assistant</a><a href="#connexion" className="rounded-md bg-navy px-4 py-2 text-sm font-bold text-white hover:bg-[#0b2b4f]">Se connecter</a></nav>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-[linear-gradient(90deg,#0078D4_0_45%,#FFC107_45%_70%,#DC3545_70%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:py-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold uppercase text-white/80"><ShieldCheck size={15} /> Sante et securite au travail</div>
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">VigiSafe</h1>
            <p className="mt-3 text-xl font-bold text-[#70c7ff]">Declarer. Prevenir. Proteger.</p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">La plateforme de declaration des hazards et de prevention SST, accessible aux collaborateurs comme aux visiteurs.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/invite" className="focus-ring inline-flex items-center gap-2 rounded-md bg-warning px-5 py-3 font-extrabold text-navy hover:bg-[#ffd044]"><AlertTriangle size={19} /> Declarer un HAZARD</Link>
              <a href="#connexion" className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/25 px-5 py-3 font-bold text-white hover:bg-white/10">Se connecter <ArrowRight size={18} /></a>
            </div>
          </div>
          <div className="self-end border border-white/15 bg-white/[0.06] p-5">
            <div className="mb-4 flex items-center justify-between"><span className="text-xs font-bold uppercase text-white/60">Acces public</span><span className="flex items-center gap-1.5 text-xs font-semibold text-[#76dc8e]"><span className="h-2 w-2 rounded-full bg-[#76dc8e]" /> Disponible</span></div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 border-b border-white/10 py-3"><Clock3 className="text-[#70c7ff]" size={20} /><div><strong className="block text-sm">Declaration rapide</strong><span className="text-xs text-white/55">Texte, voix et photo</span></div></div>
              <div className="flex items-center gap-3 border-b border-white/10 py-3"><BadgeCheck className="text-[#76dc8e]" size={20} /><div><strong className="block text-sm">Sans creation de compte</strong><span className="text-xs text-white/55">Parcours invite securise</span></div></div>
              <div className="flex items-center gap-3 py-3"><ShieldCheck className="text-warning" size={20} /><div><strong className="block text-sm">Traitement HSE</strong><span className="text-xs text-white/55">Classification et suivi</span></div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="sst" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="max-w-2xl"><span className="text-xs font-extrabold uppercase text-primary">Referentiel public</span><h2 className="mt-2 text-3xl font-extrabold text-navy">Consignes SST classees</h2><p className="mt-2 leading-7 text-slate-600">Les regles sont organisees par contexte pour permettre une consultation rapide avant une intervention ou face a un danger.</p></div>
          <div className="flex items-center gap-3 text-sm"><span className="grid h-9 w-9 place-items-center rounded-md bg-success/10 font-extrabold text-success">{rules.length}</span><span className="font-semibold text-slate-600">consignes<br />disponibles</span></div>
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <SafetyRulesPanel rules={rules} />
          <div id="assistant" className="lg:sticky lg:top-24"><SafetyChat /></div>
        </div>
      </section>

      <section id="connexion" className="border-t border-slate-200 bg-white px-4 py-14 md:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div><span className="text-xs font-extrabold uppercase text-primary">Espace interne</span><h2 className="mt-2 text-3xl font-extrabold text-navy">Acceder a VigiSafe</h2><p className="mt-3 leading-7 text-slate-600">Les rapporteurs, Responsables HSE et directeurs disposent d&apos;espaces adaptes a leurs missions.</p><div className="mt-6 border-l-2 border-warning bg-warning/10 p-4 text-sm text-slate-700">Vous n&apos;avez pas de compte ? <Link href="/invite" className="font-bold text-navy underline">Continuez en tant qu&apos;invite</Link>.</div></div>
          <LoginChoice />
        </div>
      </section>

      <footer className="bg-navy px-4 py-6 text-center text-sm text-white/60">VigiSafe - Plateforme de declaration des hazards et de prevention SST</footer>
    </main>
  );
}
