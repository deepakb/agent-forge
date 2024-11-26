import { createConfig } from '../tsup.config.base';
import path from 'path';

// LLM Providers package configuration
export default createConfig({
  name: '@agent-forge/llm-providers',
  noExternal: ['@agent-forge/core', '@agent-forge/utils'],
  splitting: false,
  platform: 'node',
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
    entry: {
      index: 'src/index.ts'
    }
  },
  esbuildOptions(options) {
    // Common module resolution
    options.mainFields = ['module', 'main'];
    options.conditions = ['import', 'require'];
    
    // Path aliases
    options.alias = {
      '@core': path.resolve(__dirname, '../core/src'),
      '@utils': path.resolve(__dirname, '../utils/src')
    };
  }
});
