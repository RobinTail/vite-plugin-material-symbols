import { describe, expect, it } from "bun:test";
import type { Node } from "estree";
import { isStringLiteral } from "./helpers.ts";

describe("Helpers", () => {
  describe("isStringLiteral", () => {
    it("validates a Literal with a string value", () => {
      expect(isStringLiteral({ type: "Literal", value: "test" })).toBeTrue();
    });
    it.each<Node>([
      { type: "Literal", value: 123 },
      { type: "Identifier", name: "test" },
    ])("invalidates others %#", (subject) => {
      expect(isStringLiteral(subject)).toBeFalse();
    });
  });
});
