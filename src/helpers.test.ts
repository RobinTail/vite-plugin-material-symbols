import { describe, expect, it } from "bun:test";
import type { Node } from "estree";
import {
  defaultFontUrl,
  isStringLiteral,
  addIconNamesParam,
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

  describe("defaultFontUrl", () => {
    it("equals the default Material Symbols CDN URL", () => {
      expect(defaultFontUrl).toBe(
        "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0",
      );
    });
  });

  describe("makeSelector", () => {
    it("return a selector having component name injected", () => {
      expect(makeSelector(/jsx/, "Test")).toBe(
        "CallExpression[callee.name=/jsx/][arguments.0.name='Test'] > .arguments > Property[key.name='children'] Literal",
      );
    });

    it("supports regex component name", () => {
      expect(makeSelector(/jsxs/i, /Test/i)).toBe(
        "CallExpression[callee.name=/jsxs/i][arguments.0.name=/Test/i] > .arguments > Property[key.name='children'] Literal",
      );
    });
  });

  describe("addIconNamesParam", () => {
    it("returns empty string for empty registry", () => {
      expect(
        addIconNamesParam("https://example.com/", "some", new Set<string>()),
      ).toBe("https://example.com/");
    });
    it("returns the comma separated names from non-empty registry", () => {
      expect(
        addIconNamesParam(
          "https://example.com",
          "icon_names",
          new Set<string>(["one", "two", "three"]),
        ),
      ).toBe("https://example.com/?icon_names=one,three,two");
    });
  });
});
