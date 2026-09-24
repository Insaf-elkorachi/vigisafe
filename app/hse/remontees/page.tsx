import { RequireUser } from "@/components/RequireUser";
import { ReportsTable } from "@/components/reports/ReportsTable";

export default function HseReportsPage() {
  return (
    <RequireUser allowed={["RESPONSABLE_HSE"]}>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Liste des hazards</h1>
          <p className="text-sm text-slate-600">Consultez et filtrez toutes les declarations enregistrees.</p>
        </div>
        <ReportsTable />
      </div>
    </RequireUser>
  );
}
