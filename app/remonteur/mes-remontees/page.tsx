import { RequireUser } from "@/components/RequireUser";
import { ReportsTable } from "@/components/reports/ReportsTable";

export default function MesRemonteesPage() {
  return (
    <RequireUser allowed={["REMONTEUR"]}>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Mes declarations</h1>
          <p className="text-sm text-slate-600">Consultez vos signalements, leur statut et leur gravite proposee.</p>
        </div>
        <ReportsTable ownOnly readonly />
      </div>
    </RequireUser>
  );
}
