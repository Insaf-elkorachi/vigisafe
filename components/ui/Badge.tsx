import { Severity, Status } from "@prisma/client";
import { severityLabels, statusLabels } from "@/lib/labels";

const severityClass: Record<Severity, string> = {
  MINEUR: "bg-success/15 text-success",
  MAJEUR: "bg-orange/15 text-orange",
  ELEVE: "bg-warning/25 text-yellow-700",
  CRITIQUE: "bg-danger/15 text-danger"
};

const statusClass: Record<Status, string> = {
  NOUVELLE: "bg-primary/10 text-primary",
  EN_COURS: "bg-orange/15 text-orange",
  OUVERTE: "bg-primary/10 text-primary",
  TRAITEE: "bg-success/15 text-success",
  FERMEE: "bg-inactive/15 text-inactive",
  REJETEE: "bg-danger/15 text-danger"
};

export function SeverityBadge({ value }: { value: Severity }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${severityClass[value]}`}>{severityLabels[value]}</span>;
}

export function StatusBadge({ value }: { value: Status }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass[value]}`}>{statusLabels[value]}</span>;
}
