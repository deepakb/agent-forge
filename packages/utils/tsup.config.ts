import { createConfig } from '../tsup.config.base';
import path from 'path';

// Utils package configuration
export default createConfig({
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
  esbuildOptions(options) {
    // Common module resolution
    options.mainFields = ['module', 'main'];
    options.conditions = ['import', 'require'];
    
    // Path aliases
    options.alias = {
      '@utils': path.resolve(__dirname, './src')
    };
  }
});
