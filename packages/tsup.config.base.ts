import { defineConfig } from 'tsup';

interface PackageConfig {
  name: string;
  noExternal?: string[];
  splitting?: boolean;
  platform?: 'node' | 'browser';
  format?: ('cjs' | 'esm')[];
  dts?: {
    resolve?: boolean;
    entry?: Record<string, string>;
  };
  esbuildOptions?: (options: any) => void;
}

export function createConfig(config: PackageConfig): any {
  return defineConfig({
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    format: config.format ?? ['esm', 'cjs'],
    minify: false,
    sourcemap: true,
    target: 'es2020',
    noExternal: config.noExternal ?? [],
    splitting: config.splitting ?? false,
    treeshake: true,
    platform: config.platform ?? 'node',
    outDir: 'dist',
    onSuccess: 'tsc --emitDeclarationOnly --declaration',
    esbuildOptions: (options) => {
      options.mainFields = ['module', 'main'];
      options.conditions = ['import', 'require'];
      if (config.esbuildOptions) {
        config.esbuildOptions(options);
      }
    },
  });
}