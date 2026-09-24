import { describe, expect, it } from "vitest";
import { makeReference } from "@/lib/reports";

describe("reports helpers", () => {
  it("genere une reference lisible", () => {
    expect(makeReference(7)).toMatch(/^HSE-\d{4}-0008$/);
  });
});
