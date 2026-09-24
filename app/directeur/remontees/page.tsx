import { RequireUser } from "@/components/RequireUser";
import { ReportsTable } from "@/components/reports/ReportsTable";

export default function DirecteurReportsPage() {
  return (
    <RequireUser allowed={["DIRECTEUR"]}>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Liste des hazards</h1>
          <p className="text-sm text-slate-600">Vision globale en lecture seule.</p>
        </div>
        <ReportsTable readonly />
      </div>
    </RequireUser>
  );
}
