import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/logging/index.ts'],
  format: ['esm', 'cjs'],
  dts: false,
  sourcemap: true,
  clean: false,
  target: 'es2020',
  outDir: 'dist',
  noExternal: ['@agent-forge/utils']
});
