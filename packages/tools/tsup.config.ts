import { createConfig } from '../tsup.config.base';
import path from 'path';

export default createConfig({
  name: '@agent-forge/tools',
  noExternal: ['@agent-forge/core', '@agent-forge/utils'],
  esbuildOptions(options) {
    options.alias = {
      '@core': path.resolve(__dirname, '../core/src'),
      '@utils': path.resolve(__dirname, '../utils/src')
    };
  }
});
