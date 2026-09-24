import { AlertTriangle, Construction, Flame, HardHat, ShieldCheck, TrafficCone, Zap } from "lucide-react";

type SafetyRule = {
  id: string;
  title: string;
  category: string;
  content: string;
};

const metadata = {
  EPI: { icon: HardHat, group: "Prevention quotidienne", code: "P-01", tone: "border-primary", iconTone: "bg-primary/10 text-primary" },
  CIRCULATION: { icon: TrafficCone, group: "Prevention quotidienne", code: "P-02", tone: "border-warning", iconTone: "bg-warning/20 text-[#8a6200]" },
  HAUTEUR: { icon: Construction, group: "Risques techniques", code: "R-01", tone: "border-orange", iconTone: "bg-orange/10 text-orange" },
  ELECTRICITE: { icon: Zap, group: "Risques techniques", code: "R-02", tone: "border-ai", iconTone: "bg-ai/10 text-ai" },
  HAZARD: { icon: AlertTriangle, group: "Alerte et reaction", code: "A-01", tone: "border-primary", iconTone: "bg-primary/10 text-primary" },
  INCENDIE: { icon: Flame, group: "Alerte et reaction", code: "A-02", tone: "border-danger", iconTone: "bg-danger/10 text-danger" }
} as const;

const groups = [
  { title: "Prevention quotidienne", description: "Les comportements essentiels applicables au quotidien." },
  { title: "Risques techniques", description: "Les precautions liees aux travaux et aux energies." },
  { title: "Alerte et reaction", description: "Les reflexes de signalement et de mise en securite." }
];

export function SafetyRulesPanel({ rules }: { rules: SafetyRule[] }) {
  return (
    <div className="space-y-5">
      {groups.map((group, groupIndex) => {
        const groupedRules = rules.filter((rule) => metadata[rule.category as keyof typeof metadata]?.group === group.title);
        if (!groupedRules.length) return null;
        return (
          <section key={group.title} className="border border-slate-200 bg-white">
            <div className="flex items-start gap-4 border-b border-slate-100 bg-slate-50/70 px-5 py-4">
              <span className="text-xs font-extrabold text-primary">0{groupIndex + 1}</span>
              <div><h3 className="font-extrabold text-navy">{group.title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{group.description}</p></div>
            </div>
            <div className="divide-y divide-slate-100">
              {groupedRules.map((rule) => {
                const meta = metadata[rule.category as keyof typeof metadata];
                const Icon = meta?.icon ?? ShieldCheck;
                return (
                  <article key={rule.id} className={`grid gap-4 border-l-4 p-5 sm:grid-cols-[48px_1fr_auto] sm:items-start ${meta?.tone ?? "border-primary"}`}>
                    <span className={`grid h-11 w-11 place-items-center rounded-md ${meta?.iconTone ?? "bg-primary/10 text-primary"}`}><Icon size={22} /></span>
                    <div><h4 className="font-bold text-navy">{rule.title}</h4><p className="mt-1 text-sm leading-6 text-slate-600">{rule.content}</p></div>
                    <span className="w-fit rounded-sm bg-slate-100 px-2 py-1 text-[11px] font-extrabold text-slate-500">{meta?.code ?? "SST"}</span>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
