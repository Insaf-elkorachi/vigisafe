import { RequireUser } from "@/components/RequireUser";
import { DashboardView } from "@/components/dashboard/DashboardView";

export default function HseDashboardPage() {
  return (
    <RequireUser allowed={["RESPONSABLE_HSE"]}>
      <DashboardView />
    </RequireUser>
  );
}
