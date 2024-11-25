const { createConfig } = require('../tsup.config.base');
const path = require('path');

// Core package configuration
module.exports = createConfig({
  name: '@agent-forge/core',
  noExternal: [],
  splitting: false, // Core package should be bundled as a single file
  platform: 'node',
  format: ['cjs', 'esm'], // Support both CommonJS and ESM
  dts: {
    resolve: true,
    entry: {
      index: 'src/index.ts'
    }
  },
  esbuildOptions(options: { 
    mainFields: string[];
    conditions: string[];
    alias: Record<string, string>;
    footer?: { js: string };
  }) {
    // Common module resolution
    options.mainFields = ['module', 'main'];
    options.conditions = ['import', 'require'];
    
    // Path aliases
    options.alias = {
      '@core': path.resolve(__dirname, './src')
    };
  }
});
