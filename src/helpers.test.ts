import { describe, expect, it } from "bun:test";
import type { Node } from "estree";
import {
  defaultUrlProvider,
  isStringLiteral,
  makeSelector,
} from "./helpers.ts";

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

  describe("defaultUrlProvider", () => {
    it("returns the default Material Symbols CDN URL with supplied param injected", () => {
      expect(defaultUrlProvider("test")).toBe(
        "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&test",
      );
    });
  });

  describe("makeSelector", () => {
    it("return a selector having component name injected", () => {
      expect(makeSelector("Test")).toBe(
        "CallExpression[callee.name='jsx'][arguments.0.name='Test'] > .arguments > Property[key.name='children'] Literal",
      );
    });
  });
});
