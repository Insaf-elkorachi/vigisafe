import { describe, expect, it } from "vitest";
import { classifySeverity } from "@/lib/severity/classifier";

describe("classifySeverity", () => {
  it("detecte une situation critique", () => {
    expect(classifySeverity("Explosion et danger immediat")).toBe("CRITIQUE");
  });

  it("detecte une situation majeure", () => {
    expect(classifySeverity("Machine dangereuse sans protection")).toBe("MAJEUR");
  });

  it("classe un sol glissant en mineur", () => {
    expect(classifySeverity("Sol glissant dans le magasin")).toBe("MINEUR");
  });
});
