import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";

export default function ConfirmationPage({ searchParams }: { searchParams: { reference?: string; severity?: string } }) {
  return (
    <main className="grid min-h-screen place-items-center bg-background p-4">
      <section className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-8 text-center shadow-lift">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success"><CheckCircle2 size={34} /></span>
        <h1 className="mt-5 text-2xl font-extrabold text-navy">Declaration envoyee</h1>
        <p className="mt-3 text-slate-600">Merci. Votre HAZARD a ete transmis a l&apos;equipe HSE.</p>
        {searchParams.reference && <div className="mt-5 rounded-md bg-slate-50 p-4 text-sm"><span className="text-slate-500">Reference</span><strong className="ml-2 text-navy">{searchParams.reference}</strong>{searchParams.severity && <><br /><span className="text-slate-500">Gravite proposee</span><strong className="ml-2 text-navy">{searchParams.severity}</strong></>}</div>}
        <Link href="/" className="focus-ring mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-bold text-white"><Home size={18} /> Retour a VigiSafe</Link>
      </section>
    </main>
  );
}
