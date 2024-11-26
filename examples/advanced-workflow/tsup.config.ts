import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node18',
  platform: 'node',
  sourcemap: true,
  clean: true,
  dts: true,
  treeshake: true,
  minify: true,
  esbuildOptions(options) {
    options.mainFields = ['module', 'main'];
    options.conditions = ['import'];
  },
});
