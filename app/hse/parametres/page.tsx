import { RequireUser } from "@/components/RequireUser";

export default function HseSettingsPage() {
  return (
    <RequireUser allowed={["RESPONSABLE_HSE"]}>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-extrabold text-navy">Parametres</h1>
        <p className="mt-2 text-sm text-slate-600">Parametres applicatifs et profil HSE.</p>
      </section>
    </RequireUser>
  );
}
