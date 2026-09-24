"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import { SeverityBadge } from "@/components/ui/Badge";
import { severityLabels, zoneLabels } from "@/lib/labels";
import { Severity } from "@prisma/client";

const DashboardCharts = dynamic(() => import("@/components/dashboard/DashboardCharts"), {
  loading: () => <div className="skeleton h-[515px] rounded-lg" />,
  ssr: false
});

type DashboardData = {
  total: number;
  critical: number;
  major: number;
  minor: number;
  treatmentRate: number;
  averageResolutionHours: number;
  bySeverity: { severity: string; count: number }[];
  byZone: { zone: string; count: number }[];
  byCategory: { category: string; count: number }[];
  byStatus: { status: string; count: number }[];
  timeline: { date: string; count: number }[];
  latest: Array<{ id: string; reference: string; title: string; createdAt: string; zone: string; severityProposed: Severity; severityValidated?: Severity | null }>;
};

export function DashboardView({ director = false }: { director?: boolean }) {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/dashboard?days=${days}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => setData(payload.data))
      .catch((error) => {
        if (error.name !== "AbortError") throw error;
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [days]);

  if (!data) return <DashboardSkeleton />;

  const kpis = [
    { label: "Total des hazards", value: data.total, icon: ShieldCheck, tone: "text-primary", delta: "+12%" },
    { label: "Incidents critiques", value: data.critical, icon: AlertTriangle, tone: "text-danger", delta: "+75%" },
    { label: "Incidents majeurs", value: data.major, icon: AlertTriangle, tone: "text-orange", delta: "+17%" },
    { label: director ? "Taux de traitement" : "Incidents mineurs", value: director ? `${data.treatmentRate}%` : data.minor, icon: CheckCircle2, tone: "text-success", delta: director ? `${data.averageResolutionHours}h moyen` : "-10%" }
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Tableau de bord</h1>
          <p className="text-sm text-slate-600">{director ? "Vision globale des indicateurs HSE." : "Vue d'ensemble des hazards et des indicateurs de securite."}</p>
        </div>
        <select value={days} onChange={(event) => setDays(Number(event.target.value))} className="focus-ring rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">
          <option value={7}>7 jours</option>
          <option value={30}>30 jours</option>
          <option value={90}>90 jours</option>
          <option value={365}>Annee</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <article key={kpi.label} className={`rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition-opacity ${loading ? "opacity-60" : "opacity-100"}`}>
              <div className={`mb-3 grid h-9 w-9 place-items-center rounded-md bg-slate-100 ${kpi.tone}`}><Icon size={20} /></div>
              <div className="text-xs font-bold uppercase text-slate-500">{kpi.label}</div>
              <div className="mt-2 text-3xl font-extrabold text-navy">{kpi.value}</div>
              <div className="mt-2 text-xs font-semibold text-success">{kpi.delta} <span className="text-slate-500">vs. periode precedente</span></div>
            </article>
          );
        })}
      </div>
      <DashboardCharts bySeverity={data.bySeverity} byZone={data.byZone} byCategory={data.byCategory} byStatus={data.byStatus} timeline={data.timeline} />
      <div>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="mb-4 font-bold text-navy">Derniers hazards</h2>
          <div className="space-y-3">
            {data.latest.map((report) => (
              <div key={report.id} className="flex items-center justify-between gap-3 rounded-md bg-slate-50 p-3 text-sm">
                <div className="min-w-0">
                  <div className="truncate font-semibold text-navy">{report.title}</div>
                  <div className="text-xs text-slate-500">{zoneLabels[report.zone as keyof typeof zoneLabels] ?? report.zone} - {new Date(report.createdAt).toLocaleDateString("fr-FR")}</div>
                </div>
                <SeverityBadge value={report.severityValidated ?? report.severityProposed} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5" aria-label="Chargement des indicateurs">
      <div className="skeleton h-16 max-w-md rounded-md" />
      <div className="grid gap-4 md:grid-cols-4">
        {[0, 1, 2, 3].map((item) => <div key={item} className="skeleton h-40 rounded-lg" />)}
      </div>
      <div className="skeleton h-72 rounded-lg" />
    </div>
  );
}
