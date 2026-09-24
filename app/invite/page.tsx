import { ShieldCheck } from "lucide-react";
import { GuestNameForm } from "@/components/public/GuestNameForm";

export default function GuestPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background p-4">
      <div className="w-full">
        <div className="mx-auto mb-6 flex max-w-lg items-center justify-center gap-2 font-extrabold text-navy"><ShieldCheck className="text-primary" /> VigiSafe</div>
        <div className="flex justify-center"><GuestNameForm /></div>
      </div>
    </main>
  );
}
