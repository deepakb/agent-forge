import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  outDir: 'dist',
  external: ['axios'],
  noExternal: ['@agent-forge/*'],
  onSuccess: 'tsc --emitDeclarationOnly --declaration',
  esbuildOptions(options) {
    options.footer = {
      js: 'if (module.exports.default) module.exports = module.exports.default;'
    };
  }
});
