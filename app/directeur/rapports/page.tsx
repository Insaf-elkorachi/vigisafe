import { RequireUser } from "@/components/RequireUser";
import { ReportsExport } from "@/components/reports/ReportsExport";
import { ReportsTable } from "@/components/reports/ReportsTable";

export default function DirecteurRapportsPage() {
  return (
    <RequireUser allowed={["DIRECTEUR"]}>
      <div className="space-y-5">
        <ReportsExport />
        <ReportsTable readonly />
      </div>
    </RequireUser>
  );
}
