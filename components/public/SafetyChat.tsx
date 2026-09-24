"use client";

import { FormEvent, useState } from "react";
import { HardHat, LoaderCircle, Send, ShieldCheck, UserRound } from "lucide-react";

type Source = { title: string; url?: string | null; jurisdiction?: string | null };
type Message = { role: "assistant" | "user"; text: string; sources?: Source[] };

const suggestions = [
  "Quels EPI dois-je porter ?",
  "Que faire si je vois un danger ?",
  "Quelle hauteur pour un travail en hauteur ?"
];

export function SafetyChat() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Bonjour, je suis VigiSafe. Je peux vous aider a retrouver une consigne SST disponible dans l'application." }
  ]);

  async function submitQuestion(value: string) {
    if (!value || loading) return;
    setMessages((current) => [...current, { role: "user", text: value }]);
    setQuestion("");
    setLoading(true);
    try {
      const response = await fetch("/api/safety-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: value })
      });
      const payload = await response.json();
      setMessages((current) => [...current, { role: "assistant", text: payload.data?.answer ?? "Une erreur est survenue.", sources: payload.data?.sources }]);
    } finally {
      setLoading(false);
    }
  }

  function ask(event: FormEvent) {
    event.preventDefault();
    void submitQuestion(question.trim());
  }

  return (
    <section className="flex min-h-[520px] flex-col overflow-hidden border border-slate-200 bg-white shadow-soft">
      <div className="flex items-center justify-between border-b border-white/10 bg-navy px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <span className="relative grid h-12 w-12 place-items-center rounded-md bg-primary text-white"><HardHat size={25} /><span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-navy bg-success" /></span>
          <div><h3 className="font-extrabold">VigiSafe</h3><p className="text-xs text-white/60">Assistant des consignes SST</p></div>
        </div>
        <span className="hidden items-center gap-1.5 text-xs font-semibold text-white/70 sm:flex"><ShieldCheck size={15} className="text-success" /> Sources controlees</span>
      </div>

      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
        <p className="mb-2 text-[11px] font-bold uppercase text-slate-500">Questions suggerees</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => <button key={suggestion} onClick={() => void submitQuestion(suggestion)} disabled={loading} className="focus-ring rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-xs font-semibold text-navy hover:border-primary hover:text-primary disabled:opacity-50">{suggestion}</button>)}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5" aria-live="polite">
        {messages.map((message, index) => (
          <div key={index} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${message.role === "user" ? "bg-slate-200 text-navy" : "bg-primary text-white"}`}>{message.role === "user" ? <UserRound size={16} /> : <HardHat size={16} />}</span>
            <div className={`max-w-[82%] whitespace-pre-line rounded-md px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-navy text-white" : "bg-slate-100 text-slate-700"}`}>
              {message.text}
              {message.sources?.length ? <div className="mt-2 space-y-1 border-t border-slate-200 pt-2 text-xs"><span className="font-semibold text-slate-500">Sources :</span>{message.sources.map((source, sourceIndex) => source.url ? <a key={`${source.title}-${sourceIndex}`} href={source.url} target="_blank" rel="noreferrer" className="block font-semibold text-primary hover:underline">{source.title}{source.jurisdiction ? ` (${source.jurisdiction})` : ""}</a> : <span key={`${source.title}-${sourceIndex}`} className="block font-semibold text-primary">{source.title}</span>)}</div> : null}
            </div>
          </div>
        ))}
        {loading && <div className="flex items-center gap-2 text-sm text-slate-500"><LoaderCircle className="animate-spin" size={17} /> VigiSafe recherche dans les consignes...</div>}
      </div>

      <form onSubmit={ask} className="border-t border-slate-100 bg-white p-4">
        <div className="flex gap-2">
          <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Posez votre question sur une consigne SST..." aria-label="Question SST" className="focus-ring min-w-0 flex-1 rounded-md border border-slate-300 px-4 py-3 text-sm" />
          <button disabled={loading || !question.trim()} className="focus-ring grid h-11 w-11 place-items-center rounded-md bg-primary text-white disabled:opacity-50" aria-label="Envoyer"><Send size={18} /></button>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">VigiSafe repond uniquement a partir des consignes SST enregistrees.</p>
      </form>
    </section>
  );
}
