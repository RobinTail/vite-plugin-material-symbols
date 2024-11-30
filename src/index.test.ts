import { describe, expect, it } from "bun:test";
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
});

describe("System", () => {
  it("should replace the placeholder in index.html", async () => {
    // @see https://github.com/oven-sh/bun/issues/3768
    await Bun.$`NODE_ENV=production bun vite build`;
    const result = await Bun.file("./dist/index.html").text();
    expect(
      result.includes("icon_names=chevron_right,comment,home"),
    ).toBeTruthy();
  });
});
