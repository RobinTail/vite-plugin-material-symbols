import { describe, expect, it, mock } from "bun:test";
import { fail } from "node:assert/strict";
import type { ModuleInfo, PluginContext } from "rollup";
import ast from "./ast.json";
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

  it("should find icon names and replace the placeholder in html", () => {
    const { moduleParsed, transformIndexHtml } = plugin();
    if (!moduleParsed) fail("no moduleParsed hook");
    if (typeof moduleParsed !== "function")
      fail("moduleParsed is not a function");
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
    if (!transformIndexHtml) fail("no transformIndexHtml");
    if (typeof transformIndexHtml !== "function")
      fail("transformIndexHtml is not a function");
    const result = transformIndexHtml(
      "https://example.com?__MATERIAL_SYMBOLS__",
      {
        path: ".",
        filename: "index.html",
      },
    );
    expect(result).toBe(
      "https://example.com?icon_names=chevron_right,comment,home",
    );
  });
});

describe("System", () => {
  it("should replace the placeholder in index.html", async () => {
    // @see https://github.com/oven-sh/bun/issues/3768
    await Bun.$`NODE_ENV=production bun --bun vite build`;
    const result = await Bun.file("./dist/index.html").text();
    expect(
      result.includes("icon_names=chevron_right,comment,home"),
    ).toBeTruthy();
  });
});
