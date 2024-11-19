import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  outDir: 'dist',
  external: [
    'axios',
    '@agent-forge/core',
    '@agent-forge/llm-providers',
    '@agent-forge/tools',
    '@agent-forge/utils'
  ],
  onSuccess: 'node dist/index.js',
  esbuildOptions(options) {
    options.footer = {
      js: 'if (module.exports.default) module.exports = module.exports.default;'
    };
  }
});
