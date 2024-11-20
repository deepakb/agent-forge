import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: {
    resolve: true,
  },
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
  esbuildOptions(options) {
    options.footer = {
      js: 'if (module.exports.default) module.exports = module.exports.default;'
    };
    options.alias = {
      '@core': '@agent-forge/core',
      '@llm-providers': '@agent-forge/llm-providers',
      '@tools': '@agent-forge/tools',
      '@utils': '@agent-forge/utils'
    };
  }
});
