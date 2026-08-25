import { fail } from "node:assert/strict";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import type { Rolldown } from "vite";
import { describe, expect, it, vi } from "vitest";
import ast from "../tools/ast.json";
import plugin from "./index";

describe("Entrypoint", () => {
  it("should be a function", () => {
    expect(plugin).toBeTypeOf("function");
  });

  it("should return object of certain structure", () => {
    expect(plugin()).toEqual({
      enforce: "pre",
      moduleParsed: expect.any(Function),
      name: "material-symbols",
      transformIndexHtml: expect.any(Function),
    });
  });

  describe.each([false, true])("Operation %#", (preload) => {
    const { moduleParsed, transformIndexHtml } = plugin({ preload });
    if (!moduleParsed) fail("no moduleParsed hook");
    if (typeof moduleParsed !== "function")
      fail("moduleParsed is not a function");
    if (!transformIndexHtml) fail("no transformIndexHtml");
    if (typeof transformIndexHtml !== "function")
      fail("transformIndexHtml is not a function");

    it("injects the link to all symbols in dev mode", () => {
      const result = transformIndexHtml.call(
        { debug: vi.fn() } as unknown as Rolldown.PluginContext,
        `<html lang="en"><head><title>test</title></head></html>`,
        { path: ".", filename: "index.html" },
      );
      expect(result).toMatchSnapshot();
    });

    it("should find icon names", () => {
      const debug = vi.fn();
      moduleParsed.call(
        { debug, parse: () => ast } as unknown as Rolldown.PluginContext,
        { id: "file.tsx", code: "test" } as unknown as Rolldown.ModuleInfo,
      );
      expect(debug).toHaveBeenCalledTimes(3);
      expect(debug.mock.calls).toEqual([
        [{ id: "file.tsx", message: "home" }],
        [{ id: "file.tsx", message: "chevron_right" }],
        [{ id: "file.tsx", message: "comment" }],
      ]);
    });

    it("injects the link with found icon names into html", () => {
      const result = transformIndexHtml.call(
        { debug: vi.fn() } as unknown as Rolldown.PluginContext,
        `<html lang="en"><head><title>test</title></head></html>`,
        { path: ".", filename: "index.html" },
      );
      expect(result).toMatchSnapshot();
    });
  });
});

describe("System", () => {
  it("injects the link into index.html", async () => {
    execSync("NODE_ENV=production pnpm vite -c tools/vite.config.ts build", {
      shell: "bash",
    });
    const result = readFileSync("./dist/tools/index.html", "utf-8");
    expect(
      result.includes(
        `<link rel="stylesheet" ` +
          `href="https://fonts.googleapis.com/css2?` +
          "family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&amp;" +
          `icon_names=chevron_right,comment,home">`,
      ),
    ).toBe(true);
  });
});
