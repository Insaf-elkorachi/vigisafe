"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, ImageOff, LoaderCircle, RotateCcw, X } from "lucide-react";
import { Category, Severity, Status, Zone } from "@prisma/client";
import { SeverityBadge, StatusBadge } from "@/components/ui/Badge";
import { categoryLabels, severityLabels, statusLabels, zoneLabels } from "@/lib/labels";

type Report = {
  id: string;
  reference: string;
  title: string;
  description?: string | null;
  voiceTranscript?: string | null;
  createdAt: string;
  severityProposed: Severity;
  severityValidated?: Severity | null;
  status: Status;
  zone: Zone;
  category: Category;
  photoUrl?: string | null;
  reporterName: string;
  author?: { name: string; email: string } | null;
};

export function ReportsTable({ ownOnly = false, readonly = false }: { ownOnly?: boolean; readonly?: boolean }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Report | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ severity: "", status: "", zone: "", author: "", start: "", end: "" });

  const query = useMemo(() => new URLSearchParams(Object.entries(filters).filter(([, value]) => value)).toString(), [filters]);

  async function load(signal?: AbortSignal) {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports?${query}`, { signal });
      const payload = await response.json();
      setReports(payload.data.items);
      setTotal(payload.data.total);
    } catch (error) {
      if ((error as Error).name !== "AbortError") throw error;
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  // query is the stable serialization of the current filters.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function patch(id: string, body: Record<string, string>) {
    await fetch(`/api/reports/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    load();
    if (selected?.id === id) {
      const response = await fetch(`/api/reports/${id}`);
      const payload = await response.json();
      setSelected(payload.data);
    }
  }

  return (
    <div className="space-y-4">
      {!ownOnly && (
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="grid gap-3 md:grid-cols-6">
            <select aria-label="Gravite" value={filters.severity} onChange={(event) => setFilters({ ...filters, severity: event.target.value })} className="focus-ring rounded-md border border-slate-200 px-3 py-2 text-sm">
              <option value="">Toutes gravites</option>
              {Object.entries(severityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <input aria-label="Date debut" type="date" value={filters.start} onChange={(event) => setFilters({ ...filters, start: event.target.value })} className="focus-ring rounded-md border border-slate-200 px-3 py-2 text-sm" />
            <input aria-label="Date fin" type="date" value={filters.end} onChange={(event) => setFilters({ ...filters, end: event.target.value })} className="focus-ring rounded-md border border-slate-200 px-3 py-2 text-sm" />
            <select aria-label="Zone" value={filters.zone} onChange={(event) => setFilters({ ...filters, zone: event.target.value })} className="focus-ring rounded-md border border-slate-200 px-3 py-2 text-sm">
              <option value="">Toutes zones</option>
              {Object.entries(zoneLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select aria-label="Statut" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="focus-ring rounded-md border border-slate-200 px-3 py-2 text-sm">
              <option value="">Tous statuts</option>
              {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <button onClick={() => setFilters({ severity: "", status: "", zone: "", author: "", start: "", end: "" })} className="focus-ring flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-navy"><RotateCcw size={16} /> Reset</button>
          </div>
        </section>
      )}
      <section className={`overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft transition-opacity ${loading ? "opacity-70" : "opacity-100"}`} aria-busy={loading}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3 text-left"><input aria-label="Selectionner tout" type="checkbox" /></th>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Auteur</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Photo</th>
                <th className="p-3 text-left">Gravite</th>
                <th className="p-3 text-left">Zone</th>
                <th className="p-3 text-left">Statut</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-t border-slate-100 transition-colors hover:bg-slate-50/80">
                  <td className="p-3"><input aria-label={`Selectionner ${report.reference}`} type="checkbox" /></td>
                  <td className="p-3 font-semibold text-navy">{report.reference}</td>
                  <td className="p-3">{new Date(report.createdAt).toLocaleString("fr-FR")}</td>
                  <td className="p-3">{report.reporterName || report.author?.name || "Invite"}</td>
                  <td className="max-w-xs truncate p-3">{report.description ?? report.voiceTranscript ?? report.title}</td>
                  <td className="p-3">
                    {report.photoUrl ? (
                      <button onClick={() => setPhotoPreview(report.photoUrl!)} className="focus-ring h-11 w-14 overflow-hidden rounded-md border border-slate-200" aria-label={`Agrandir la photo de ${report.reference}`}>
                        <img src={report.photoUrl} alt="" className="h-full w-full object-cover" />
                      </button>
                    ) : <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-slate-400"><ImageOff size={15} /> Aucune photo</span>}
                  </td>
                  <td className="p-3"><SeverityBadge value={report.severityValidated ?? report.severityProposed} /></td>
                  <td className="p-3">{zoneLabels[report.zone]}</td>
                  <td className="p-3"><StatusBadge value={report.status} /></td>
                  <td className="p-3">
                    <button onClick={() => setSelected(report)} className="focus-ring rounded-md p-2 text-primary hover:bg-primary/10" aria-label="Voir le detail"><Eye size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
          <span>Affichage de {reports.length} sur {total} hazards</span>
          <span className="flex items-center gap-2">{loading && <LoaderCircle className="animate-spin text-primary" size={15} />} Page 1</span>
        </div>
      </section>
      {selected && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-navy/50 p-4" role="dialog" aria-modal="true">
          <section className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-lift">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-navy">{selected.reference}</h2>
                <p className="text-sm text-slate-500">{new Date(selected.createdAt).toLocaleString("fr-FR")} - {selected.reporterName || selected.author?.name || "Invite"}</p>
              </div>
              <button onClick={() => setSelected(null)} className="focus-ring grid h-9 w-9 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-navy" aria-label="Fermer"><X size={20} /></button>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Info label="Zone" value={zoneLabels[selected.zone]} />
              <Info label="Categorie" value={categoryLabels[selected.category]} />
              <Info label="Gravite proposee" value={severityLabels[selected.severityProposed]} />
              <Info label="Statut" value={statusLabels[selected.status]} />
            </div>
            <h3 className="mt-5 font-bold text-navy">Description</h3>
            <p className="mt-2 rounded-md bg-slate-50 p-4 text-sm">{selected.description ?? selected.voiceTranscript ?? selected.title}</p>
            {selected.photoUrl && <button onClick={() => setPhotoPreview(selected.photoUrl!)} className="focus-ring mt-4 block"><img src={selected.photoUrl} alt="Photo du HAZARD" className="max-h-72 rounded-md object-contain" /></button>}
            {!readonly && (
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <select onChange={(event) => patch(selected.id, { severityValidated: event.target.value })} defaultValue="" className="focus-ring rounded-md border border-slate-200 px-3 py-2 text-sm">
                  <option value="" disabled>Changer gravite</option>
                  {Object.entries(severityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <select onChange={(event) => patch(selected.id, { status: event.target.value })} defaultValue="" className="focus-ring rounded-md border border-slate-200 px-3 py-2 text-sm">
                  <option value="" disabled>Changer statut</option>
                  {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <select onChange={(event) => patch(selected.id, { zone: event.target.value })} defaultValue="" className="focus-ring rounded-md border border-slate-200 px-3 py-2 text-sm">
                  <option value="" disabled>Affecter zone</option>
                  {Object.entries(zoneLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
            )}
            <h3 className="mt-6 font-bold text-navy">Timeline</h3>
            <ol className="mt-3 grid gap-2 text-sm">
              {["Creee", "Prise en charge", "Gravite validee", "Traitement", "Fermee"].map((step, index) => (
                <li key={step} className="flex items-center gap-3"><span className={`h-3 w-3 rounded-full ${index === 0 ? "bg-primary" : "bg-slate-300"}`} />{step}</li>
              ))}
            </ol>
          </section>
        </div>
      )}
      {photoPreview && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/80 p-4" role="dialog" aria-modal="true" onClick={() => setPhotoPreview("")}>
          <button className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-md bg-white text-navy" aria-label="Fermer"><X size={22} /></button>
          <img src={photoPreview} alt="Apercu agrandi du HAZARD" className="max-h-[88vh] max-w-full rounded-md object-contain" onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md bg-slate-50 p-3"><div className="text-xs font-bold uppercase text-slate-500">{label}</div><div className="font-semibold text-navy">{value}</div></div>;
}
