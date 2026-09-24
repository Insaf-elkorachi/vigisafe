import { RequireUser } from "@/components/RequireUser";

export default function ProfilPage() {
  return (
    <RequireUser allowed={["REMONTEUR"]}>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-extrabold text-navy">Profil</h1>
        <p className="mt-2 text-sm text-slate-600">Compte remonteur de demonstration.</p>
      </section>
    </RequireUser>
  );
}
