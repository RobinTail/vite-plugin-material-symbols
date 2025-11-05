import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  fixedExtension: false,
  outDir: "dist",
  sourcemap: false,
  platform: "node",
  format: ["esm"],
  minify: true,
  clean: true,
  dts: true,
});
