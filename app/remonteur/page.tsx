import { RequireUser } from "@/components/RequireUser";
import { ReportForm } from "@/components/voice/ReportForm";

export default function RemonteurPage() {
  return (
    <RequireUser allowed={["REMONTEUR"]}>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Declarer un HAZARD</h1>
          <p className="text-sm text-slate-600">Signalez une situation dangereuse ou un risque en quelques secondes.</p>
        </div>
        <ReportForm />
      </div>
    </RequireUser>
  );
}
