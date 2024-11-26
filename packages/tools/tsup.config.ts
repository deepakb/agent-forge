import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  sourcemap: true,
  target: 'es2020',
  outDir: 'dist'
});
