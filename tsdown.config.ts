import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  outDir: "dist",
  sourcemap: false,
  platform: "node",
  format: ["esm"],
  minify: true,
  clean: true,
  dts: { exclude: "*", include: "./src/index.ts" },
});
