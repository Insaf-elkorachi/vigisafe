import { describe, expect, it } from "vitest";
import { canOperateReports, canViewAllReports } from "@/lib/permissions";

describe("permissions", () => {
  it("autorise le HSE a traiter les remontees", () => {
    expect(canOperateReports("RESPONSABLE_HSE")).toBe(true);
  });

  it("limite le directeur a la consultation globale", () => {
    expect(canViewAllReports("DIRECTEUR")).toBe(true);
    expect(canOperateReports("DIRECTEUR")).toBe(false);
  });

  it("limite le remonteur a ses propres donnees", () => {
    expect(canViewAllReports("REMONTEUR")).toBe(false);
  });
});
