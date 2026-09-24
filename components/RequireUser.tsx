import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { getSession } from "@/lib/auth/session";
import { AppShell } from "@/components/AppShell";

export async function RequireUser({ allowed, children }: { allowed: Role[]; children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/");
  if (!allowed.includes(user.role)) {
    const target = user.role === "REMONTEUR" ? "/remonteur" : user.role === "RESPONSABLE_HSE" ? "/hse" : "/directeur";
    redirect(target);
  }
  return <AppShell role={user.role} name={user.name}>{children}</AppShell>;
}
