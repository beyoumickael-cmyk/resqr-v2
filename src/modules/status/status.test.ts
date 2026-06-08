import { describe, expect, it } from "vitest";
import { getWorstStatus } from "./status";

describe("getWorstStatus", () => {
  it("keeps an unknown asset black until facts exist", () => {
    expect(getWorstStatus([])).toBe("black");
  });

  it("returns the highest operational risk", () => {
    expect(
      getWorstStatus([
        { status: "green", label: "Checklist conforme" },
        { status: "amber", label: "Peremption proche" },
        { status: "red", label: "Panne dangereuse" },
      ]),
    ).toBe("red");
  });
});
