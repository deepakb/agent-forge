import type { Options, Format } from 'tsup';
const { ConfigManager } = require('@utils/config');

// Define formats as string literals instead of const enum
const BuildFormat = {
  CJS: 'cjs',
  ESM: 'esm'
} as const;

type BuildFormat = typeof BuildFormat[keyof typeof BuildFormat];

// Configuration interface for better type safety
interface BuildConfig extends Options {
  name?: string;
  external?: string[];
  noExternal?: string[];
}

// Default formats
const formats: Format[] = [BuildFormat.CJS, BuildFormat.ESM];

// Base configuration with environment-aware settings
const baseConfig: BuildConfig = {
  clean: true,
  dts: {
    resolve: true,
    entry: {},
    compilerOptions: {
      moduleResolution: 'node',
      emitDeclarationOnly: true,
    }
  },
  format: formats,
  minify: process.env['NODE_ENV'] === 'production',
  sourcemap: true,
  splitting: true,
  treeshake: true,
  target: 'es2020',
  outDir: 'dist',
  entry: ['src/index.ts'],
  platform: 'node',
  shims: true,
  skipNodeModulesBundle: true,
  keepNames: true,
  env: {
    NODE_ENV: process.env['NODE_ENV'] || 'development'
  }
};

// Enhanced configuration creator with better type safety and defaults
function createConfig(options: Partial<BuildConfig> = {}): BuildConfig {
  const configManager = ConfigManager.getInstance();
  const isProduction = configManager.getEnvironment() === 'production';

  const config: BuildConfig = {
    ...baseConfig,
    ...options,
    esbuildOptions(opts, ctx) {
      // Common ESBuild options
      opts.footer = {
        js: 'if (module.exports.default) module.exports = module.exports.default;'
      };
      
      // Production optimizations
      if (isProduction) {
        opts.minify = true;
        opts.legalComments = 'none';
        opts.drop = ['console', 'debugger'];
      }

      // Apply custom esbuild options if provided
      if (options.esbuildOptions) {
        options.esbuildOptions(opts, ctx);
      }
    }
  };

  // Apply environment-specific configurations
  if (isProduction) {
    config.sourcemap = false;
    config.clean = true;
  }

  return config;
}

// Export for CommonJS
module.exports = {
  createConfig,
  BuildFormat,
  formats
};

// Export types
export type { BuildConfig, BuildFormat };