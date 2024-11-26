import { defineConfig } from 'tsup';

// LLM Providers package configuration
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: false,
  sourcemap: true,
  clean: false,
  target: 'es2020',
  outDir: 'dist',
  noExternal: ['@agent-forge/core', '@agent-forge/utils']
});
