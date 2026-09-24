"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, LoaderCircle, UserRound } from "lucide-react";

export function GuestNameForm() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const response = await fetch("/api/guest", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name })
    });
    if (!response.ok) {
      setError("Veuillez saisir un nom et prenom valides.");
      setLoading(false);
      return;
    }
    window.location.replace("/declarer");
  }

  return (
    <form onSubmit={submit} className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-lift md:p-8">
      <span className="grid h-12 w-12 place-items-center rounded-md bg-primary/10 text-primary"><UserRound /></span>
      <h1 className="mt-5 text-2xl font-extrabold text-navy">Avant de continuer</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">Veuillez renseigner votre nom afin d&apos;identifier le rapporteur.</p>
      <label htmlFor="guest-name" className="mt-6 block text-sm font-bold text-navy">Nom et prenom</label>
      <input id="guest-name" autoFocus autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex. Ahmed El Amrani" className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-4 py-3" />
      {error && <p className="mt-2 text-sm font-semibold text-danger">{error}</p>}
      <button disabled={loading} className="focus-ring mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-bold text-white hover:bg-[#006cbe] disabled:opacity-70">
        {loading ? <LoaderCircle className="animate-spin" size={18} /> : <ArrowRight size={18} />} Continuer
      </button>
      <Link href="/" className="focus-ring mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-navy"><ArrowLeft size={16} /> Retour a l&apos;accueil</Link>
    </form>
  );
}
