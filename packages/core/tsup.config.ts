import { createConfig } from '../tsup.config.base';
import path from 'path';

// Core package configuration
export default createConfig({
  name: '@agent-forge/core',
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
  esbuildOptions(options) {
    options.mainFields = ['module', 'main'];
    options.conditions = ['import', 'require'];
    
    options.alias = {
      '@core': path.resolve(__dirname, './src')
    };
  }
});
