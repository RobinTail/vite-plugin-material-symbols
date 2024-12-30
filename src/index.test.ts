import { describe, expect, it, mock } from "bun:test";
import { fail } from "node:assert/strict";
import type { ModuleInfo, PluginContext } from "rollup";
import ast from "../tools/ast.json";
import plugin from "./index";

describe("Entrypoint", () => {
  it("should be a function", () => {
    expect(plugin).toBeFunction();
  });

  it("should return object of certain structure", () => {
    expect(plugin()).toEqual({
      enforce: "pre",
      moduleParsed: expect.any(Function),
      name: "material-symbols",
      transformIndexHtml: expect.any(Function),
    });
  });

  describe("Operation", () => {
    const { moduleParsed, transformIndexHtml } = plugin();
    if (!moduleParsed) fail("no moduleParsed hook");
    if (typeof moduleParsed !== "function")
      fail("moduleParsed is not a function");
    if (!transformIndexHtml) fail("no transformIndexHtml");
    if (typeof transformIndexHtml !== "function")
      fail("transformIndexHtml is not a function");

    it("replaces the placeholder with an empty string in dev mode", () => {
      const result = transformIndexHtml(
        `<html lang="en"><head><title>test</title></head></html>`,
        {
          path: ".",
          filename: "index.html",
        },
      );
      expect(result).toEqual({
        html: `<html lang="en"><head><title>test</title></head></html>`,
        tags: [
          {
            injectTo: "head",
            tag: `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&" />`,
          },
        ],
      });
    });

    it("should find icon names", () => {
      const debug = mock();
      moduleParsed.call(
        { debug } as unknown as PluginContext,
        { ast, id: "file.tsx" } as unknown as ModuleInfo,
      );
      expect(debug).toHaveBeenCalledTimes(3);
      expect(debug.mock.calls).toEqual([
        [{ id: "file.tsx", message: "home" }],
        [{ id: "file.tsx", message: "chevron_right" }],
        [{ id: "file.tsx", message: "comment" }],
      ]);
    });

    it("should replace the placeholder with found icon names in html", () => {
      const result = transformIndexHtml(
        `<html lang="en"><head><title>test</title></head></html>`,
        {
          path: ".",
          filename: "index.html",
        },
      );
      expect(result).toEqual({
        html: `<html lang="en"><head><title>test</title></head></html>`,
        tags: [
          {
            injectTo: "head",
            tag: `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=chevron_right,comment,home" />`,
          },
        ],
      });
    });
  });
});

describe("System", () => {
  it("should replace the placeholder in index.html", async () => {
    // @see https://github.com/oven-sh/bun/issues/3768
    await Bun.$`NODE_ENV=production bun --bun vite -c tools/vite.config.ts build`;
    const result = await Bun.file("./dist/tools/index.html").text();
    expect(result.includes("icon_names=chevron_right,comment,home")).toBeTrue();
  });
});
