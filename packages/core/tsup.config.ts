import { createConfig } from '../tsup.config.base';
import path from 'path';

export default createConfig({
  name: '@agent-forge/core',
  noExternal: [],
  esbuildOptions(options) {
    options.alias = {
      '@core': path.resolve(__dirname, './src')
    };
  }
});
