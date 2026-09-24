import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getGuestName, getSession } from "@/lib/auth/session";
import { ReportForm } from "@/components/voice/ReportForm";

export default async function PublicReportPage() {
  const user = await getSession();
  const guestName = user ? null : await getGuestName();
  if (!user && !guestName) redirect("/invite");
  const reporterName = user?.name ?? guestName!;

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-navy"><ShieldCheck className="text-primary" /> VigiSafe</Link>
          <span className="text-sm text-slate-500">Rapporteur : <strong className="text-navy">{reporterName}</strong></span>
        </div>
      </header>
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-navy"><ArrowLeft size={16} /> Accueil</Link>
        <h1 className="text-3xl font-extrabold text-navy">Declarer un HAZARD</h1>
        <p className="mt-2 text-slate-600">Signalez une situation dangereuse ou un risque en quelques secondes.</p>
        <div className="mt-6"><ReportForm guest={!user} /></div>
      </div>
    </main>
  );
}
