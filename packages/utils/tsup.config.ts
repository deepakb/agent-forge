const { createConfig } = require('../tsup.config.base');
const path = require('path');

// Utils package configuration
module.exports = createConfig({
  name: '@agent-forge/utils',
  noExternal: [],
  splitting: false,
  platform: 'node',
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
    entry: {
      index: 'src/index.ts'
    }
  },
  esbuildOptions(options: { 
    mainFields?: string[];
    conditions?: string[];
    alias: Record<string, string>;
    footer?: { js: string };
  }) {
    // Common module resolution
    options.mainFields = ['module', 'main'];
    options.conditions = ['import', 'require'];
    
    // Path aliases
    options.alias = {
      '@utils': path.resolve(__dirname, './src')
    };
  }
});
