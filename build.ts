await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./dist",
  sourcemap: "none",
  target: "node",
  format: "esm",
  splitting: false,
  packages: "external",
  external: ["*"],
  minify: true,
});
