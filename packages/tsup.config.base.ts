import type { Options, Format } from 'tsup';
import path from 'path';

export const BuildFormat = {
  CJS: 'cjs',
  ESM: 'esm'
} as const;

export type BuildFormat = typeof BuildFormat[keyof typeof BuildFormat];

export interface BuildConfig extends Options {
  name?: string;
  external?: string[];
  noExternal?: string[];
}

export function createConfig(options: Partial<BuildConfig> = {}): BuildConfig {
  const isProduction = process.env.NODE_ENV === 'production';

  const config: BuildConfig = {
    clean: true,
    dts: true,
    format: ['cjs', 'esm'],
    minify: isProduction,
    sourcemap: true,
    splitting: false,
    treeshake: true,
    target: 'es2020',
    outDir: 'dist',
    entry: ['src/index.ts'],
    platform: 'node',
    shims: true,
    skipNodeModulesBundle: true,
    keepNames: true,
    env: {
      NODE_ENV: process.env.NODE_ENV || 'development'
    },
    ...options,
    esbuildOptions(opts, ctx) {
      opts.mainFields = ['module', 'main'];
      opts.conditions = ['import', 'require'];
      
      opts.footer = {
        js: 'if (exports.default) module.exports = exports.default;'
      };
      
      if (isProduction) {
        opts.minify = true;
        opts.legalComments = 'none';
        opts.drop = ['console', 'debugger'];
      }

      if (options.esbuildOptions) {
        options.esbuildOptions(opts, ctx);
      }
    }
  };

  return config;
}