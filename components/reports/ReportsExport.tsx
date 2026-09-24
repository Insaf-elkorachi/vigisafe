"use client";

import { Download } from "lucide-react";

export function ReportsExport() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-extrabold text-navy">Generer un rapport HSE</h2>
      <p className="mt-1 text-sm text-slate-600">Filtrez dans la liste puis exportez les donnees au format CSV.</p>
      <a href="/api/reports/export" className="focus-ring mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-bold text-white">
        <Download size={18} /> Exporter CSV
      </a>
    </section>
  );
}
