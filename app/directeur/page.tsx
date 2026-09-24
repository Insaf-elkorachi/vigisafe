import { RequireUser } from "@/components/RequireUser";
import { DashboardView } from "@/components/dashboard/DashboardView";

export default function DirecteurDashboardPage() {
  return (
    <RequireUser allowed={["DIRECTEUR"]}>
      <DashboardView director />
    </RequireUser>
  );
}
