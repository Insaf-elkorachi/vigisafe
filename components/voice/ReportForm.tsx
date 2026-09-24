"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, LoaderCircle, Mic, Send, Trash2, Type } from "lucide-react";
import { Toast } from "@/components/ui/Toast";
import { categoryLabels, zoneLabels } from "@/lib/labels";

type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
};

type SpeechRecognition = {
  lang: string;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
};

export function ReportForm({ guest = false }: { guest?: boolean }) {
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [description, setDescription] = useState("");
  const [listening, setListening] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [zone, setZone] = useState("AUTRE");
  const [category, setCategory] = useState("AUTRE");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function choosePhoto(file?: File) {
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  function startVoice() {
    const Speech = (window as SpeechWindow).SpeechRecognition ?? (window as SpeechWindow).webkitSpeechRecognition;
    if (!Speech) {
      setError("Reconnaissance vocale non disponible sur ce navigateur.");
      return;
    }
    const recognition = new Speech();
    recognition.lang = "fr-FR";
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const text = Array.from(event.results).map((result) => result[0]?.transcript ?? "").join(" ");
      setVoiceTranscript(text);
    };
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  }

  async function submit() {
    setError("");
    setMessage("");
    const form = new FormData();
    const title = (voiceTranscript || description).slice(0, 90);
    if (!title) {
      setError("Decrivez le HAZARD par texte ou par la voix.");
      return;
    }
    setSubmitting(true);
    form.append("title", title || "Declaration HAZARD");
    form.append("description", description);
    form.append("voiceTranscript", voiceTranscript);
    form.append("zone", zone);
    form.append("category", category);
    if (photo) form.append("photo", photo);
    const response = await fetch("/api/reports", { method: "POST", body: form });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Envoi impossible.");
      setSubmitting(false);
      return;
    }
    if (guest) {
      window.location.replace(`/confirmation?reference=${encodeURIComponent(payload.data.reference)}&severity=${encodeURIComponent(payload.data.severityProposed)}`);
      return;
    }
    setMessage(`Declaration ${payload.data.reference} envoyee. Gravite proposee : ${payload.data.severityProposed}.`);
    setVoiceTranscript("");
    setDescription("");
    setPhoto(null);
    setPreview("");
    setSubmitting(false);
    router.refresh();
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2">
          <button onClick={startVoice} className="focus-ring flex items-center justify-center gap-3 rounded-md bg-primary px-5 py-4 font-bold text-white">
            <Mic /> Par voix <span className="text-xs font-medium">Decrivez le HAZARD</span>
          </button>
          <label className="focus-within:ring-primary flex items-center justify-center gap-3 rounded-md border border-slate-200 px-5 py-4 font-bold text-navy">
            <Type /> Par texte <span className="text-xs font-medium text-slate-500">Saisissez manuellement</span>
          </label>
        </div>
        <div className="mt-6 grid min-h-56 place-items-center rounded-md border border-slate-200 bg-slate-50 p-6 text-center">
          <button onClick={startVoice} className={`grid h-28 w-28 place-items-center rounded-full text-white shadow-soft ${listening ? "bg-danger" : "bg-primary"}`} aria-label="Demarrer la dictee vocale">
            <Mic size={46} />
          </button>
          <div className="font-bold text-navy">{listening ? "Ecoute en cours..." : "Appuyez pour parler"}</div>
          <div className="text-sm text-slate-500">(ou maintenez pour enregistrer)</div>
        </div>
        <label className="mt-4 block text-sm font-bold text-navy" htmlFor="voice">Description du HAZARD par la voix</label>
        <textarea id="voice" value={voiceTranscript} onChange={(event) => setVoiceTranscript(event.target.value)} className="focus-ring mt-2 min-h-24 w-full rounded-md border border-slate-200 p-3" placeholder="Le texte dicte apparait ici..." />
        <label className="mt-4 block text-sm font-bold text-navy" htmlFor="description">Description du HAZARD</label>
        <textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} className="focus-ring mt-2 min-h-24 w-full rounded-md border border-slate-200 p-3" placeholder="Decrivez la situation dangereuse ou le risque observe..." />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-bold text-navy">Categorie <span className="font-normal text-slate-500">(optionnel)</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="focus-ring mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-3 font-normal">
              {Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="text-sm font-bold text-navy">Zone <span className="font-normal text-slate-500">(optionnel)</span>
            <select value={zone} onChange={(event) => setZone(event.target.value)} className="focus-ring mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-3 font-normal">
              {Object.entries(zoneLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
        <button onClick={submit} disabled={submitting} className="focus-ring mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-bold text-white disabled:cursor-wait disabled:opacity-70 md:ml-auto md:w-auto">
          {submitting ? <LoaderCircle className="animate-spin" size={18} /> : <Send size={18} />} Envoyer la declaration
        </button>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="flex items-center gap-2 font-bold text-navy"><Camera size={18} /> Ajouter une photo</h2>
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={(event) => { event.preventDefault(); choosePhoto(event.dataTransfer.files[0]); }}
          onDragOver={(event) => event.preventDefault()}
          className="mt-4 grid min-h-52 cursor-pointer place-items-center rounded-md border border-dashed border-primary/40 bg-primary/5 p-4 text-center text-sm text-slate-600"
        >
          {preview ? <img src={preview} alt="Apercu de la photo" className="max-h-64 rounded-md object-contain" /> : <div><Camera className="mx-auto mb-3 text-primary" />Cliquez pour ajouter une photo<br />ou glissez-deposez</div>}
        </div>
        <input ref={inputRef} className="hidden" type="file" accept="image/*" capture="environment" onChange={(event) => choosePhoto(event.target.files?.[0])} />
        {photo && (
          <button onClick={() => { setPhoto(null); setPreview(""); }} className="focus-ring mt-4 flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-danger">
            <Trash2 size={16} /> Supprimer la photo
          </button>
        )}
      </section>
      <Toast message={message} />
      <Toast message={error} type="error" />
    </div>
  );
}
