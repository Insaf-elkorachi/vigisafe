"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Severity } from "@prisma/client";
import { categoryLabels, severityLabels, statusLabels, zoneLabels } from "@/lib/labels";

const colors: Record<string, string> = {
  CRITIQUE: "#DC3545",
  MAJEUR: "#FD7E14",
  ELEVE: "#FFC107",
  MINEUR: "#28A745"
};

type Props = {
  bySeverity: { severity: string; count: number }[];
  byZone: { zone: string; count: number }[];
  byCategory: { category: string; count: number }[];
  byStatus: { status: string; count: number }[];
  timeline: { date: string; count: number }[];
};

export default function DashboardCharts({ bySeverity, byZone, byCategory, byStatus, timeline }: Props) {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.4fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="mb-4 font-bold text-navy">Repartition par gravite</h2>
          <ResponsiveContainer width="100%" height={245}>
            <PieChart>
              <Pie data={bySeverity.filter((item) => item.count > 0)} dataKey="count" nameKey="severity" innerRadius={62} outerRadius={95} paddingAngle={2}>
                {bySeverity.map((entry) => <Cell key={entry.severity} fill={colors[entry.severity]} />)}
              </Pie>
              <Tooltip formatter={(value, name) => [value, severityLabels[name as Severity] ?? name]} />
            </PieChart>
          </ResponsiveContainer>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="mb-4 font-bold text-navy">Evolution des hazards</h2>
          <ResponsiveContainer width="100%" height={245}>
            <AreaChart data={timeline} margin={{ left: -16, right: 8 }}>
              <CartesianGrid stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#0078D4" strokeWidth={2} fill="#0078D4" fillOpacity={0.12} />
            </AreaChart>
          </ResponsiveContainer>
        </section>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="mb-4 font-bold text-navy">Top 5 des zones a risque</h2>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={byZone} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="zone" tickFormatter={(value) => zoneLabels[value as keyof typeof zoneLabels] ?? value} axisLine={false} tickLine={false} width={95} fontSize={12} />
            <Tooltip />
            <Bar dataKey="count" fill="#0078D4" radius={[0, 4, 4, 0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="mb-4 font-bold text-navy">Hazards par categorie</h2>
          <div className="space-y-3">{byCategory.slice(0, 6).map((item) => <MetricRow key={item.category} label={categoryLabels[item.category as keyof typeof categoryLabels] ?? item.category} value={item.count} max={Math.max(...byCategory.map((entry) => entry.count), 1)} />)}</div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="mb-4 font-bold text-navy">Repartition par statut</h2>
          <div className="space-y-3">{byStatus.map((item) => <MetricRow key={item.status} label={statusLabels[item.status as keyof typeof statusLabels] ?? item.status} value={item.count} max={Math.max(...byStatus.map((entry) => entry.count), 1)} />)}</div>
        </section>
      </div>
    </>
  );
}

function MetricRow({ label, value, max }: { label: string; value: number; max: number }) {
  return <div><div className="mb-1 flex justify-between text-xs"><span className="font-semibold text-slate-600">{label}</span><strong className="text-navy">{value}</strong></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.max((value / max) * 100, 4)}%` }} /></div></div>;
}
