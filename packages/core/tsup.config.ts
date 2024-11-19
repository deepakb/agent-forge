import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/logging/index.ts',
    'src/workflow/index.ts',
    'src/agent/index.ts',
    'src/tools/index.ts',
    'src/context/index.ts',
    'src/communication/index.ts',
    'src/error/index.ts'
  ],
  format: ['cjs', 'esm'],
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
