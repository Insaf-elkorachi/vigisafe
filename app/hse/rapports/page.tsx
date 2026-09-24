import { RequireUser } from "@/components/RequireUser";
import { ReportsExport } from "@/components/reports/ReportsExport";
import { ReportsTable } from "@/components/reports/ReportsTable";

export default function HseRapportsPage() {
  return (
    <RequireUser allowed={["RESPONSABLE_HSE"]}>
      <div className="space-y-5">
        <ReportsExport />
        <ReportsTable />
      </div>
    </RequireUser>
  );
}
