import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  outDir: "dist",
  noExternal: ["@agent-forge/*"],
  onSuccess: "tsc --emitDeclarationOnly --declaration",
  esbuildOptions(options) {
    options.footer = {
      js: 'if (module.exports.default) module.exports = module.exports.default;'
    };
  }
});
