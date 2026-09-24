import { RequireUser } from "@/components/RequireUser";

export default function DirecteurSettingsPage() {
  return (
    <RequireUser allowed={["DIRECTEUR"]}>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-extrabold text-navy">Parametres</h1>
        <p className="mt-2 text-sm text-slate-600">Preferences de consultation directeur.</p>
      </section>
    </RequireUser>
  );
}
