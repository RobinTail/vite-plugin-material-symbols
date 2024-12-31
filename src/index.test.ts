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

  describe.each([false, true])("Operation %#", (preload) => {
    const { moduleParsed, transformIndexHtml } = plugin({ preload });
    if (!moduleParsed) fail("no moduleParsed hook");
    if (typeof moduleParsed !== "function")
      fail("moduleParsed is not a function");
    if (!transformIndexHtml) fail("no transformIndexHtml");
    if (typeof transformIndexHtml !== "function")
      fail("transformIndexHtml is not a function");

    it("injects the link to all symbols in dev mode", () => {
      const result = transformIndexHtml(
        `<html lang="en"><head><title>test</title></head></html>`,
        { path: ".", filename: "index.html" },
      );
      expect(result).toMatchSnapshot();
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

    it("injects the link with found icon names into html", () => {
      const result = transformIndexHtml(
        `<html lang="en"><head><title>test</title></head></html>`,
        { path: ".", filename: "index.html" },
      );
      expect(result).toMatchSnapshot();
    });
  });
});

describe("System", () => {
  it("injects the link into index.html", async () => {
    // @see https://github.com/oven-sh/bun/issues/3768
    await Bun.$`NODE_ENV=production bun --bun vite -c tools/vite.config.ts build`;
    const result = await Bun.file("./dist/tools/index.html").text();
    expect(
      result.includes(
        `<link rel="stylesheet" ` +
          `href="https://fonts.googleapis.com/css2?` +
          "family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&amp;" +
          `icon_names=chevron_right,comment,home">`,
      ),
    ).toBeTrue();
  });
});
