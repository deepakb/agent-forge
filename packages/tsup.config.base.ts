import { defineConfig, Options } from 'tsup';

interface PackageConfig {
  name: string;
  entry?: string[];
  external?: string[];
  noExternal?: string[];
  platform?: 'node' | 'browser';
  additionalOptions?: Partial<Options>;
}

export function createConfig(config: PackageConfig) {
  const entry = config.entry ?? ['src/index.ts'];
  const external = config.external ?? [];
  const noExternal = config.noExternal ?? [];

  return defineConfig({
    entry,
    format: ['esm'],
    target: 'node18',
    platform: config.platform ?? 'node',
    splitting: true,
    sourcemap: true,
    clean: true,
    dts: {
      entry,
      resolve: true,
    },
    treeshake: true,
    minify: true,
    external,
    noExternal,
    esbuildOptions(options) {
      options.mainFields = ['module', 'main'];
      options.conditions = ['import'];
    },
    ...config.additionalOptions,
  });
}